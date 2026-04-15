# BookVerse Frontend - Agent Skill Guide

## Project Overview

BookVerse is an e-commerce bookstore web application built with **React 19 + TypeScript + Vite**. The project has two main areas:
- **Client-facing storefront**: Browse, search, filter, cart, checkout for customers
- **Admin panel**: Full CRUD management for books, users, orders, categories, authors, publishers, suppliers, customers, roles, permissions

**Backend API**: Spring Boot REST API at `http://localhost:8080` (configured via `VITE_BACKEND_URL`)

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | React | 19.x |
| Language | TypeScript | ~5.7 |
| Build Tool | Vite | 6.x |
| Styling | Tailwind CSS v4 + DaisyUI v5 | 4.1.x / 5.x |
| State Management | Redux Toolkit | 2.6.x |
| Data Fetching | TanStack React Query | 5.x |
| HTTP Client | Axios | 1.8.x |
| Form Handling | React Hook Form + Zod | 7.x / 3.x |
| Routing | React Router DOM | 7.x |
| Icons | Lucide React | 0.503.x |
| Dropdown/Select | React Select | 5.x |
| Notifications | React Toastify | 11.x |
| UI Components | Ant Design (antd) | 6.x (partially used) |

---

## Project Structure

```
src/
├── App.tsx                    # Router configuration (createBrowserRouter)
├── main.tsx                   # Entry point (Provider wrapping: Redux, QueryClient, ToastContainer)
├── vite-env.d.ts
├── assets/                    # Static assets (logo, images)
├── common/                    # Shared utility functions
│   ├── formatPrice.tsx        # VND currency formatter (Intl.NumberFormat)
│   ├── showToast.tsx          # Toast notification helper with ToastType enum
│   └── logout.ts              # Logout utility (empty)
├── components/
│   ├── admin/                 # Admin panel components
│   │   ├── sidebar/           # Admin layout components (LeftSideBar, Header, BreadCrumbs, Account)
│   │   ├── user/              # user.table, user.form, user.search_filter, user.view
│   │   ├── book/              # book.table, book.form, book.search_filter, book.view
│   │   ├── author/            # Same 4-file pattern
│   │   ├── category/          # Same 4-file pattern
│   │   ├── publisher/         # Same 4-file pattern
│   │   ├── supplier/          # Same 4-file pattern
│   │   ├── customer/          # Same 4-file pattern
│   │   ├── order/             # order.table, order.form, order.search_filter, order.view
│   │   ├── role/              # Same 4-file pattern
│   │   └── dashboard/         # Dashboard components
│   ├── client/                # Client-facing components
│   │   ├── Header.tsx         # Main client header with nav, search, category dropdown, cart badge
│   │   ├── Footer.tsx         # Client footer
│   │   ├── home/              # HeroSlider, CategoryGrid, PromoBanner
│   │   ├── product/           # ProductCard, ProductFilter, ProductSort, ProductSection, ProductDetail/
│   │   └── cart/              # CartItem, CartSummary, CartEmpty
│   └── global/                # Shared components
│       └── Pagination.tsx     # Reusable pagination component
├── pages/
│   ├── admin/                 # Admin pages
│   │   ├── layout.admin.tsx   # Admin layout (sidebar + header + breadcrumbs + outlet)
│   │   ├── dashboard.admin.tsx
│   │   ├── user.admin.tsx     # Data fetching + state management + renders UserTable
│   │   ├── book.admin.tsx
│   │   ├── author.admin.tsx
│   │   ├── category.admin.tsx
│   │   ├── publisher.admin.tsx
│   │   ├── supplier.admin.tsx
│   │   ├── customer.admin.tsx
│   │   ├── order.admin.tsx
│   │   ├── role.admin.tsx
│   │   └── permission.admin.tsx
│   ├── auth/                  # Authentication pages
│   │   ├── login.tsx          # Login with react-hook-form + zod
│   │   └── register.tsx       # Registration form
│   ├── client/                # Client pages
│   │   ├── layout.client.tsx  # Client layout (header + main + footer)
│   │   ├── home.tsx           # Homepage
│   │   ├── products.tsx       # All products with filters and pagination
│   │   ├── product.detail.tsx # Single product detail
│   │   ├── cart.tsx           # Cart page
│   │   ├── checkout.tsx       # Checkout flow
│   │   └── order-success.tsx  # Order confirmation
│   └── error/
│       └── NotFound.tsx       # 404 page
├── redux/
│   ├── store.ts               # Redux store configuration
│   ├── hook.ts                # Typed useAppDispatch & useAppSelector hooks
│   └── slide/                 # Redux slices (NOTE: folder named "slide" not "slice")
│       ├── account.slide.ts   # Auth state (isAuthenticated, account info)
│       ├── user.slice.ts      # User CRUD async thunks
│       ├── book.slice.ts      # Book CRUD async thunks
│       ├── author.slice.ts
│       ├── category.slide.ts
│       ├── publisher.slice.ts
│       ├── supplier.slide.ts
│       ├── customer.slide.ts
│       ├── order.slide.ts
│       ├── role.slide.ts
│       ├── permission.slice.ts
│       ├── breadcrumbs.slice.ts  # Breadcrumb navigation state
│       ├── cart.slice.ts         # Cart sum state
│       └── counter.slice.ts     # Example counter slice
├── services/
│   ├── api.ts                 # ALL API call functions (centralized)
│   ├── axios-customize.ts     # Axios instance with interceptors (auth, refresh token)
│   └── route-private.tsx      # PrivateRoute guard (checks localStorage role === "ADMIN")
├── styles/
│   ├── index.css              # Tailwind CSS v4 imports + DaisyUI plugin + theme colors
│   └── global.css             # React Select custom styles
└── types/
    └── backend.d.ts           # ALL TypeScript interfaces for backend entities
```

---

## Architecture Patterns

### 1. API Service Pattern

All API calls are centralized in `src/services/api.ts`. Each function follows a naming convention:

```typescript
// Pattern: call{Action}{Entity}Api
export const callFetchAllBooksWithPaginationApi = (title: string, ...) => {
    const url: string = `api/v1/books/search?title=${title}&...`
    return axiosInstance.get<IBackendRes<IPagination<IBook>>>(url)
}

export const callCreateBookApi = (...) => {
    const url = "/api/v1/books";
    const data = { ... };
    return axiosInstance.post<IBackendRes<IBook>>(url, data)
}
```

**API URL Pattern**: `api/v1/{entity}/{action}`

**Response Types**: All responses are wrapped in `IBackendRes<T>`:
```typescript
interface IBackendRes<T> {
    error?: string | string[];
    message?: string;
    status: number | string;
    data?: T;
}
```

**Paginated responses** use `IPagination<T>`:
```typescript
interface IPagination<T> {
    result: T[];
    meta: IMeta;  // { page, pageSize, pages, total }
}
```

### 2. Axios Interceptors

`src/services/axios-customize.ts` configures:
- **Base URL** from `import.meta.env.VITE_BACKEND_URL`
- **Request interceptor**: Attaches `Bearer` token from `localStorage.getItem('access_token')` 
- **Response interceptor**: Handles 401 errors with automatic token refresh using `async-mutex` to prevent concurrent refresh calls
- **Config**: `withCredentials: true`, `timeout: 10000`

### 3. Redux Pattern (Redux Toolkit)

Redux slices live in `src/redux/slide/` and follow this pattern:

#### For entities with CUD (Create/Update/Delete) operations:
```typescript
// 1. Define interfaces
export interface ICreateEntity { ... }
interface IEntityState {
    isCreateEntitySuccess: boolean;
    isCreateEntityFailed: boolean;
    isUpdateEntitySuccess: boolean;
    isUpdateEntityFailed: boolean;
    isDeleteEntitySuccess: boolean;
    isDeleteEntityFailed: boolean;
    message: string;
}

// 2. Create async thunks
export const createEntity = createAsyncThunk('entity/create', async (payload) => {
    try {
        const response = await callCreateEntityApi(...)
        return response.data as IBackendRes<IEntity>
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data
        }
    }
})

// 3. Create slice with reset reducers and extraReducers
export const entitySlice = createSlice({
    name: 'entity',
    initialState,
    reducers: {
        resetCreateEntity: (state) => { ... },
        resetUpdateEntity: (state) => { ... },
        resetDeleteEntity: (state) => { ... },
    },
    extraReducers: (builder) => {
        builder.addCase(createEntity.fulfilled, ...)
        builder.addCase(createEntity.rejected, ...)
        // ... same for update and delete
    }
})
```

#### For simple state:
```typescript
// account.slide.ts - Auth state
export const accountSlice = createSlice({
    name: "account",
    reducers: {
        setAccount: (state, action) => { ... },
        resetAccount: (state) => { ... },
    }
})

// cart.slice.ts - Simple counter
export const cartSlice = createSlice({
    name: "cart",
    reducers: {
        setCartSum: (state, action: PayloadAction<number>) => { state.sum = action.payload },
        resetCart: (state) => { state.sum = 0 }
    }
})
```

### 4. Admin Page Pattern

Each admin page follows this exact structure:

```typescript
// pages/admin/{entity}.admin.tsx
export const EntityPage = () => {
    const size = 10;
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    
    // State declarations
    const [dataSource, setDataSource] = useState<IEntity[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    // ... filter states
    
    // Data fetching with React Query
    const { data: entitiesQuery, isPending } = useQuery({
        queryKey: ['fetchingEntities', search, ...filterDeps, page],
        queryFn: () => callFetchAllEntitiesApi(search, ...filters, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    });
    
    // Sync query data to local state
    useEffect(() => {
        if (entitiesQuery?.data.data) {
            setDataSource(entitiesQuery.data.data.result);
            setTotalPage(entitiesQuery.data.data.meta.pages);
        }
    }, [entitiesQuery]);
    
    // Set breadcrumbs
    useEffect(() => {
        dispatch(clearBreadcrumbs());
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Entity Name", path: "/admin/entities" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);
    
    // Reload function
    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingEntities'] });
    };
    
    // Render
    return isPending ? <div>Đang tải...</div> : <EntityTable ... />;
}
```

### 5. Admin Component Pattern (4 Files per Entity)

Each admin entity has exactly **4 component files**:

#### `{entity}.table.tsx` - Data table with actions
```typescript
interface EntityTableProps {
    load: () => Promise<void>;        // Reload data
    dataSource: IEntity[];            // Table data
    page: number;                     // Current page
    totalPage: number;                // Total pages
    setPage: Dispatch<SetStateAction<number>>;
    search: string;                   // Search term
    setSearch: Dispatch<SetStateAction<string>>;
    // ... entity-specific filter props
}

export const EntityTable: React.FC<EntityTableProps> = (props) => {
    // Local state for modals
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<IEntity | null>(null);
    const [entityToEdit, setEntityToEdit] = useState<IEntity | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Redux for delete status
    const dispatch = useAppDispatch();
    const isDeleteSuccess = useAppSelector(state => state.entity.isDeleteEntitySuccess);
    
    // Delete success/failure effect
    useEffect(() => { ... }, [isDeleteSuccess, ...]);
    
    return (
        <>
            <EntitySearchAndFilter ... />
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý Entity</div>
                <button className="btn btn-neutral" onClick={() => setIsModalOpen(true)}>
                    Tạo Entity
                </button>
            </div>
            <div className="rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>...</thead>
                    <tbody>
                        {dataSource.map((record, index) => (
                            <tr key={record.id} className='hover:bg-base-300'>
                                {/* Columns */}
                                <td>
                                    {/* 3-dot dropdown menu with View, Edit, Delete */}
                                    <div className="dropdown dropdown-left">...</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination page={page} totalPage={totalPage} setPage={setPage} />
            <EntityView ... />
            <EntityForm ... />
        </>
    );
}
```

#### `{entity}.form.tsx` - Create/Edit form (modal dialog)
```typescript
interface EntityFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    entityToEdit?: IEntity | undefined;      // undefined = create, IEntity = edit
    // ... additional data for dropdowns
}

// Uses:
// - Zod schema for validation
// - react-hook-form with zodResolver
// - react-select for dropdowns
// - DaisyUI <dialog> modal
// - callUploadSingleFile for file uploads

export const EntityForm: React.FC<EntityFormProps> = ({ ... }) => {
    // Form setup
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } 
        = useForm<FormData>({ resolver: zodResolver(schema) });
    
    // Pre-fill form when editing
    useEffect(() => {
        if (entityToEdit) { setValue(...); }
        else { reset(); }
    }, [entityToEdit]);
    
    // Handle create/update success/failure
    useEffect(() => {
        if (isCreateSuccess || isUpdateSuccess) {
            showToast("...", ToastType.SUCCESS);
            dispatch(resetCreate/Update());
            load();
            handleClose();
        }
        if (isCreateFailed || isUpdateFailed) {
            showToast("...", ToastType.ERROR);
            dispatch(resetCreate/Update());
        }
    }, [isCreateSuccess, ...]);
    
    return (
        <dialog className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle`}>
            <div className="modal-box">
                <h3>...</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Form fields with DaisyUI classes */}
                    <div className="form-control w-full mt-4">
                        <label className="label"><span className="label-text">Field</span></label>
                        <input {...register('field')} className={`input input-bordered w-full ${errors.field ? 'input-error' : ''}`} />
                        {errors.field && <span className="label-text-alt text-error">{errors.field.message}</span>}
                    </div>
                    {/* Action buttons */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="submit" className="btn btn-neutral" disabled={isSubmitting}>
                            {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Submit'}
                        </button>
                        <button type="button" className="btn btn-error" onClick={handleClose}>Đóng</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}
```

#### `{entity}.search_filter.tsx` - Search bar + expandable filter panel
```typescript
interface EntitySearchAndFilterProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    setPage: Dispatch<SetStateAction<number>>;
    // ... filter-specific props
}

// Uses lucide-react icons (Search, Filter)
// Expandable filter panel with react-select and date inputs
// Always resets page to 1 when filter changes
```

#### `{entity}.view.tsx` - Detail view (modal overlay)
```typescript
interface EntityViewProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    entity: IEntity | null;
}

// Fixed overlay with backdrop
// Grid layout for displaying entity details
// Uses lucide-react X icon for close button
```

### 6. Client Page Pattern

Client pages use a different approach - more direct API calls with `useCallback` and local state, while admin pages use React Query more heavily.

### 7. Authentication Flow

1. **Login**: `callLoginApi()` → store `access_token` and `role` in `localStorage` → dispatch `setAccount()` to Redux
2. **Auth check**: Both `LayoutClient` and `LayoutAdmin` call `callGetAccountApi()` on mount → dispatch `setAccount()`
3. **Route protection**: `PrivateRoute` checks `localStorage.getItem("role") === "ADMIN"` → redirect to `/login` if not
4. **Token refresh**: Axios response interceptor catches 401 → calls `callRefreshTokenApi()` using `async-mutex` → retries original request

---

## Coding Conventions

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| API functions | `call{Action}{Entity}Api` | `callFetchAllBooksWithPaginationApi` |
| Redux async thunks | `{action}{Entity}` | `createBook`, `deleteUser`, `updateOrder` |
| Redux reset actions | `reset{Action}{Entity}` | `resetCreateBook`, `resetDeleteUser` |
| Redux slice files | `{entity}.slice.ts` or `{entity}.slide.ts` | `book.slice.ts`, `account.slide.ts` |
| Admin page files | `{entity}.admin.tsx` | `user.admin.tsx`, `book.admin.tsx` |
| Admin component files | `{entity}.{type}.tsx` | `user.table.tsx`, `user.form.tsx` |
| Client component files | `PascalCase.tsx` | `ProductCard.tsx`, `Header.tsx` |
| Interface naming | `I{Entity}` prefix | `IBook`, `IUser`, `IBackendRes` |
| Type inference | `z.infer<typeof schema>` | `type LoginFormData = z.infer<typeof loginSchema>` |

### UI/CSS Conventions

- **Primary styling**: Tailwind CSS v4 utility classes
- **Component library**: DaisyUI v5 classes (`btn`, `modal`, `table`, `badge`, `input`, `form-control`, `label`, `dropdown`, `join`, etc.)
- **Icons**: Lucide React components (`<Search />`, `<Edit />`, `<Trash />`, `<View />`, `<X />`, `<Filter />`, etc.)
- **Modals**: DaisyUI `<dialog>` element with `modal-open` class toggle
- **Dropdowns**: DaisyUI `dropdown` + `dropdown-content` for menus; `react-select` for form dropdowns
- **Language**: Vietnamese (UI labels, toast messages, form validation messages, breadcrumbs)
- **Date formatting**: `Intl.DateTimeFormat('en-US', ...)` 
- **Price formatting**: Custom `formatPrice()` using `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`
- **Color theme**: Blue primary palette (`--color-primary-500: #3b82f6`)

### Form Validation Pattern

```typescript
// 1. Define Zod schema
const entitySchema = z.object({
    name: z.string().min(2, 'Tên có ít nhất 2 kí tự'),
    email: z.string().email('Email không hợp lệ'),
    // ...
});

// 2. Infer type from schema
type EntityFormData = z.infer<typeof entitySchema>;

// 3. Use with react-hook-form
const { register, handleSubmit, formState: { errors } } = useForm<EntityFormData>({
    resolver: zodResolver(entitySchema),
    defaultValues: { ... }
});
```

### Toast Notification Pattern

```typescript
import { showToast, ToastType } from '../../common/showToast';

// Usage
showToast("Tạo thành công", ToastType.SUCCESS);
showToast("Xóa không thành công", ToastType.ERROR);
showToast("Thông tin cập nhật", ToastType.INFO);
showToast("Cảnh báo", ToastType.WARN);
```

### File Upload Pattern

```typescript
// Single file upload
const res = await callUploadSingleFile(file, 'avatar');  // folder type: 'avatar', 'book', etc.
const fileName = res.data.data?.fileName;

// Batch file upload
const res = await callUploadBatchFiles(files, 'book');
const fileNames = res.data.data;  // IFile[]

// Static file URL pattern
const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/storage/{folder}/{fileName}`;
```

### React Query Usage Pattern

```typescript
// Standard query
const { data, isPending } = useQuery({
    queryKey: ['uniqueKey', ...dependencies],
    queryFn: () => callApiFunction(...params),
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,  // Keep previous data while fetching
    retry: false
});

// Invalidate query to refetch
const queryClient = useQueryClient();
await queryClient.invalidateQueries({ queryKey: ['uniqueKey'] });
```

---

## Route Configuration

### Client Routes (`/`)
| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Homepage |
| `/products` | `AllProductsPage` | Product listing with filters |
| `/product/:id` | `ProductDetailPage` | Product detail |
| `/cart` | `CartPage` | Shopping cart |
| `/checkout` | `CheckoutPage` | Order checkout |
| `/order-success` | `OrderSuccessPage` | Order confirmation |

### Admin Routes (`/admin`) - Protected by `PrivateRoute`
| Path | Component | Description |
|---|---|---|
| `/admin` | `DashboardAdmin` | Admin dashboard |
| `/admin/users` | `UserPage` | User management |
| `/admin/books` | `BookPage` | Book management |
| `/admin/authors` | `AuthorPage` | Author management |
| `/admin/publishers` | `PublisherPage` | Publisher management |
| `/admin/categories` | `CategoryPage` | Category management |
| `/admin/suppliers` | `SupplierPage` | Supplier management |
| `/admin/customers` | `CustomerPage` | Customer management |
| `/admin/orders` | `OrderPage` | Order management |
| `/admin/permissions` | `PermissionPage` | Permission management |
| `/admin/roles` | `RolePage` | Role management |

### Auth Routes
| Path | Component |
|---|---|
| `/login` | `InternalLoginPage` |
| `/register` | `RegisterPage` |

---

## Backend API Endpoints

All endpoints are prefixed with `api/v1/`:

| Module | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/refresh`, `GET /auth/account`, `POST /auth/logout` |
| Users | `GET /users/search`, `POST /users`, `PUT /users`, `DELETE /users/:id` |
| Books | `GET /books/search`, `GET /books/search-product`, `GET /books/top-5-latest`, `POST /books`, `PUT /books`, `DELETE /books/:id`, `GET /books/:id` |
| Authors | `GET /authors`, `GET /authors/search`, `POST /authors`, `PUT /authors`, `DELETE /authors/:id` |
| Categories | `GET /categories`, `GET /categories/search`, `POST /categories`, `PUT /categories`, `DELETE /categories/:id` |
| Publishers | `GET /publishers`, `GET /publishers/search`, `POST /publishers`, `PUT /publishers`, `DELETE /publishers/:id` |
| Suppliers | `GET /suppliers`, `GET /suppliers/search`, `POST /suppliers`, `PUT /suppliers`, `DELETE /suppliers/:id`, `GET /suppliers/:id` |
| Customers | `GET /customers/search`, `POST /customers`, `PUT /customers`, `DELETE /customers/:id`, `GET /customers/:id` |
| Orders | `GET /orders/search`, `POST /orders`, `PUT /orders`, `GET /orders/:id` |
| Roles | `GET /roles`, `GET /roles/search`, `POST /roles`, `PUT /roles`, `DELETE /roles/:id` |
| Permissions | `GET /permissions`, `GET /permissions/search`, `POST /permissions`, `PUT /permissions`, `DELETE /permissions/:id` |
| Files | `POST /files` (single), `POST /files/batch` (multiple) |
| Cart | `GET /carts`, `POST /carts/items`, `PUT /carts/items/:bookId/increase`, `PUT /carts/items/:bookId/decrease`, `DELETE /carts/items/:bookId` |

---

## How to Add a New Admin CRUD Module

Follow this checklist when adding a new entity (e.g., "Coupon"):

1. **Define interfaces** in `src/types/backend.d.ts`:
   ```typescript
   export interface ICoupon { id: number; code: string; ... }
   ```

2. **Add API functions** in `src/services/api.ts`:
   ```typescript
   export const callFetchAllCouponsWithPaginationAndFilterApi = (...) => { ... }
   export const callCreateCouponApi = (...) => { ... }
   export const callUpdateCouponApi = (...) => { ... }
   export const callDeleteCouponApi = (...) => { ... }
   ```

3. **Create Redux slice** in `src/redux/slide/coupon.slice.ts`:
   - Define `ICreateCoupon` interface
   - Create async thunks: `createCoupon`, `updateCoupon`, `deleteCoupon`
   - Create slice with reset reducers and extraReducers

4. **Register slice** in `src/redux/store.ts`:
   ```typescript
   import { couponSlice } from './slide/coupon.slice'
   // Add to reducer: coupon: couponSlice.reducer
   ```

5. **Create 4 component files** in `src/components/admin/coupon/`:
   - `coupon.table.tsx` - Data table with actions
   - `coupon.form.tsx` - Create/Edit form modal
   - `coupon.search_filter.tsx` - Search and filter UI
   - `coupon.view.tsx` - Detail view modal

6. **Create admin page** `src/pages/admin/coupon.admin.tsx`:
   - Fetch data with React Query
   - Set breadcrumbs
   - Render CouponTable

7. **Register route** in `src/App.tsx`:
   ```typescript
   { path: "/admin/coupons", element: <CouponPage /> }
   ```

8. **Add sidebar link** in `src/components/admin/sidebar/LeftSideBar.tsx`

---

## Important Notes

- **Folder naming inconsistency**: Redux slice folder is named `slide` (not `slice`). Some files use `.slice.ts` and others `.slide.ts` - keep either pattern when adding new files.
- **Vietnamese language**: All user-facing text (labels, messages, validation errors, breadcrumbs) must be in Vietnamese.
- **No password on update**: When updating entities with passwords, the password field is set to `null` in the API request.
- **Pagination**: The page number is **1-indexed**. The backend returns `meta.pages` (total pages) and `meta.total` (total items).
- **Image URLs**: Static files are served at `{VITE_BACKEND_URL}/storage/{folder}/{filename}`.
- **STT Column**: Table row numbers use formula: `index + (page - 1) * 10 + 1`.
- **React Query keys**: Use descriptive array keys like `['fetchingBooks', search, ...filters, page]` to enable auto-refetch on filter changes.
- **Delete confirmation**: Uses a nested DaisyUI dropdown (not a separate modal) for inline delete confirmation.
- **Form state management**: Uses Redux for tracking operation success/failure (create/update/delete), not React Query mutations.
