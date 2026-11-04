# TaskFlow

TaskFlow is a responsive task dashboard built with Next.js 16, React 19, TypeScript, and SCSS modules. It groups tasks by project owner, supports task and comment forms, and includes light and dark themes.

## Requirements

- Node.js 20.9 or later
- npm

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to reach the login screen. Choose a GraphQLZero user to enter a private workspace showing only that user's tasks and comments. The mock session persists in local storage; use **Log out** to return to the login screen. The app uses the public GraphQLZero endpoint; no API key or environment file is required.

## Project checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## React 19 feature map

- **Form actions and `useActionState`:** task creation and validation in `src/components/organisms/TaskForm/TaskForm.tsx`; new tasks are assigned automatically to the signed-in user without a project selector. Edit and delete actions are coordinated by `src/hooks/useTaskListActions.ts`, with edit and delete UI in the `TaskEditDialog` and `DeleteConfirmation` molecules.
- **`useFormStatus`:** shared submit and pending UI in `src/components/atoms/SubmitButton/SubmitButton.tsx`.
- **`useOptimistic`:** completion toggles and rollback in `src/hooks/useTaskListActions.ts`; comment submission and rollback in `src/components/molecules/CommentList/CommentList.tsx`.
- **`use()` and Suspense:** dashboard data and auth context are coordinated in `src/components/pages/TaskDashboardPage.tsx`; task and comments promises in `src/components/organisms/TaskDetails/TaskDetails.tsx`. The dashboard header reads `ThemeContext` only when authenticated, and task details do the same after validating access.
- **Context as a provider:** `ThemeProvider` renders `<ThemeContext value={...}>` in `src/context/ThemeContext.tsx`.
- **Ref as a prop and ref cleanup:** `Input` accepts a regular `ref` prop and uses a cleanup-returning `ResizeObserver` callback in `src/components/atoms/Input/Input.tsx`.
- **Deferred search:** `useDeferredValue(search, "")` keeps typing responsive while GraphQLZero search requests run in `src/components/pages/TaskDashboardPage.tsx`.
- **`<Activity>`:** open and completed task tabs retain their state while hidden in `src/components/organisms/TaskStatusBoard/TaskStatusBoard.tsx`.
- **`useEffectEvent`:** theme synchronization reads the latest theme when a backgrounded tab becomes visible in `src/context/ThemeContext.tsx`.
- **Task details comments:** the detail route fetches and displays comments from the task owner's GraphQLZero posts; access remains limited to the signed-in owner.
- **Resource preinitialization:** `preinit` loads `public/theme-init.js` early to apply a saved theme before hydration; Next.js also preloads the local Geist font configured in `src/app/layout.tsx`.
- **Document metadata:** task details render a title and description meta tag from `src/components/organisms/TaskDetails/TaskDetails.tsx`.
- **Mock authentication:** user session context and local-storage persistence live in `src/context/AuthContext.tsx`; the login gate, header selector, and logout action are composed in `src/components/organisms/LoginGate/LoginGate.tsx`, `src/components/organisms/DashboardHeader/DashboardHeader.tsx`, and `src/components/pages/TaskDashboardPage.tsx`.
- **Stylesheet precedence:** the dashboard loads its page stylesheet with `rel="stylesheet"` and `precedence` in `src/components/templates/DashboardWorkspace/DashboardWorkspace.tsx`.
- **Breadcrumb navigation:** task detail navigation is rendered by `src/components/molecules/Breadcrumb/Breadcrumb.tsx`.
- **Error boundaries and logging:** component and route errors are presented and logged by `src/components/ErrorBoundary.tsx`, `src/app/error.tsx`, and `src/app/global-error.tsx`; uncaught browser errors and rejections are logged from `src/instrumentation-client.ts`. Next.js owns the App Router's React root, so its `createRoot` callbacks (`onCaughtError` / `onUncaughtError`) cannot be configured by application code; these framework-supported handlers provide the equivalent logging coverage.

## Data behavior

GraphQL operations and response types live in `src/graphql/`. The client checks HTTP and GraphQL errors and omits `variables` from the POST body when they are absent or empty. Task queries use the authenticated user's `todos(options)` with API-side pagination, text search, and title sorting; comments are loaded from that user's posts. If requests fail, TaskFlow logs the failure, displays a status message, and uses bundled sample data when available. GraphQLZero mutations are not persistent, so successful task/comment writes are retained in client state for the current session; optimistic task and comment updates roll back when a request fails.

## Component structure

The interface follows atomic design under `src/components/`: reusable controls and content pieces live in `atoms/` and `molecules/`, dashboard sections in `organisms/`, and composed page layouts in `templates/`. `pages/TaskDashboardPage.tsx` now coordinates authentication and dashboard hooks rather than containing the whole interface. API mapping and pagination helpers live in `src/lib/dashboard-data.ts`; task/comment state and mutations live in focused hooks under `src/hooks/`. SCSS modules are colocated with their components, while shared dashboard tokens/layout helpers live in `src/app/styles/`.

## Styling

Global theme tokens and reset styles are in `src/app/globals.scss`. The design defaults to dark mode and supports `[data-theme="light"]`; component styling is isolated in SCSS modules. Layout dimensions and typography use pixel units. The edit-task dialog prevents background scrolling while open.
