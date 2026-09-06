# Как внести вклад

```bash
npm i
npm run dev        # playground
npm test
npm run lint && npm run typecheck
```

Новый компонент:

1. `src/<name>/Vk<Name>.vue` + `Vk<Name>.test.ts` рядом.
2. Экспорт в `src/index.ts`.
3. Проверка в `src/a11y.test.ts`, если у компонента есть роль или интерактивность.
4. Секция в `playground/App.vue` и строка в таблице README.

Принципы:

- Сначала нативный элемент (`<dialog>`, `<select>`, `<input type="checkbox">`), ARIA — только если нативного нет.
- Все цвета и радиусы — через `--vk-*` переменные, обе темы.
- Никаких зависимостей, кроме `vue`.
- Коммиты в формате [Conventional Commits](https://www.conventionalcommits.org/ru/).
