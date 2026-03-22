# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components (buttons, inputs, cards, dialogs, etc.)
- Do NOT use any other component library (MUI, Chakra, Radix directly, etc.)
- All shadcn/ui components live in `src/components/ui/` and are installed via the shadcn CLI:
  ```bash
  npx shadcn@latest add <component-name>
  ```
- Compose pages and features by combining shadcn/ui primitives only

## Date Formatting

Use **date-fns** for all date formatting. No other date library should be used.

Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use `format` from `date-fns` with the `do MMM yyyy` format string:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // e.g. "1st Sep 2025"
```
