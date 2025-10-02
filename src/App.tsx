import { createBrowserRouter, Outlet } from 'react-router-dom'
import { Header } from './components/client/header'
import { Footer } from './components/client/footer'
import NotFound from './pages/error/NotFound';
import { HomePage } from './pages/home/homePage';
import { PrivateRoute } from './services/route-private';
import LayoutAdmin from './pages/admin/layout.admin';
import ErrorPage from './pages/error/errorPage';
import { UserPage } from './pages/admin/user.admin';
import { InternalLoginPage } from './pages/auth/login_internal';
import { RegisterPage } from './pages/auth/register';
import { DashboardAdmin } from './pages/admin/dashboard.admin';
import { BookPage } from './pages/admin/book.admin';
import { AuthorPage } from './pages/admin/author.admin';
import { PublisherPage } from './pages/admin/publisher.admin';
import { CategoryPage } from './pages/admin/category.admin';
import { PermissionPage } from './pages/admin/permission.admin';
import { RolePage } from './pages/admin/role.admin';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound statusError='404' message='Oops! That page can’t be found' navigate='/' />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // {
      //   path: "/users",
      //   element: <UserPage />,
      // },
      // {
      //   path: "/products",
      //   element: <ProductPage />,
      // },
    ],
  },
  {
    path: "/admin",
    element:
      <PrivateRoute>
        <LayoutAdmin />
      </PrivateRoute>,
    errorElement: <ErrorPage />,
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

export function App() {

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}


