# tiny-hooks

## 0.2.0

### Minor Changes

- 70fa9b0: Add a new hook `useStep` to the Library. This hook provides step-based state management.
- e398a6a: Add a new hook `useRedirect` for handling URL-based redirection.
- 56b7714: Add a new hook `useBoolean` that manages a boolean state.

### Patch Changes

- bc514ed: Fix `useToggle` to use `Object.is` internally for value comparisons. This ensures correct behavior for edge cases like NaN and -0.
