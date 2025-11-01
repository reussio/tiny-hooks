---
"tiny-hooks": patch
---

Fix `useToggle` to use `Object.is` internally for value comparisons. This ensures correct behavior for edge cases like NaN and -0.
