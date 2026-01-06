#!/usr/bin/env python3
"""
Скрипт для обучения модели безопасности полёта дронов.

Обрабатывает:
1. Паспортные данные дронов (drone_specs.csv)
2. Погодные данные (data.grib -> weather.csv)
3. Генерирует обучающий датасет с метками safety_index
4. Обучает XGBoost модель для предсказания индекса безопасности
"""

import os
import sys
import pandas as pd
import numpy as np
from typing import Dict, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

import xarray as xr
import cfgrib

import xgboost as xgb

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def load_drone_specs(csv_path: str = "data/drone_specs.csv") -> pd.DataFrame:
    """Загружает и анализирует паспортные данные дронов."""
    print("ШАГ 1: Загрузка данных о дронах")

    df = pd.read_csv(csv_path)

    print(f"\nРазмер датасета: {len(df)} строк, {len(df.columns)} столбцов")
    print(f"\nСтолбцы и типы данных:")
    print(df.dtypes)
    print(f"\nПервые 10 строк:")
    print(df.head(10).to_string())

    print(f"\nОсновная статистика по числовым признакам:")
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    print(df[numeric_cols].describe())

    return df


def convert_grib_to_weather_csv(grib_path: str = "data/data.grib",
                                 output_path: str = "data/weather.csv") -> pd.DataFrame:
    """Конвертирует GRIB файл в CSV с погодными данными."""
    print("ШАГ 2: Конвертация GRIB файла в CSV")

    '''
    if not HAS_GRIB:
        return generate_synthetic_weather_data(output_path)
        print("\nWARNING: Библиотеки для GRIB недоступны. Генерирую синтетические погодные данные...")

    if not os.path.exists(grib_path):
        print(f"\nWARNING: Файл {grib_path} не найден. Генерирую синтетические погодные данные...")
        return generate_synthetic_weather_data(output_path)
    '''

    try:
        print(f"\nЧтение GRIB файла: {grib_path}")

        # Открываем GRIB файл
        # Обрабатываем ошибку "multiple values for key 'edition'"
        # которая возникает когда файл содержит сообщения разных редакций GRIB
        try:
            # Пробуем открыть с фильтром по edition=2 (GRIB2)
            ds = xr.open_dataset(grib_path, engine='cfgrib',
                                backend_kwargs={'filter_by_keys': {'edition': 2}})
        except (ValueError, KeyError) as e:
            if 'multiple values' in str(e) or 'edition' in str(e).lower():
                print("Обнаружены сообщения разных редакций GRIB. Используем open_datasets...")
                # Используем open_datasets для обработки всех сообщений
                datasets = cfgrib.open_datasets(grib_path)
                if len(datasets) == 0:
                    raise ValueError("Не удалось открыть GRIB файл")
                # Объединяем все датасеты
                if len(datasets) == 1:
                    ds = datasets[0]
                else:
                    # Объединяем по измерению, если есть несколько датасетов
                    ds = xr.merge(datasets)
            else:
                # Если это другая ошибка, пробуем открыть без фильтров
                try:
                    ds = xr.open_dataset(grib_path, engine='cfgrib')
                except (ValueError, KeyError) as e2:
                    if 'multiple values' in str(e2) or 'edition' in str(e2).lower():
                        # Последняя попытка - используем open_datasets
                        datasets = cfgrib.open_datasets(grib_path)
                        if len(datasets) == 0:
                            raise ValueError("Не удалось открыть GRIB файл")
                        ds = datasets[0] if len(datasets) == 1 else xr.merge(datasets)
                    else:
                        raise e2

        print("\nДоступные переменные в GRIB файле:")
        print(list(ds.data_vars.keys()))
        print("\nКоординаты:")
        print(list(ds.coords.keys()))
        print("\nРазмеры:")
        print(dict(ds.dims))

        # Определяем нужные переменные
        weather_vars = {}

        # Температура на 2м
        temp_vars = ['t2m', '2t', '2m_temperature', 'temperature_2m']
        temp_var = None
        for v in temp_vars:
            if v in ds.data_vars:
                temp_var = v
                break

        # Компоненты ветра на 10м
        u_wind_vars = ['u10', '10u', '10m_u_component_of_wind', 'u_component_of_wind_10m']
        v_wind_vars = ['v10', '10v', '10m_v_component_of_wind', 'v_component_of_wind_10m']
        u_var = None
        v_var = None
        for v in u_wind_vars:
            if v in ds.data_vars:
                u_var = v
                break
        for v in v_wind_vars:
            if v in ds.data_vars:
                v_var = v
                break

        # Порывы ветра
        gust_vars = ['i10fg', '10fg', 'instantaneous_10m_wind_gust', 'wind_gust_10m']
        gust_var = None
        for v in gust_vars:
            if v in ds.data_vars:
                gust_var = v
                break

        # Осадки
        precip_vars = ['tp', 'total_precipitation', 'precipitation']
        precip_var = None
        for v in precip_vars:
            if v in ds.data_vars:
                precip_var = v
                break

        # Облачность
        cloud_vars = ['tcc', 'total_cloud_cover', 'cloud_cover']
        cloud_var = None
        for v in cloud_vars:
            if v in ds.data_vars:
                cloud_var = v
                break

        print(f"\nНайденные переменные:")
        print(f"  Температура: {temp_var}")
        print(f"  Ветер U: {u_var}")
        print(f"  Ветер V: {v_var}")
        print(f"  Порывы: {gust_var}")
        print(f"  Осадки: {precip_var}")
        print(f"  Облачность: {cloud_var}")

        # Извлекаем данные
        data_list = []

        # Определяем координаты времени, широты, долготы
        time_coord = None
        lat_coord = None
        lon_coord = None

        for coord in ['time', 'valid_time', 't']:
            if coord in ds.coords:
                time_coord = coord
                break

        for coord in ['latitude', 'lat']:
            if coord in ds.coords:
                lat_coord = coord
                break

        for coord in ['longitude', 'lon']:
            if coord in ds.coords:
                lon_coord = coord
                break

        if time_coord is None or lat_coord is None or lon_coord is None:
            raise ValueError("Не найдены необходимые координаты в GRIB файле")

        # Преобразуем в DataFrame
        times = ds[time_coord].values
        lats = ds[lat_coord].values
        lons = ds[lon_coord].values

        for t_idx, time_val in enumerate(times):
            for lat_idx, lat_val in enumerate(lats):
                for lon_idx, lon_val in enumerate(lons):
                    row = {
                        'timestamp': pd.to_datetime(time_val),
                        'lat': float(lat_val),
                        'lon': float(lon_val)
                    }

                    # Температура (конвертируем из Кельвинов в Цельсии, если нужно)
                    if temp_var:
                        temp_val = float(ds[temp_var].isel({time_coord: t_idx, lat_coord: lat_idx, lon_coord: lon_idx}).values)
                        if temp_val > 200:
                            temp_val = temp_val - 273.15
                        row['temp_c'] = temp_val

                    # Компоненты ветра
                    if u_var:
                        row['wind_u'] = float(ds[u_var].isel({time_coord: t_idx, lat_coord: lat_idx, lon_coord: lon_idx}).values)
                    if v_var:
                        row['wind_v'] = float(ds[v_var].isel({time_coord: t_idx, lat_coord: lat_idx, lon_coord: lon_idx}).values)

                    # Порывы ветра
                    if gust_var:
                        row['wind_gust'] = float(ds[gust_var].isel({time_coord: t_idx, lat_coord: lat_idx, lon_coord: lon_idx}).values)

                    # Осадки
                    if precip_var:
                        precip_val = float(ds[precip_var].isel({time_coord: t_idx, lat_coord: lat_idx, lon_coord: lon_idx}).values)
                        # Конвертируем из м в мм/ч, если нужно
                        if precip_val < 0.1:
                            precip_val = precip_val * 1000
                        row['precip'] = precip_val

                    # Облачность
                    if cloud_var:
                        cloud_val = float(ds[cloud_var].isel({time_coord: t_idx, lat_coord: lat_idx, lon_coord: lon_idx}).values)
                        # Нормализуем до 0-100%, если нужно
                        if cloud_val <= 1.0:
                            cloud_val = cloud_val * 100
                        row['cloud_cover'] = cloud_val

                    data_list.append(row)

        weather_df = pd.DataFrame(data_list)

        # Вычисляем скорость ветра
        if 'wind_u' in weather_df.columns and 'wind_v' in weather_df.columns:
            weather_df['wind_speed'] = np.sqrt(weather_df['wind_u']**2 + weather_df['wind_v']**2)

        # Если порывы не найдены, оцениваем их
        if 'wind_gust' not in weather_df.columns and 'wind_speed' in weather_df.columns:
            weather_df['wind_gust'] = weather_df['wind_speed'] * 1.3

        # Заполняем пропуски
        weather_df = weather_df.fillna(0)

        print(f"\nСоздан DataFrame с {len(weather_df)} строками")
        print(f"\nПервые 5 строк:")
        print(weather_df.head())

        # Сохраняем в CSV
        weather_df.to_csv(output_path, index=False)
        print(f"\nДанные сохранены в {output_path}")

        return weather_df

    except Exception as e:
        print(f"\nОшибка при чтении GRIB файла: {e}")
        print("Генерирую синтетические погодные данные...")
        return generate_synthetic_weather_data(output_path)

'''
def generate_synthetic_weather_data(output_path: str = "data/weather.csv") -> pd.DataFrame:
    """Генерирует синтетические погодные данные для обучения модели."""
    print("\nГенерация синтетических погодных данных...")

    np.random.seed(42)

    # Генерируем временной ряд (30 дней, каждые 3 часа)
    dates = pd.date_range('2024-01-01', periods=240, freq='3H')

    # Генерируем координаты (примерно для региона Москвы)
    lats = np.linspace(55.0, 56.0, 5)  # 5 точек по широте
    lons = np.linspace(37.0, 38.0, 5)  # 5 точек по долготе

    data_list = []

    for date in dates:
        for lat in lats:
            for lon in lons:
                # Температура: сезонная вариация + случайность
                base_temp = 10 + 15 * np.sin(2 * np.pi * date.dayofyear / 365)
                temp_c = base_temp + np.random.normal(0, 5)

                # Ветер: базовый + случайные порывы
                base_wind = 5 + 3 * np.random.random()
                wind_u = base_wind * np.cos(np.random.uniform(0, 2*np.pi))
                wind_v = base_wind * np.sin(np.random.uniform(0, 2*np.pi))
                wind_speed = np.sqrt(wind_u**2 + wind_v**2)

                # Порывы ветра (обычно на 30% выше скорости ветра)
                wind_gust = wind_speed * (1.2 + 0.3 * np.random.random())

                # Осадки (редко, но бывают)
                precip = 0 if np.random.random() > 0.1 else np.random.exponential(2.0)

                # Облачность (0-100%)
                cloud_cover = np.random.uniform(0, 100)

                data_list.append({
                    'timestamp': date,
                    'lat': lat,
                    'lon': lon,
                    'temp_c': temp_c,
                    'wind_u': wind_u,
                    'wind_v': wind_v,
                    'wind_speed': wind_speed,
                    'wind_gust': wind_gust,
                    'precip': precip,
                    'cloud_cover': cloud_cover
                })

    weather_df = pd.DataFrame(data_list)

    print(f"\nСоздан синтетический DataFrame с {len(weather_df)} строками")
    print(f"\nПервые 5 строк:")
    print(weather_df.head())

    # Сохраняем в CSV
    weather_df.to_csv(output_path, index=False)
    print(f"\nДанные сохранены в {output_path}")

    return weather_df
'''

def calc_wind_penalty(wind_ratio: float) -> float:
    """Вычисляет штраф за скорость ветра."""
    if wind_ratio <= 0.7:
        return wind_ratio * 5  # Мягкий линейный штраф
    elif wind_ratio <= 1.0:
        return 3.5 + (wind_ratio - 0.7) * 20  # Растущий штраф
    else:
        return 3.5 + 6 + (wind_ratio - 1.0) * 30  # Максимальный штраф


def calc_gust_penalty(gust_ratio: float) -> float:
    """Вычисляет штраф за порывы ветра."""
    if gust_ratio <= 1.0:
        return 0
    elif gust_ratio <= 1.3:
        return (gust_ratio - 1.0) * 20  # Растущий штраф
    else:
        return 6 + (gust_ratio - 1.3) * 25  # Максимальный штраф


def calc_temp_penalty(temp_below: float, temp_above: float) -> float:
    """Вычисляет штраф за температуру."""
    penalty = temp_below * 1.0 + temp_above * 0.7
    return min(penalty, 20.0)  # Ограничиваем 20 баллами


def calc_precip_penalty(precip: float, allow_precip: float) -> float:
    """Вычисляет штраф за осадки."""
    if allow_precip == 0 and precip > 0:
        return min(precip * 10, 15.0)  # Большой штраф, если осадки запрещены
    elif allow_precip > 0:
        excess = max(0, precip - allow_precip)
        return min(excess * 5, 15.0)  # Штраф за превышение
    else:
        return 0


def calc_visibility_penalty(vis_km: float, min_visibility_km: float) -> float:
    """Вычисляет штраф за видимость."""
    if vis_km >= min_visibility_km:
        return 0
    else:
        deficit = min_visibility_km - vis_km
        return min(deficit * 5, 10.0)  # До 10 баллов


def calc_safety_index(row: pd.Series) -> float:
    """Вычисляет общий индекс безопасности для строки DataFrame."""
    # Вычисляем ratio и дельты
    wind_ratio = row['wind_speed'] / row['max_wind_mps'] if row['max_wind_mps'] > 0 else 0
    gust_ratio = row['wind_gust'] / row['max_wind_mps'] if row['max_wind_mps'] > 0 else 0

    temp_below = max(0, row['temp_min_c'] - row['temp_c'])
    temp_above = max(0, row['temp_c'] - row['temp_max_c'])

    precip_excess = max(0, row['precip'] - row['allow_precip_mmph'])

    # Видимость (генерируем синтетическую, если нет в данных)
    vis_km = row.get('visibility_km', 10.0)  # По умолчанию хорошая видимость

    # Вычисляем штрафы
    p_wind = calc_wind_penalty(wind_ratio)
    p_gust = calc_gust_penalty(gust_ratio)
    p_temp = calc_temp_penalty(temp_below, temp_above)
    p_precip = calc_precip_penalty(row['precip'], row['allow_precip_mmph'])
    p_vis = calc_visibility_penalty(vis_km, row['min_visibility_km'])

    # Общий штраф
    total_penalty = p_wind + p_gust + p_temp + p_precip + p_vis

    # Индекс безопасности (100 - штраф, ограничен [0, 100])
    safety_index = max(0, min(100, 100 - total_penalty))

    return safety_index


def calc_safety_class(safety_index: float) -> str:
    """Определяет класс безопасности по индексу."""
    if safety_index >= 80:
        return "green"
    elif safety_index >= 60:
        return "yellow"
    else:
        return "red"


def build_training_dataset(drone_specs_df: pd.DataFrame,
                          weather_df: pd.DataFrame,
                          n_samples: Optional[int] = None) -> pd.DataFrame:
    """Создаёт обучающий датасет, объединяя данные дронов и погоды."""
    print("ШАГ 3: Создание обучающего датасета")

    # Если указано количество сэмплов, ограничиваем погодные данные
    if n_samples and n_samples < len(weather_df):
        weather_df = weather_df.sample(n=n_samples, random_state=42)

    # Создаём комбинации дронов и погодных условий
    training_data = []

    # Для каждого дрона создаём записи с разными погодными условиями
    for _, drone_row in drone_specs_df.iterrows():
        # Берём случайную выборку погодных условий
        n_weather_samples = min(20, len(weather_df))  # До 20 записей на дрон
        weather_sample = weather_df.sample(n=n_weather_samples, random_state=42)

        for _, weather_row in weather_sample.iterrows():
            combined_row = {
                'drone_id': drone_row['drone_id'],
                'timestamp': weather_row['timestamp'],
                'lat': weather_row['lat'],
                'lon': weather_row['lon'],
                # Погодные признаки
                'temp_c': weather_row['temp_c'],
                'wind_u': weather_row['wind_u'],
                'wind_v': weather_row['wind_v'],
                'wind_speed': weather_row['wind_speed'],
                'wind_gust': weather_row['wind_gust'],
                'precip': weather_row['precip'],
                'cloud_cover': weather_row['cloud_cover'],
                # Паспортные признаки дрона
                'max_wind_mps': drone_row['max_wind_mps'],
                'temp_min_c': drone_row['temp_min_c'],
                'temp_max_c': drone_row['temp_max_c'],
                'allow_precip_mmph': drone_row['allow_precip_mmph'],
                'min_visibility_km': drone_row['min_visibility_km'],
                'mtow_kg': drone_row['mtow_kg'],
                'category': drone_row['category'],
                'weight_kg': drone_row['weight_kg'],
                'max_flight_time_min': drone_row['max_flight_time_min']
            }
            training_data.append(combined_row)

    train_df = pd.DataFrame(training_data)

    print(f"\nСоздан обучающий датасет: {len(train_df)} строк")

    # Вычисляем дополнительные инженерные признаки
    print("\nВычисление инженерных признаков...")

    train_df['wind_ratio'] = train_df['wind_speed'] / train_df['max_wind_mps']
    train_df['gust_ratio'] = train_df['wind_gust'] / train_df['max_wind_mps']
    train_df['temp_below'] = np.maximum(0, train_df['temp_min_c'] - train_df['temp_c'])
    train_df['temp_above'] = np.maximum(0, train_df['temp_c'] - train_df['temp_max_c'])
    train_df['precip_excess'] = np.maximum(0, train_df['precip'] - train_df['allow_precip_mmph'])

    np.random.seed(42)
    train_df['visibility_km'] = np.random.uniform(0.5, 15.0, len(train_df))

    # Вычисляем safety_index и safety_class
    print("\nВычисление safety_index и safety_class...")
    train_df['safety_index'] = train_df.apply(calc_safety_index, axis=1)
    train_df['safety_class'] = train_df['safety_index'].apply(calc_safety_class)

    print(f"\nРаспределение safety_class:")
    print(train_df['safety_class'].value_counts())

    print(f"\nСтатистика safety_index:")
    print(train_df['safety_index'].describe())

    return train_df


def train_xgboost_model(train_df: pd.DataFrame) -> Tuple:
    """Обучает XGBoost модель для предсказания safety_index."""
    print("ШАГ 4: Обучение модели")

    # Подготовка признаков
    feature_cols = [
        # Погодные признаки
        'temp_c', 'wind_speed', 'wind_gust', 'precip', 'cloud_cover',
        # Паспортные признаки
        'max_wind_mps', 'temp_min_c', 'temp_max_c', 'allow_precip_mmph',
        'min_visibility_km', 'mtow_kg', 'weight_kg', 'max_flight_time_min',
        # Инженерные признаки
        'wind_ratio', 'gust_ratio', 'temp_below', 'temp_above', 'precip_excess',
        'visibility_km'
    ]

    # One-hot кодирование категории
    category_dummies = pd.get_dummies(train_df['category'], prefix='category')
    train_df = pd.concat([train_df, category_dummies], axis=1)
    feature_cols.extend(category_dummies.columns.tolist())

    # Убираем пропуски
    X = train_df[feature_cols].fillna(0)
    y = train_df['safety_index']

    # Разделение на train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"\nРазмер обучающей выборки: {len(X_train)}")
    print(f"Размер тестовой выборки: {len(X_test)}")
    print(f"Количество признаков: {len(feature_cols)}")

    # Обучение модели
    print("\nОбучение XGBoost модели...")
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    # Предсказания
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)

    return model, X_train, X_test, y_train, y_test, y_train_pred, y_test_pred, feature_cols


def evaluate_model(y_true: np.ndarray, y_pred: np.ndarray,
                   dataset_name: str = "Test") -> Dict[str, float]:
    """Вычисляет метрики качества модели."""
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)

    print(f"\nМетрики на {dataset_name}:")
    print(f"  MAE:  {mae:.4f}")
    print(f"  RMSE: {rmse:.4f}")
    print(f"  R²:   {r2:.4f}")

    return {'MAE': mae, 'RMSE': rmse, 'R2': r2}


def print_final_report(train_df: pd.DataFrame, model, X_test: pd.DataFrame,
                      y_test: pd.Series, y_test_pred: np.ndarray,
                      feature_cols: list, X_test_idx: pd.Index):
    """Выводит финальный отчёт о результатах обучения."""
    print("ФИНАЛЬНЫЙ ОТЧЁТ")

    # 1. Информация о данных
    print("\n1. ИНФОРМАЦИЯ О ДАННЫХ:")
    print(f"   Размер обучающего датасета: {len(train_df)} строк")
    print(f"   Количество признаков: {len(feature_cols)}")
    print(f"   Использованные признаки:")
    for i, feat in enumerate(feature_cols, 1):
        print(f"     {i:2d}. {feat}")

    # 2. Метрики обучения
    print("\n2. МЕТРИКИ ОБУЧЕНИЯ:")
    test_metrics = evaluate_model(y_test, y_test_pred, "Test")

    # 3. Примеры предсказаний
    print("\n3. ПРИМЕРЫ ПРЕДСКАЗАНИЙ (первые 10 строк тестовой выборки):")

    sample_df = train_df.loc[X_test_idx[:10]].copy()
    sample_df['safety_index_pred'] = y_test_pred[:10]
    sample_df['safety_class_pred'] = sample_df['safety_index_pred'].apply(calc_safety_class)

    display_cols = ['timestamp', 'drone_id', 'temp_c', 'wind_speed',
                    'wind_gust', 'precip', 'safety_index', 'safety_index_pred',
                    'safety_class', 'safety_class_pred']

    print(sample_df[display_cols].to_string(index=False))

    # 4. Важные признаки
    if HAS_XGBOOST and hasattr(model, 'feature_importances_'):
        print("\n4. ТОП-10 ВАЖНЫХ ПРИЗНАКОВ:")
        importances = model.feature_importances_
        feature_importance = list(zip(feature_cols, importances))
        feature_importance.sort(key=lambda x: x[1], reverse=True)

        for i, (feat, imp) in enumerate(feature_importance[:10], 1):
            print(f"   {i:2d}. {feat:30s} {imp:.4f}")
    elif hasattr(model, 'feature_importances_'):
        print("\n4. ТОП-10 ВАЖНЫХ ПРИЗНАКОВ:")
        importances = model.feature_importances_
        feature_importance = list(zip(feature_cols, importances))
        feature_importance.sort(key=lambda x: x[1], reverse=True)

        for i, (feat, imp) in enumerate(feature_importance[:10], 1):
            print(f"   {i:2d}. {feat:30s} {imp:.4f}")


def main():
    """Основная функция для запуска всего пайплайна."""
    print("ОБУЧЕНИЕ МОДЕЛИ БЕЗОПАСНОСТИ ПОЛЁТА ДРОНОВ")

    # Шаг 1: Загрузка данных о дронах
    drone_specs_df = load_drone_specs("data/drone_specs.csv")

    # Шаг 2: Конвертация GRIB в CSV
    weather_df = convert_grib_to_weather_csv("data/data.grib", "data/weather.csv")

    # Шаг 3: Создание обучающего датасета
    train_df = build_training_dataset(drone_specs_df, weather_df, n_samples=1000)

    # Шаг 4: Обучение модели
    model, X_train, X_test, y_train, y_test, y_train_pred, y_test_pred, feature_cols = \
        train_xgboost_model(train_df)

    # Получаем индексы тестовой выборки для отчёта
    _, X_test_idx, _, _ = train_test_split(
        train_df.index, train_df['safety_index'],
        test_size=0.2, random_state=42
    )

    # Шаг 5: Оценка модели
    print("ШАГ 5: Оценка модели")
    train_metrics = evaluate_model(y_train, y_train_pred, "Train")
    test_metrics = evaluate_model(y_test, y_test_pred, "Test")

    # Шаг 6: Финальный отчёт
    print_final_report(train_df, model, X_test, y_test, y_test_pred, feature_cols, X_test_idx)

    print("ОБУЧЕНИЕ ЗАВЕРШЕНО")


if __name__ == "__main__":
    main()
