# DECISIONS.md

## 1. Problems Identified

The initial codebase had several architectural and performance issues:

- All application state was managed inside a single class component, leading to tight coupling and heavy prop drilling. This makes the code harder to scale and maintain as the application grows.
- Derived state (`filteredTasks`) was stored separately, creating a risk of data inconsistency when the source state changes.
- Filtering logic was executed on every render without memoization, which becomes inefficient with large datasets (500+ tasks).
- The application rendered all tasks at once, causing performance issues due to excessive DOM nodes and re-renders.
- API calls were handled directly inside the component without proper abstraction, loading indicators, or error feedback, resulting in poor user experience.
- Components like TaskCard were not optimized, leading to unnecessary re-renders and noticeable UI lag during search input.

These issues would negatively impact performance, maintainability, and user experience in a production environment.

---

## 2. State Management Approach

I refactored the application to use React functional components with hooks and localized state management.

- `useState` was used to manage component-level state such as tasks, filters, and UI state.
- `useMemo` was used to compute derived data like filtered tasks and task counts efficiently.
- `useCallback` was used to ensure stable function references, improving performance when used with memoized components.
- `React.memo` was applied to TaskCard to prevent unnecessary re-renders.

I chose this approach because the application is relatively small and does not require a global state management solution.

Alternatives considered:

- Context API: Useful for reducing prop drilling, but not necessary at this scale.
- Redux or external libraries: Rejected due to added complexity and overhead for a small application.

---

## 3. Feature Implementation

I implemented pagination (Option C) to improve performance and usability.

- Limited the number of rendered tasks per page to reduce DOM load.
- Added navigation controls (Next/Previous).
- Reset pagination when filters or search terms change to maintain correct user context.

This significantly improves rendering performance and responsiveness.

---

## 4. Future Improvements

With more time, I would:

- Introduce Context API to further reduce prop drilling.
- Add unit and integration tests for all major components.
- Implement virtualization (e.g., react-window) for even better performance with large datasets.
- Improve accessibility (keyboard navigation and ARIA roles).
- Add better error handling and user feedback (toasts or inline messages).
- Make pagination size configurable via UI.

I focused on high-impact improvements first, particularly performance and code structure, to ensure the application remains scalable and maintainable.
