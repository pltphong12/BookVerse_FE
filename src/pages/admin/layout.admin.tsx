import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BreadCrumbs } from '../../components/admin/sidebar/BreadCrumbs';
import { Header } from '../../components/admin/sidebar/Header';
import { LeftSidebar } from '../../components/admin/sidebar/LeftSideBar';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { callGetAccountApi } from '../../services/api';
import { IUser } from '../../types/backend';
import { setAccount } from '../../redux/slide/account.slide';

export default function LayoutAdmin() {
  const dispatch = useAppDispatch()

  const breadcrumbItems = useAppSelector((state) => state.breadcrumbs.items);

  useEffect(() => {
    const getAccount = async () => {
      try {
        const res = await callGetAccountApi()
        dispatch(setAccount(res.data?.data as IUser))
      } catch (error) {
        alert(error)
      }
    }
    getAccount()
  }, [dispatch])


  return (
    <div className="h-screen bg-white text-black dark:bg-gray-900 dark:text-white overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <LeftSidebar />

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mt-20 md:mt-0 mx-3 pb-5 flex flex-col gap-2">
            <Header />
            <BreadCrumbs items={breadcrumbItems} />
            <Outlet />
          </div>
        </div>
      </div>
    </div>

  );
}
