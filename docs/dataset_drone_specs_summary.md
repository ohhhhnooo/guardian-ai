# ДАТАСЕТ ДРОНОВ

## Основные цифры

- **42 модели дронов**
- **20 брендов**: DJI, Parrot, Autel, Skydio, Freefly, Wingtra, senseFly, T-DRONES, Yamaha, EHang и другие
- **4 категории**: Мультикоптеры (32), гибридные VTOL (5), фиксированное крыло (4), VTOL (1)
- **Источник**: официальная документация производителей
- **Актуальность**: 2024-2025 год

---

## Что находится в датасете

### Основные параметры для каждого дрона:

```
drone_id              — уникальный идентификатор (lowercase_underscore)
brand                 — производитель
model                 — модель
category              — категория (multirotor/fixed_wing/hybrid_vtol/vtol)
max_wind_mps          — макс. скорость ветра в м/с (из спецификаций)
temp_min_c            — минимальная рабочая температура °C
temp_max_c            — максимальная рабочая температура °C
allow_precip_mmph     — допустимые осадки (0 = нет, >0 = разрешены)
min_visibility_km     — минимальная видимость для полёта км
ip_rating             — защита от влаги/пыли (IP43, IP45, IP53, IP55 и т.д.)
mtow_kg               — максимальный вес при взлёте (кг)
weight_kg             — вес дрона (кг)
max_flight_time_min   — макс. время полёта в минутах
```

---

## Распределение по производителям

```
DJI                     10 моделей  ███████████████ 24%
Parrot                   5 моделей  ███████ 12%
T-DRONES                 4 модели   █████ 10%
Autel                    3 модели   ████ 7%
Skydio                   2 модели   ███ 5%
senseFly                 2 модели   ███ 5%
Generic                  2 модели   ███ 5%
Freefly, Trinity, Yuneec, Wingtra, Alti, Quantum, Yamaha,
EHang, Walkera, Insitu, Elios, Aeryon, PrecisionHawk        по 1 модели каждый (28%)
```

---

## Диапазоны параметров

### Температура
```
Минимум:  -36°C  (Parrot ANAFI USA, ANAFI UKR)
Максимум: +55°C  (Aeryon Coypu)
Типично для consumer: -10…+40°C
Типично для enterprise: -20…+50°C
```

### Ветер
```
Минимум:  10.0 м/с  (Yamaha Fazer R)
Максимум: 15.0 м/с  (DJI Matrice 300 RTK, Parrot ANAFI USA/UKR, T-DRONES VA23, Aeryon Coypu, Alti Transition, Walkera Voyager 4)
Средний:  ~12 м/с
```

### IP-рейтинги (защита от влаги/пыли)
```
IP43  — Freefly Alta X (защита от воды под углом)
IP44  — Aeryon Coypu (защита от брызг)
IP45  — DJI Matrice 300 RTK, Generic WRD (защита от водяных струй)
IP53  — Parrot ANAFI Ai, USA, UKR (защита от пыли и воды)
IP55  — DJI Matrice 350 RTK (более высокая защита)
```

### Поддержка осадков
```
Могут летать в дождь:
  - DJI Matrice 300 RTK (2.0 мм/ч)
  - DJI Matrice 350 RTK (2.0 мм/ч)
  - Aeryon Coypu (1.0 мм/ч)
  - Generic WRD Class (50.0 мм/ч — синтетический)

Запрещены при осадках (остальные 38 дронов)
```

## Статистика по категориям

### Мультикоптеры (32 дрона) — универсальные, вертикальный взлёт
```
DJI (10): Mavic 3E, 3T, Mini 4 Pro, Mini 3 Pro, Air 3S, Mavic 4 Pro, Avata 2, Matrice 300/350 RTK
Parrot (5): ANAFI Ai, USA, UKR, Work
Autel (3): EVO II Enterprise, EVO II Dual 640T V3, EVO Max 4T
И другие: Freefly Alta X, Skydio X10/X2D, Yuneec H520E, T-DRONES M690Pro/M1200/MX860,
Yamaha Fazer R, EHang EH216-S, Elios 3, Aeryon SureFly/Coypu
```

### Гибридные VTOL (5 дронов) — вертикальный взлёт + эффективный полёт
```
Wingtra One, Trinity F90+, Alti Transition, Quantum Trinity F90, Walkera Voyager 4
Превосходство: дольше летают, больше покрытие, эффективнее топливо
```

### Фиксированное крыло (4 дрона) — только горизонтальный взлёт
```
senseFly eBee X, eBee SV, Insitu ScanEagle 3, PrecisionHawk Lancaster
Лучше для: масштабные съёмки, дальние полёты, картографирование
```

### VTOL (1 дрон)
```
T-DRONES VA23 — особенный: 240 мин полёта (!), грузоподъёмность, экстремальные условия
```
