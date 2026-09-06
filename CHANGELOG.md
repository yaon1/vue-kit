# Changelog

## [0.2.0] — 2026-10-19

### Добавлено
- Компоненты: `VkButton`, `VkSpinner`, `VkDialog` (в т.ч. боковая панель), `VkTabs`, `VkTooltip`, `VkPagination`, `VkSwitch`, `VkCheckbox`, `VkBadge`, `VkAlert`, `VkSkeleton`, `VkProgress`, `VkAccordion`, `VkMenu`, `VkField`, `VkInput`, `VkTextarea`, `VkSelect`, `VkAvatar`, `VkBreadcrumbs`, `VkEmptyState`, `VkCard`, `VkKbd`, `VkCopyButton`.
- Композаблы: `useTheme`, `useFocusTrap`, `useClickOutside`, `useMediaQuery`, `useDebounced`.
- `VkDataTable`: выбор строк, состояние загрузки, футер, `rowClick`, свои компараторы.
- `VkCombobox`: очистка, серверный поиск, неактивные опции, участие в формах.
- `useToast`: `promise()`, пауза при наведении, не больше 5 тостов.
- Проверки доступности axe-core, пороги покрытия, ESLint и Prettier.

### Исправлено
- `VkField` ссылался на скрытую подсказку при показе ошибки.
- `VkDialog` дважды открывался в браузерах с `showModal`.

## [0.1.0]

- `VkCombobox`, `VkDataTable`, `VkToastHost`.
