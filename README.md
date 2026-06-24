<p align="center">
  <h1 align="center">BookVerse — Frontend</h1>
  <p align="center">
    A modern, full-featured e-commerce platform for books — built with React 19, TypeScript, and Vite.
    <br />
    Beautiful storefront for customers · Powerful admin dashboard for management · AI-powered chatbot assistant
  </p>
</p>

---

## Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Routing Map](#-routing-map)
- [State Management](#-state-management)
- [API Layer](#-api-layer)
- [Authentication & Authorization](#-authentication--authorization)
- [AI Chatbot](#-ai-chatbot)
- [Admin Dashboard](#-admin-dashboard)
- [UI / UX Highlights](#-ui--ux-highlights)
- [Contributing](#-contributing)
- [License](#-license)

---

## Overview

**BookVerse** is a comprehensive online bookstore application that provides:

- A **customer-facing storefront** with product browsing, advanced search with autocomplete, shopping cart, checkout with multiple payment methods (COD & VNPAY), order tracking, and an AI-powered chatbot for book recommendations.
- An **admin dashboard** with full CRUD management for books, authors, publishers, suppliers, categories, orders, customers, users, roles, and permissions — along with rich analytics powered by interactive charts.

The frontend communicates with a **Spring Boot backend** via RESTful APIs and supports real-time AI chat responses via **Server-Sent Events (SSE)** streaming.

---

## Key Features

### Customer Storefront

| Feature | Description |
|---|---|
| **Home Page** | Hero slider with promotional banners, category grid navigation, and multiple product sections (latest, best-selling, featured) |
| **Product Search** | Real-time autocomplete search with debounced API calls (300ms), showing both keyword suggestions and product thumbnails with images |
| **Product Filtering** | Advanced multi-criteria filtering by category, publisher, publication year, cover format, price range, and sort order (newest, price asc/desc, best-selling) |
| **Product Detail** | Full product page with image gallery (multi-image support with thumbnails), detailed book information (authors, publisher, dimensions, weight, pages, cover format), description section, and review section |
| **Shopping Cart** | Add/remove items, increase/decrease quantities with real-time price calculation, discount display, and empty cart state |
| **Checkout** | Multi-step checkout with Zod schema validation via React Hook Form — supports COD and VNPAY payment methods, auto-fills user info from account, shipping fee calculation, order summary with discount breakdown |
| **VNPAY Integration** | Seamless redirect to VNPAY payment gateway, automatic return handling for both success and failure payment results |
| **Order History** | Paginated list of past orders with order code, status tracking, payment status, and detailed order items |
| **Category Navigation** | Hover-activated dropdown in header showing all book categories fetched from the database, with smooth animations |
| **AI Chatbot** | Floating chatbot widget with SSE streaming responses, session-based conversation history, markdown rendering, quick action buttons, and smooth animations |
| **Authentication** | Login/register forms, automatic account info fetching on page load, user dropdown menu with account options |
| **Responsive Layout** | Consistent layout with Header (top bar + logo + category dropdown + search + cart + account), main content area, Footer, and floating ChatBot |

### Admin Dashboard

| Module | Description |
|---|---|
| **Dashboard Analytics** | Revenue summary cards (total revenue, orders, new customers, products sold, AOV, cancel rate), interactive revenue chart (Recharts AreaChart with day/month grouping), order status breakdown (PieChart), and top products table — all with configurable date range presets and filters |
| **Book Management** | Full CRUD with multi-image upload (batch upload support), author/publisher/supplier/category assignment, pricing with discount, physical attributes (weight, dimensions, pages, cover format) |
| **Author Management** | CRUD with avatar upload, nationality, birthday, and associated books view |
| **Publisher Management** | CRUD with contact details (address, phone, email), description, and logo image |
| **Supplier Management** | CRUD with full contact information and image management |
| **Category Management** | CRUD with name and description, view books in category |
| **Order Management** | Search/filter by order code, status, payment method, payment status, and date range — update order status and payment status |
| **Customer Management** | CRUD with identity card, customer level (loyalty tiers), associated user account, total orders and spending tracking |
| **User Management** | CRUD with role assignment, avatar upload, contact information management |
| **Role Management** | CRUD with granular permission assignment (select from available permissions) |
| **Permission Management** | CRUD for API-level permissions with name, domain, API path, and HTTP method |
| **Sidebar Navigation** | Collapsible admin sidebar with icons and active route highlighting |
| **Breadcrumbs** | Dynamic breadcrumb navigation managed through Redux state |

---

## Tech Stack

### Core Framework

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI component library with latest features (automatic batching, concurrent rendering) |
| [TypeScript](https://www.typescriptlang.org/) | ~5.7 | Static type checking across the entire codebase |
| [Vite](https://vitejs.dev/) | 6 | Lightning-fast dev server with HMR and optimized production builds |

### Routing & State Management

| Technology | Version | Purpose |
|---|---|---|
| [React Router DOM](https://reactrouter.com/) | 7 | Client-side SPA routing with nested layouts, error boundaries, and programmatic navigation |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2 | Centralized global state management for auth, cart, breadcrumbs, and all admin CRUD modules |
| [TanStack React Query](https://tanstack.com/query) | 5 | Server state management with caching, background refetching, placeholder data, and devtools |

### UI & Styling

| Technology | Version | Purpose |
|---|---|---|
| [Ant Design](https://ant.design/) | 6 | Rich UI component library for admin tables, modals, forms, layout (Row/Col grid) |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first CSS framework integrated via `@tailwindcss/vite` plugin |
| [Lucide React](https://lucide.dev/) | 0.503 | Beautiful, consistent SVG icon library used across all pages |
| [Recharts](https://recharts.org/) | 3 | Composable chart library for dashboard analytics (AreaChart, PieChart, Bar) |
| [React Select](https://react-select.com/) | 5 | Enhanced select/dropdown inputs with search, multi-select, and custom styling |

### Forms & Validation

| Technology | Version | Purpose |
|---|---|---|
| [React Hook Form](https://react-hook-form.com/) | 7 | Performant form management with uncontrolled components, minimal re-renders |
| [Zod](https://zod.dev/) | 3 | TypeScript-first schema validation with `@hookform/resolvers` integration |

### Networking & Utilities

| Technology | Version | Purpose |
|---|---|---|
| [Axios](https://axios-http.com/) | 1.8 | HTTP client with request/response interceptors for auth token injection and refresh |
| [async-mutex](https://github.com/DirtyHairy/async-mutex) | 0.5 | Mutex lock to prevent race conditions during concurrent token refresh |
| [use-debounce](https://github.com/xnimorz/use-debounce) | 10 | Debounced callbacks for search autocomplete (300ms delay) |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | 11 | Toast notification system for success/error/info feedback |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (SPA)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  React Router │  │   React      │  │   TanStack Query      │  │
│  │  (Routing)    │  │   Components │  │   (Server State)      │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘  │
│         │                 │                       │              │
│  ┌──────┴─────────────────┴───────────────────────┴───────────┐  │
│  │                    Redux Toolkit Store                      │  │
│  │  ┌─────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────────┐  │  │
│  │  │ account │ │ cart │ │ book │ │ user │ │ ...10 more   │  │  │
│  │  └─────────┘ └──────┘ └──────┘ └──────┘ └──────────────┘  │  │
│  └────────────────────────────┬────────────────────────────────┘  │
│                               │                                  │
│  ┌────────────────────────────┴────────────────────────────────┐  │
│  │                  Axios Instance (Services)                   │  │
│  │  • Auto Bearer token injection from localStorage             │  │
│  │  • 401 → Mutex-guarded token refresh → retry original req    │  │
│  │  • x-no-retry header to prevent infinite refresh loops       │  │
│  │  • 10s timeout, withCredentials: true                        │  │
│  └────────────────────────────┬────────────────────────────────┘  │
│                               │                                  │
├───────────────────────────────┼──────────────────────────────────┤
│                               ▼                                  │
│                    Backend API (Spring Boot)                      │
│                    http://localhost:8080                          │
│                    REST API + SSE Streaming (Chat)                │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Dual State Strategy**: Redux Toolkit for client-side state (auth, cart, UI) + TanStack React Query for server-side data (API caching, background refetch, stale-while-revalidate).

2. **Centralized API Layer**: All 50+ API functions are co-located in a single [`api.ts`](src/services/api.ts) file, fully typed with TypeScript generics (`IBackendRes<T>`, `IPagination<T>`).

3. **Secure Token Management**: JWT access tokens stored in `localStorage`, refresh tokens managed via HTTP-only cookies (`withCredentials: true`). The Axios interceptor uses `async-mutex` to serialize concurrent refresh attempts.

4. **Role-Based Access Control**: `PrivateRoute` component checks `localStorage` for `ADMIN` role, redirecting unauthorized users to the login page. The backend enforces granular API-level permissions.

5. **SSE Streaming for Chat**: The AI chatbot uses native `fetch()` with `ReadableStream` to process Server-Sent Events, enabling real-time token-by-token response streaming.

---

## Project Structure

```
react-bookverse/
├── index.html                          # HTML entry point (title: BookVerse)
├── package.json                        # Dependencies & scripts
├── vite.config.ts                      # Vite config (React + TailwindCSS plugins)
├── tailwind.config.js                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript project references
├── tsconfig.app.json                   # App-specific TS config
├── tsconfig.node.json                  # Node-specific TS config (Vite)
├── eslint.config.js                    # ESLint config (React Hooks + Refresh rules)
├── .env.development                    # Environment variables (backend URL)
│
├── public/                             # Static public assets
│
└── src/
    ├── main.tsx                        # Application entry — mounts React tree
    │                                   #   Provider (Redux) > QueryClientProvider > RouterProvider > ToastContainer
    ├── App.tsx                         # Router definition (createBrowserRouter)
    │                                   #   Client routes, Admin routes (PrivateRoute), Auth routes
    ├── vite-env.d.ts                   # Vite environment type declarations
    │
    ├── assets/                         # Static assets bundled by Vite
    │   ├── logo.png                    #   Full logo image (1.4 MB)
    │   ├── main_logo.png              #   Main logo used in header (183 KB)
    │   ├── react.svg                   #   React favicon
    │   └── banner/                     #   Hero slider banner images
    │
    ├── common/                         # Shared utility functions
    │   ├── formatPrice.tsx             #   VND currency formatter using Intl.NumberFormat('vi-VN')
    │   ├── logout.ts                   #   Logout helper (clear tokens, redirect)
    │   └── showToast.tsx               #   Toast notification wrapper (SUCCESS, ERROR, INFO, WARNING)
    │
    ├── types/
    │   └── backend.d.ts                # All TypeScript interfaces for backend models
    │                                   #   IUser, IBook, IOrder, ICart, IRole, IPermission,
    │                                   #   IAuthor, IPublisher, ISupplier, ICategory, ICustomer,
    │                                   #   IDashboardData, IChatMessage, IBackendRes<T>, IPagination<T>,
    │                                   #   IBookFilterCriteria, ISearchAutocomplete, and more (353 lines)
    │
    ├── services/                       # API & network layer
    │   ├── axios-customize.ts          #   Axios instance configuration
    │   │                               #     - Base URL from VITE_BACKEND_URL
    │   │                               #     - 10s timeout, withCredentials
    │   │                               #     - Request interceptor: injects Bearer token
    │   │                               #     - Response interceptor: 401 → mutex-guarded refresh → retry
    │   ├── api.ts                      #   All API call functions (700+ lines)
    │   │                               #     - 16 modules: Auth, Users, Books, Authors, Publishers,
    │   │                               #       Suppliers, Categories, Roles, Permissions, Customers,
    │   │                               #       Files, Carts, Orders, Dashboard, Chat, Search
    │   └── route-private.tsx           #   PrivateRoute component
    │                                   #     - Checks localStorage role === "ADMIN"
    │                                   #     - Redirects to /login if unauthorized
    │
    ├── redux/                          # Redux Toolkit state management
    │   ├── store.ts                    #   Store configuration with 13 slice reducers
    │   ├── hook.ts                     #   Typed hooks: useAppDispatch, useAppSelector
    │   └── slide/                      #   Redux slices (state + reducers + async thunks)
    │       ├── account.slide.ts        #     Auth state (user info, isAuthenticated, token)
    │       ├── cart.slice.ts           #     Cart item count (sum)
    │       ├── breadcrumbs.slice.ts    #     Dynamic breadcrumb navigation
    │       ├── book.slice.ts           #     Book CRUD state (list, pagination, modal, loading)
    │       ├── author.slice.ts         #     Author CRUD state
    │       ├── publisher.slice.ts      #     Publisher CRUD state
    │       ├── supplier.slide.ts       #     Supplier CRUD state
    │       ├── category.slide.ts       #     Category CRUD state
    │       ├── order.slide.ts          #     Order management state
    │       ├── customer.slide.ts       #     Customer CRUD state
    │       ├── user.slice.ts           #     User CRUD state
    │       ├── role.slide.ts           #     Role CRUD state
    │       ├── permission.slice.ts     #     Permission CRUD state
    │       └── counter.slice.ts        #     Counter example slice
    │
    ├── styles/
    │   ├── index.css                   #   Main CSS (Tailwind imports, custom variables)
    │   └── global.css                  #   Additional global styles (scrollbar, animations)
    │
    ├── components/
    │   ├── global/                     # Shared components
    │   │   └── Pagination.tsx          #   Reusable pagination component with page navigation
    │   │
    │   ├── client/                     # Customer-facing components
    │   │   ├── Header.tsx              #   Main header (395 lines)
    │   │   │                           #     - Top info bar (hotline, free shipping notice)
    │   │   │                           #     - Logo + tagline
    │   │   │                           #     - Category hover dropdown (fetched from DB, cached 5min)
    │   │   │                           #     - Search bar with debounced autocomplete
    │   │   │                           #     - Cart icon with item count badge
    │   │   │                           #     - User dropdown (login/register or account/logout)
    │   │   ├── Footer.tsx              #   Site footer with links and info
    │   │   ├── ChatBot.tsx             #   AI chatbot widget (451 lines)
    │   │   │                           #     - Floating bubble with ripple animation
    │   │   │                           #     - Auto-hide hint tooltip after 8 seconds
    │   │   │                           #     - SSE streaming with real-time token display
    │   │   │                           #     - Markdown parsing (bold, italic, newlines)
    │   │   │                           #     - Session-based history with clear option
    │   │   │                           #     - Quick action suggestion buttons
    │   │   ├── home/
    │   │   │   ├── HeroSlider.tsx      #     Image carousel with auto-play
    │   │   │   ├── CategoryGrid.tsx    #     Grid of book categories with navigation
    │   │   │   └── PromoBanner.tsx     #     Promotional banner section
    │   │   ├── product/
    │   │   │   ├── ProductCard.tsx     #     Book card with image, title, price, discount badge
    │   │   │   ├── ProductSection.tsx  #     Horizontal product section (title + card grid)
    │   │   │   ├── ProductFilter.tsx   #     Advanced sidebar filter (category, publisher, year, price, format)
    │   │   │   ├── ProductSort.tsx     #     Sort dropdown (newest, price, popularity)
    │   │   │   └── ProductDetail/
    │   │   │       ├── ProductImageGallery.tsx  # Multi-image gallery with thumbnail navigation
    │   │   │       ├── ProductInfo.tsx          # Book details, pricing, add-to-cart action
    │   │   │       ├── ProductDescription.tsx   # Rich text description display
    │   │   │       └── ReviewSection.tsx        # Customer reviews and ratings
    │   │   └── cart/
    │   │       ├── CartItem.tsx         #     Individual cart item row (image, quantity controls, price)
    │   │       ├── CartSummary.tsx      #     Order summary sidebar (subtotal, discount, total)
    │   │       └── CartEmpty.tsx        #     Empty cart illustration and CTA
    │   │
    │   └── admin/                      # Admin panel components
    │       ├── sidebar/                #   Collapsible sidebar navigation
    │       ├── dashboard/
    │       │   ├── index.tsx           #   Dashboard wrapper
    │       │   └── component/
    │       │       ├── dashboard.utils.ts       # Date presets, helper functions
    │       │       ├── DashboardFilterBar.tsx    # Date range picker, presets, group-by, top-N
    │       │       ├── DashboardStatCards.tsx    # Summary KPI cards (revenue, orders, AOV, etc.)
    │       │       ├── RevenueChart.tsx          # Recharts AreaChart (revenue over time)
    │       │       ├── OrderStatusBreakdown.tsx  # Recharts PieChart (order status distribution)
    │       │       ├── TopProductsTable.tsx      # Table of best-selling products
    │       │       └── DashboardSkeleton.tsx     # Loading skeleton placeholder
    │       ├── book/                   #   Book CRUD modals (create/edit with multi-image upload)
    │       ├── author/                 #   Author CRUD modals
    │       ├── publisher/              #   Publisher CRUD modals
    │       ├── supplier/               #   Supplier CRUD modals
    │       ├── category/               #   Category CRUD modals
    │       ├── order/                  #   Order management modals
    │       ├── customer/               #   Customer CRUD modals
    │       ├── user/                   #   User CRUD modals
    │       └── role/                   #   Role CRUD modals (with permission picker)
    │
    └── pages/
        ├── auth/
        │   ├── login.tsx               # Login page with form validation
        │   └── register.tsx            # Registration page with form validation
        ├── client/
        │   ├── layout.client.tsx       # Client layout: Header + <Outlet> + Footer + ChatBot
        │   │                           #   Fetches user account on mount, sets Redux state
        │   ├── home.tsx                # Home page: HeroSlider + PromoBanner + CategoryGrid + ProductSections
        │   ├── products.tsx            # Product listing with sidebar filters and pagination (11.6 KB)
        │   ├── product.detail.tsx      # Product detail page (image gallery + info + description + reviews)
        │   ├── cart.tsx                # Shopping cart page with item management
        │   ├── checkout.tsx            # Checkout page (37.6 KB) — shipping form + payment method + order summary
        │   ├── payment-result.tsx      # Payment result page (success/failure) with order details
        │   └── order-history.tsx       # Order history with pagination and status display (19 KB)
        ├── admin/
        │   ├── layout.admin.tsx        # Admin layout: Sidebar + content area
        │   ├── dashboard.admin.tsx     # Dashboard with filter bar, stat cards, charts, top products
        │   ├── book.admin.tsx          # Book management table with search/filter
        │   ├── author.admin.tsx        # Author management table
        │   ├── publisher.admin.tsx     # Publisher management table
        │   ├── supplier.admin.tsx      # Supplier management table
        │   ├── category.admin.tsx      # Category management table
        │   ├── order.admin.tsx         # Order management table with multi-filter
        │   ├── customer.admin.tsx      # Customer management table
        │   ├── user.admin.tsx          # User management table
        │   ├── role.admin.tsx          # Role management table
        │   └── permission.admin.tsx    # Permission management table with method/domain filter
        └── error/
            └── NotFound.tsx            # 404 error page
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | >= 18.x |
| **npm** | >= 9.x (or yarn / pnpm) |
| **Backend API** | Running at `http://localhost:8080` (Spring Boot) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/pltphong12/BookVerse_FE.git
cd react-bookverse

# 2. Install dependencies
npm install

# 3. Create environment file (if not exists)
# The project includes .env.development with default settings

# 4. Start development server
npm run dev
```

The application will be available at **http://localhost:5173** (Vite default port).

### First-Time Setup Checklist

1. Ensure the backend API is running at `http://localhost:8080`
2. Verify `.env.development` contains the correct `VITE_BACKEND_URL`
3. Open `http://localhost:5173` — you should see the BookVerse homepage
4. Register a new account or login with existing credentials
5. Access admin panel at `http://localhost:5173/admin` (requires `ADMIN` role)

---

## Environment Variables

Create a `.env.development` file in the project root:

```env
VITE_BACKEND_URL = http://localhost:8080
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_BACKEND_URL` | Yes | `http://localhost:8080` | Base URL of the BookVerse backend API server. Used by Axios for all API calls and by the ChatBot for SSE streaming endpoint. Also used to construct image URLs for book covers and avatars (`/storage/book/`, `/storage/author/`, etc.) |

> **Note:** Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code via `import.meta.env`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR at `http://localhost:5173` |
| `npm run build` | Type-check with `tsc -b` then create optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the entire project (React Hooks + Refresh rules) |

---

## Routing Map

### Client Routes (Public)

| Path | Component | Layout | Description |
|---|---|---|---|
| `/` | `Home` | `LayoutClient` | Homepage with hero slider, category grid, product sections |
| `/products` | `AllProductsPage` | `LayoutClient` | Product listing with filters, search, and pagination |
| `/product/:id` | `ProductDetailPage` | `LayoutClient` | Individual book details with image gallery and reviews |
| `/cart` | `CartPage` | `LayoutClient` | Shopping cart with item management |
| `/checkout` | `CheckoutPage` | `LayoutClient` | Order checkout with shipping info and payment selection |
| `/payment/success` | `PaymentResultPage` | `LayoutClient` | Payment success confirmation |
| `/payment/failure` | `PaymentResultPage` | `LayoutClient` | Payment failure notification |
| `/order-history` | `OrderHistoryPage` | `LayoutClient` | Customer's past orders |
| `/login` | `InternalLoginPage` | None | Login page (standalone) |
| `/register` | `RegisterPage` | None | Registration page (standalone) |

### Admin Routes (Protected)

All admin routes are wrapped in `<PrivateRoute>` which requires `role === "ADMIN"` in `localStorage`.

| Path | Component | Description |
|---|---|---|
| `/admin` | `DashboardAdmin` | Analytics dashboard with charts and KPIs |
| `/admin/books` | `BookPage` | Book inventory management (CRUD with multi-image) |
| `/admin/authors` | `AuthorPage` | Author management |
| `/admin/publishers` | `PublisherPage` | Publisher management |
| `/admin/suppliers` | `SupplierPage` | Supplier management |
| `/admin/categories` | `CategoryPage` | Book category management |
| `/admin/orders` | `OrderPage` | Order processing and status updates |
| `/admin/customers` | `CustomerPage` | Customer management with loyalty levels |
| `/admin/users` | `UserPage` | Internal user management with role assignment |
| `/admin/roles` | `RolePage` | Role management with permission picker |
| `/admin/permissions` | `PermissionPage` | API permission management (method, domain, path) |

### Error Handling

| Scenario | Behavior |
|---|---|
| Route not found | Renders `<NotFound />` component (React Router `errorElement`) |
| Unauthorized admin access | Redirects to `/login` via `<PrivateRoute>` |

---

## State Management

### Redux Store Structure

The Redux store is configured with **13 slices**, each managing a specific domain:

```typescript
{
  account: {            // Current logged-in user info, isAuthenticated flag, JWT token
    account: IUser | null,
    isAuthenticated: boolean,
  },
  cart: {               // Shopping cart metadata
    sum: number,        // Total number of items in cart
  },
  breadcrumbs: {        // Dynamic admin breadcrumb navigation
    items: Array<{ label: string, path: string }>,
  },
  book: { ... },        // Book CRUD state (list, pagination, modal visibility, selected item)
  author: { ... },      // Author CRUD state
  publisher: { ... },   // Publisher CRUD state
  category: { ... },    // Category CRUD state
  supplier: { ... },    // Supplier CRUD state
  customer: { ... },    // Customer CRUD state
  user: { ... },        // User CRUD state
  role: { ... },        // Role CRUD state
  permission: { ... },  // Permission CRUD state
  order: { ... },       // Order management state
}
```

### Typed Hooks

Custom typed hooks are provided in [`hook.ts`](src/redux/hook.ts) to ensure type safety:

```typescript
// Use these instead of plain useDispatch/useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### React Query Usage

TanStack React Query is used alongside Redux for server-state concerns:

- **Query caching**: Categories are cached for 5 minutes (`staleTime: 5 * 60 * 1000`)
- **Background refetch**: Product data uses `placeholderData` for seamless updates
- **Query invalidation**: Cart queries are invalidated after mutations
- **DevTools**: React Query DevTools are included in development mode

---

## API Layer

All API functions are centralized in [`src/services/api.ts`](src/services/api.ts) (703 lines), organized into **16 modules**:

### Module Overview

| Module | Functions | Key Endpoints |
|---|---|---|
| **Auth** | 5 | `POST /auth/login`, `POST /auth/register`, `GET /auth/refresh`, `GET /auth/me`, `POST /auth/logout` |
| **Books** | 7 | CRUD + `GET /books/search`, `GET /books/top-5-latest`, `GET /books/{id}` |
| **Search** | 2 | `GET /search/autocomplete?query=`, `GET /search/products?title=&categoryId=&...` |
| **Authors** | 5 | CRUD + `GET /authors/search` + `GET /authors` (all) |
| **Publishers** | 5 | CRUD + `GET /publishers/search` + `GET /publishers` (all) |
| **Suppliers** | 6 | CRUD + `GET /suppliers/search` + `GET /suppliers` (all) + `GET /suppliers/{id}` |
| **Categories** | 5 | CRUD + `GET /categories/search` + `GET /categories` (all) |
| **Users** | 4 | CRUD + `GET /users/search` |
| **Customers** | 5 | CRUD + `GET /customers/search` + `GET /customers/{id}` |
| **Roles** | 5 | CRUD + `GET /roles/search` + `GET /roles` (all) |
| **Permissions** | 5 | CRUD + `GET /permissions/search` + `GET /permissions` (all) |
| **Carts** | 5 | `POST /carts/items`, `GET /carts`, `PUT /carts/items/{id}/increase`, `PUT .../decrease`, `DELETE /carts/items/{id}` |
| **Orders** | 5 | `POST /orders`, `GET /orders/search`, `GET /orders/{id}`, `PUT /orders`, `GET /orders/me` |
| **Dashboard** | 1 | `GET /dashboard/overview?fromDate=&toDate=&groupBy=&topN=` |
| **Files** | 2 | `POST /files` (single upload), `POST /files/batch` (multi-upload) |
| **Chat** | 1 | `GET /chat/history?sessionId=` |

### Type Safety

All API functions use TypeScript generics for full type safety:

```typescript
// Example: Fetch books with pagination
export const callFetchAllBooksWithPaginationApi = (...) => {
    return axiosInstance.get<IBackendRes<IPagination<IBook>>>(url);
};

// Response types
interface IBackendRes<T> {
    error?: string | string[];
    message?: string;
    status: number | string;
    data?: T;
}

interface IPagination<T> {
    result: T[];
    meta: { page: number; pageSize: number; pages: number; total: number; };
}
```

---

## Authentication & Authorization

### Authentication Flow

```
User Login
    │
    ▼
POST /api/v1/auth/login (email, password)
    │
    ▼
Server returns: { accessToken, user: { id, fullName, role } }
    │
    ├──► accessToken → localStorage.setItem('access_token', token)
    ├──► role.name   → localStorage.setItem('role', roleName)
    └──► user info   → Redux dispatch(setAccount(user))
```

### Token Refresh Mechanism

The Axios response interceptor automatically handles expired tokens:

```
API Request → 401 Unauthorized
    │
    ▼
Check: Is this a login request? → NO
Check: Has x-no-retry header? → NO
    │
    ▼
Acquire Mutex Lock (prevents concurrent refreshes)
    │
    ▼
GET /api/v1/auth/refresh (uses HTTP-only refresh cookie)
    │
    ├──► Success: Update localStorage, retry original request with new token
    └──► Failure: Clear tokens, user must re-login
```

### Route Protection

```typescript
// PrivateRoute checks for ADMIN role
export const PrivateRoute = ({ children }) => {
    const role = localStorage.getItem("role");
    if (role === "ADMIN") return <>{children}</>;
    return <Navigate to="/login" />;
};
```

---

## AI Chatbot

The chatbot is implemented as a **floating widget** available on all customer pages, powered by Server-Sent Events (SSE) for real-time streaming.

### Key Features

| Feature | Implementation |
|---|---|
| **SSE Streaming** | Uses native `fetch()` + `ReadableStream` + `TextDecoder` to process `data:` events token-by-token |
| **Session Management** | Unique session ID per browser session (`sessionStorage`), allows clear/new session |
| **History Persistence** | Fetches previous messages from backend on open (`GET /chat/history?sessionId=`) |
| **Markdown Support** | Parses `**bold**`, `*italic*`, and `\n` newlines with XSS-safe HTML escaping |
| **Abort Support** | `AbortController` cancels in-flight streams when user closes the chat |
| **Streaming Cursor** | Animated blinking cursor shown during active response generation |
| **Quick Actions** | Pre-defined suggestion buttons ("Best sellers?", "Find good books", "Today's deals") |
| **Hint Tooltip** | Auto-appearing tooltip bubble that dismisses after 8 seconds |
| **Animations** | Smooth open/close transitions, fade-in-up messages, ping/pulse on chat bubble |

---

## Admin Dashboard

The admin dashboard provides real-time business analytics with configurable filters:

### Components

| Component | Description |
|---|---|
| `DashboardFilterBar` | Date range presets (today, 7d, 30d, 90d, 1y), custom date picker, group-by (DAY/MONTH), top-N selector |
| `DashboardStatCards` | 6 KPI cards — Total Revenue, Total Orders, New Customers, Products Sold, Average Order Value, Cancel Rate |
| `RevenueChart` | Recharts `AreaChart` with gradient fill — shows revenue and order count over time |
| `OrderStatusBreakdown` | Recharts `PieChart` — visual breakdown of order statuses (pending, confirmed, shipped, delivered, cancelled) |
| `TopProductsTable` | Table of top-selling products with rank, title, quantity sold, and revenue |
| `DashboardSkeleton` | Loading skeleton placeholder with shimmer effect |

### Data Flow

```
Filter Change → callFetchDashboardApi(fromDate, toDate, groupBy, topN)
    │
    ▼
GET /api/v1/dashboard/overview?fromDate=2025-01-01&toDate=2025-12-31&groupBy=MONTH&topN=10
    │
    ▼
IDashboardData {
    summary: { revenue, orders, customersNew, productsSold, aov, cancelRate }
    revenueSeries: [{ label, revenue, orders }]
    orderStatusBreakdown: { PENDING: 5, CONFIRMED: 12, ... }
    topProducts: [{ productId, title, soldQty, revenue }]
}
```

---

## UI / UX Highlights

- **Gradient Accents**: Primary-colored gradients throughout headers, buttons, and highlights
- **Smooth Animations**: Fade-in-up for chat messages, scale transitions for dropdowns, bounce for loading dots
- **Glassmorphism Elements**: Semi-transparent backgrounds with backdrop blur in chatbot header decorations
- **Responsive Design**: Tailwind responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) used extensively
- **Loading States**: Skeleton loaders for dashboard, spinner animations for data fetching, shimmer effects
- **Toast Notifications**: Color-coded feedback for success (green), error (red), info (blue), and warning (yellow) actions
- **Hover Interactions**: Category dropdown on hover with delay timeout, user account dropdown, search autocomplete
- **Custom Scrollbars**: Styled scrollbars for chat messages and checkout order summary
- **Price Formatting**: VND currency display using `Intl.NumberFormat('vi-VN')` with ₫ symbol
- **Discount Display**: Original price with strikethrough, discount percentage badge, and calculated final price
- **Trust Badges**: Security and shipping badges on checkout page for user confidence
- **Empty States**: Custom illustrations and calls-to-action for empty cart and search results

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- TypeScript strict mode enabled
- ESLint with React Hooks and React Refresh plugins
- Component files use PascalCase (e.g., `ProductCard.tsx`)
- Redux slices use camelCase (e.g., `book.slice.ts`)
- API functions prefixed with `call` (e.g., `callFetchAllBooksWithPaginationApi`)

---

## License

This project is developed for educational and research purposes.

---

<p align="center">
  Made by <strong>BookVerse Team</strong>
</p>
