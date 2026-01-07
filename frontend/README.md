# Guardian AI Frontend

Современный фронтенд для сервиса планирования полётов дронов с учётом погоды.

## Технологический стек

- **Next.js 14** (App Router) + **TypeScript**
- **Material UI (MUI)** — компонентная библиотека
- **React Query** — управление состоянием сервера и кеширование
- **Zustand** — управление клиентским состоянием (auth)
- **Recharts** — визуализация данных
- **Notistack** — уведомления (snackbar)

## Структура проекта

```
frontend/
├── app/                    # Next.js App Router страницы
│   ├── (protected)/        # Защищённые страницы
│   │   ├── layout.tsx      # Layout с AppLayout для авторизованных
│   │   ├── page.tsx        # Главная страница (/)
│   │   ├── dashboard/      # Дашборд оператора
│   │   ├── flights/        # Планирование полётов
│   │   ├── monitoring/     # Мониторинг активных полётов
│   │   ├── drones/         # Управление дронами
│   │   ├── operators/      # Управление операторами
│   │   ├── analytics/      # Аналитика и отчёты
│   │   └── account/        # Личный кабинет
│   ├── login/              # Страница входа
│   ├── register/           # Страница регистрации
│   └── layout.tsx           # Корневой layout (провайдеры)
├── components/             # React компоненты
│   ├── layout/             # AppLayout (AppBar, Drawer)
│   ├── weather/             # Компоненты погоды
│   │   ├── WeatherCard.tsx
│   │   ├── WeatherTimeline.tsx
│   │   ├── SafetyIndicator.tsx
│   │   ├── SafetyDetails.tsx
│   │   ├── SafeWindowsList.tsx
│   │   └── MicroclimateMap.tsx
│   ├── flights/             # Компоненты планирования
│   │   ├── RouteSummaryCard.tsx
│   │   └── RouteMap.tsx
│   ├── monitoring/          # Компоненты мониторинга
│   │   ├── ActiveFlightsList.tsx
│   │   └── FlightCard.tsx
│   └── analytics/           # Компоненты аналитики
│       ├── AnalyticsCards.tsx
│       ├── FlightsSuccessChart.tsx
│       ├── DowntimeChart.tsx
│       └── EconomyChart.tsx
├── lib/                     # Утилиты и API
│   ├── api/                 # API клиенты (моки)
│   │   ├── authApi.ts
│   │   ├── weatherApi.ts
│   │   ├── dronesApi.ts
│   │   ├── operatorsApi.ts
│   │   ├── flightsApi.ts
│   │   └── analyticsApi.ts
│   └── queryClient.ts       # React Query конфигурация
├── store/                   # Zustand stores
│   └── authStore.ts         # Store для авторизации
├── hooks/                   # Custom hooks
│   ├── useWeather.ts        # Хук для работы с погодой
│   └── useSnackbar.ts       # Хук для уведомлений
├── types/                   # TypeScript типы
│   └── domain.ts            # Доменные типы
├── theme/                   # MUI тема
│   └── theme.ts
└── middleware.ts            # Next.js middleware (защита роутов)
```

## Основные страницы

### `/` — Главная
- Форма быстрого запроса «Можно ли лететь сейчас?»
- Выбор дрона, локации, окна времени
- Отображение `safety_index`, `safety_class`, рекомендаций

### `/dashboard` — Дашборд оператора
- Карточка текущей локации и прогноза
- Список ближайших «окон безопасности»
- Список активных полётов

### `/flights` — Планирование полётов
- Форма планирования нового полёта
- Автопланировщик / ручной маршрут
- Визуализация маршрута и рекомендаций

### `/monitoring` — Мониторинг
- Таблица активных полётов
- Детали конкретного полёта
- Уведомления при падении `safety_index` < 60

### `/analytics` — Аналитика
- Графики успешности полётов vs погода
- Статистика простоев
- Экономические метрики

### `/drones` — Управление дронами
- Список дронов пользователя
- Форма добавления/редактирования

### `/operators` — Управление операторами
- Таблица операторов
- Форма добавления/редактирования

### `/account` — Личный кабинет
- Профиль пользователя
- Информация о роли

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Запуск production-сервера
npm start
```

Приложение будет доступно по адресу `http://localhost:3000`

## API моки

Все API вызовы используют моки (функции в `lib/api/*`). Для подключения реального бэкенда:

1. Замените функции в `lib/api/*` на реальные HTTP-запросы (fetch/axios)
2. Обновите базовые URL в конфигурации
3. Добавьте обработку ошибок и токены авторизации

## Авторизация

- Используется Zustand store с persist middleware (localStorage)
- Защита роутов через middleware и проверку в `(protected)/layout.tsx`
- Публичные роуты: `/login`, `/register`

## Стиль и дизайн

- Material Design принципы (elevation, карточки, адаптивность)
- Вдохновение: ChatGPT, Linear, Notion (чистый, современный дизайн)
- Поддержка светлой темы (структура для тёмной темы готова)
- Адаптивный дизайн (мобильные, планшеты, десктоп)

## Компоненты погоды

- **WeatherCard** — текущие условия (температура, ветер, осадки, видимость, давление, облачность)
- **WeatherTimeline** — график на 1–6 часов (температура, ветер, индекс безопасности)
- **SafetyIndicator** — крупное отображение индекса безопасности (0–100, green/yellow/red)
- **SafetyDetails** — детали вклада факторов в риск
- **SafeWindowsList** — список безопасных окон для полёта
- **MicroclimateMap** — упрощённая карта для выбора локации

## Планирование полётов

- Форма с выбором дрона, локации, времени, режима
- **RouteSummaryCard** — сводка маршрута (расстояние, высота, индекс безопасности)
- **RouteMap** — визуализация маршрута на карте

## Мониторинг

- Polling каждые 10 секунд для активных полётов
- Автоматические уведомления (snackbar) при падении `safety_index` < 60
- Детальная карточка полёта с таймлайном

## Аналитика

- **AnalyticsCards** — summary метрики (успешность, часы, предупреждения, экономия)
- **FlightsSuccessChart** — успех/неуспех vs условия (bar chart)
- **DowntimeChart** — простои из-за погоды (bar chart)
- **EconomyChart** — экономические метрики (ROI, выгоды/потери)

## Типизация

Все основные сущности типизированы в `types/domain.ts`:
- `WeatherData`, `ForecastPoint`, `SafetyResult`
- `Drone`, `Operator`, `Flight`, `User`
- `FlightPlan`, `AnalyticsData`

## Дальнейшее развитие

- Подключение реального бэкенда
- WebSocket для real-time мониторинга
- Интеграция с Leaflet/Mapbox для карт
- Тёмная тема
- Расширенная аналитика
- Экспорт отчётов (PDF/Excel)

