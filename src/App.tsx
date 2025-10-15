import { createBrowserRouter } from 'react-router-dom';
import { AuthorPage } from './pages/admin/author.admin';
import { BookPage } from './pages/admin/book.admin';
import { CategoryPage } from './pages/admin/category.admin';
import { DashboardAdmin } from './pages/admin/dashboard.admin';
import LayoutAdmin from './pages/admin/layout.admin';
import { PermissionPage } from './pages/admin/permission.admin';
import { PublisherPage } from './pages/admin/publisher.admin';
import { RolePage } from './pages/admin/role.admin';
import { UserPage } from './pages/admin/user.admin';
import { InternalLoginPage } from './pages/auth/login_internal';
import { RegisterPage } from './pages/auth/register';
import { Home } from './pages/client/home';
import { LayoutClient } from './pages/client/layout.client';
import NotFound from './pages/error/NotFound';
import { PrivateRoute } from './services/route-private';
import { SupplierPage } from './pages/admin/supplier.admin';

export const router = createBrowserRouter([
  {
    path: "/",
    element:
      <App>
        <LayoutClient />
      </App>,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      }
    ],
  },
  {
    path: "/admin",
    element:
      <PrivateRoute>
        <App>
          <LayoutAdmin />
        </App>
      </PrivateRoute>,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <DashboardAdmin />
      },
      {
        path: "/admin/users",
        element: <UserPage />
      },
      {
        path: "/admin/books",
        element: <BookPage />
      },
      {
        path: "/admin/authors",
        element: <AuthorPage />
      },
      {
        path: "/admin/publishers",
        element: <PublisherPage />
      },
      {
        path: "/admin/categories",
        element: <CategoryPage />
      },
      {
        path: "/admin/permissions",
        element: <PermissionPage />
      },
      {
        path: "/admin/roles",
        element: <RolePage />
      },
      {
        path: "/admin/suppliers",
        element: <SupplierPage />
      }
    ]
  },
  {
    path: "/login",
    element: <InternalLoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export function App(props: { children: React.ReactNode }) {

  return (
    <>
      {props.children}
    </>
  )
}
