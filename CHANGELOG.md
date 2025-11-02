# tiny-hooks

## 1.0.0

### Minor Changes

- 6b60099: Add new `useLocalStorage` hook
- 124136f: Add new `useThrottle` hook
- 213fb11: Add new `useDebounce` hook
- ba76d0d: Add new `useSessionStorage` hook
- 1d0691a: Add new `useScrollProgress` hook
- 227ff02: Add new `useStopwatch` hook
- ce0c93a: Add new `useClipboard` hook
- 706b55b: Add new `useClickAnywhere` hook
- a276371: Add new `useBrowserCapabilities` hook
- 157e5de: Add new `useIsClient` hook
- c0cbb53: Add new `useEventListener` hook
- 40cab33: Add new `useOnlineStatus` hook
- b4e5770: Add new `usePrevious` hook
- f2f582e: Add new `useHover` hook
- 49ba1dd: Add new `useCounter` hook
- 8764026: Add new `useClickOutside` hook
- 0f39470: Add new `useIsMounted` hook

## 0.2.0

### Minor Changes

- 70fa9b0: Add a new hook `useStep` to the Library. This hook provides step-based state management.
- e398a6a: Add a new hook `useRedirect` for handling URL-based redirection.
- 56b7714: Add a new hook `useBoolean` that manages a boolean state.

### Patch Changes

- bc514ed: Fix `useToggle` to use `Object.is` internally for value comparisons. This ensures correct behavior for edge cases like NaN and -0.
