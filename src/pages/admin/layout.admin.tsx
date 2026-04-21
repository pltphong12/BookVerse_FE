import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { BreadCrumbs } from '../../components/admin/sidebar/BreadCrumbs';
import { Header } from '../../components/admin/sidebar/Header';
import { LeftSidebar } from '../../components/admin/sidebar/LeftSideBar';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { callGetAccountApi } from '../../services/api';
import { IUser } from '../../types/backend';
import { setAccount } from '../../redux/slide/account.slide';

const { Content } = Layout;

export default function LayoutAdmin() {
  const dispatch = useAppDispatch();
  const breadcrumbItems = useAppSelector((state) => state.breadcrumbs.items);

  useEffect(() => {
    const getAccount = async () => {
      try {
        const res = await callGetAccountApi();
        dispatch(setAccount(res.data?.data as IUser));
      } catch (error) {
        alert(error);
      }
    };
    getAccount();
  }, [dispatch]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <LeftSidebar />

      {/* Main content */}
      <Layout>
        <Content style={{
          padding: '20px 24px',
          background: '#f5f5f5',
          overflow: 'auto',
        }}>
          <Header />
          <BreadCrumbs items={breadcrumbItems} />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
