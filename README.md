# CRM Frontend

Customer Relationship Management (CRM) system frontend application built with modern web technologies.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool (fast development and optimized builds)
- **TanStack Query (React Query)** - Server state management, caching, synchronization
- **Zustand** - Client state management (auth, UI state)
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **ESLint + Prettier** - Code quality

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/       # Shared components (Header, Sidebar, etc.)
│   ├── features/     # Feature-specific components
│   └── layouts/      # Layout components
├── pages/            # Page-level components
├── store/            # Zustand stores
│   ├── authStore.ts  # Authentication state
│   └── uiStore.ts    # UI state (modals, notifications, etc.)
├── services/         # API clients and services
│   └── api.ts        # Axios instance + API methods
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── styles/           # Global styles
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts Vite dev server at `http://localhost:5173` with hot module replacement.

## Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

## Testing

```bash
npm run test
```

Runs Vitest in watch mode.

```bash
npm run test:ui
```

Opens Vitest UI at `http://localhost:51204`.

## Linting

```bash
npm run lint
```

Runs ESLint to check code quality.

```bash
npm run format
```

Runs Prettier to format code.

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_API_BASE_URL=http://localhost:3000/v1
```

## Data Types

All TypeScript types are defined in `src/types/index.ts`:

- **User** - User profile and permissions
- **Contact** - Individual or company contact
- **Deal** - Sales opportunity
- **Task** - Actionable item
- **Activity** - Historical event log
- **Note** - Attached message

See `src/types/index.ts` for full definitions.

## API Integration

The API client is in `src/services/api.ts`. It uses:

- **TanStack Query** for server state management and caching
- **Axios** for HTTP requests
- **Zustand** for client state (auth token, filters, UI state)

Example usage:

```typescript
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api";

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: () => apiClient.getContacts(),
  });
}
```

## State Management

### Zustand Stores

**AuthStore** (`src/store/authStore.ts`):
- `user` - Current user
- `token` - JWT token
- `isAuthenticated` - Auth status
- `login()` - Login with credentials
- `logout()` - Logout
- `refreshToken()` - Refresh JWT

**UIStore** (`src/store/uiStore.ts`):
- `sidebarOpen` - Sidebar visibility
- `modal` - Modal state (type, data)
- `notifications` - Toast notifications
- Various actions to update state

## Component Architecture

### Layout
- **DashboardLayout** - Main app shell with sidebar, header, content area
- **Sidebar** - Navigation menu with logo
- **Header** - Top bar with user menu, notifications

### Pages
- **LoginPage** - Authentication
- **DashboardPage** - Main dashboard with metrics

## Next Steps

1. **Complete feature pages**
   - Contacts list/detail
   - Deals pipeline view
   - Tasks management
   - Reporting

2. **Implement API integration**
   - Connect to backend API
   - Add TanStack Query hooks
   - Handle errors and loading states

3. **Add advanced features**
   - Search and filtering
   - Pagination
   - Bulk operations
   - Real-time updates (WebSocket)

4. **Testing**
   - Unit tests for utilities
   - Component tests for UI
   - Integration tests for workflows

5. **Accessibility & Performance**
   - WCAG 2.1 AA compliance
   - Lighthouse 90+ score
   - Code splitting and lazy loading

## Documentation

See Obsidian vault for:
- **CRM Frontend - Architecture** - Technical architecture
- **CRM Frontend - Requirements** - Feature requirements
- **CRM Frontend - Data Models** - Type definitions
- **CRM Frontend - API Endpoints** - API specification
- **CRM Frontend - Design** - UI/UX design system

## License

TBD
