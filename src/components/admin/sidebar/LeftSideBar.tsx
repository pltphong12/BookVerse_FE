import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined, UserOutlined, SafetyCertificateOutlined,
    KeyOutlined, TeamOutlined, BookOutlined, EditOutlined,
    BankOutlined, ShopOutlined, TagsOutlined, ShoppingCartOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import Logo from '../../../assets/main_logo.png';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        key: 'dashboard-group',
        label: 'Dashboard',
        type: 'group',
        children: [
            {
                key: '/admin',
                icon: <DashboardOutlined />,
                label: <Link to="/admin">Trang quản lý</Link>,
            },
        ],
    },
    { type: 'divider' },
    {
        key: 'account-group',
        label: 'Account',
        type: 'group',
        children: [
            {
                key: '/admin/users',
                icon: <UserOutlined />,
                label: <Link to="/admin/users">Người dùng</Link>,
            },
            {
                key: '/admin/roles',
                icon: <SafetyCertificateOutlined />,
                label: <Link to="/admin/roles">Vai trò</Link>,
            },
            {
                key: '/admin/permissions',
                icon: <KeyOutlined />,
                label: <Link to="/admin/permissions">Quyền hạn</Link>,
            },
        ],
    },
    { type: 'divider' },
    {
        key: 'content-group',
        label: 'Content',
        type: 'group',
        children: [
            {
                key: '/admin/customers',
                icon: <TeamOutlined />,
                label: <Link to="/admin/customers">Khách hàng</Link>,
            },
            {
                key: '/admin/books',
                icon: <BookOutlined />,
                label: <Link to="/admin/books">Sách</Link>,
            },
            {
                key: '/admin/authors',
                icon: <EditOutlined />,
                label: <Link to="/admin/authors">Tác giả</Link>,
            },
            {
                key: '/admin/publishers',
                icon: <BankOutlined />,
                label: <Link to="/admin/publishers">Nhà xuất bản</Link>,
            },
            {
                key: '/admin/suppliers',
                icon: <ShopOutlined />,
                label: <Link to="/admin/suppliers">Nhà cung cấp</Link>,
            },
            {
                key: '/admin/categories',
                icon: <TagsOutlined />,
                label: <Link to="/admin/categories">Thể loại</Link>,
            },
        ],
    },
    { type: 'divider' },
    {
        key: 'commerce-group',
        label: 'Commerce',
        type: 'group',
        children: [
            {
                key: '/admin/orders',
                icon: <ShoppingCartOutlined />,
                label: <Link to="/admin/orders">Đơn hàng</Link>,
            },
        ],
    },
];

export const LeftSidebar: React.FC = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Determine the active menu key based on current path
    const selectedKey = location.pathname === '/admin' ? '/admin' : location.pathname;

    return (
        <Sider
            width={240}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            theme="light"
            style={{
                height: '100vh',
                position: 'sticky',
                top: 0,
                left: 0,
                borderRight: '1px solid #f0f0f0',
                overflow: 'auto',
            }}
        >
            {/* Logo */}
            <div style={{
                padding: collapsed ? '16px 8px' : '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid #f0f0f0',
                transition: 'all 0.2s',
            }}>
                <Link to="/">
                    <img
                        src={Logo}
                        alt="BookVerse Logo"
                        style={{
                            width: collapsed ? 32 : '100%',
                            height: 'auto',
                            objectFit: 'contain',
                            filter: 'brightness(0) saturate(100%) invert(39%) sepia(57%) saturate(2000%) hue-rotate(200deg) brightness(96%) contrast(94%)',
                            transition: 'width 0.2s',
                        }}
                    />
                </Link>
            </div>

            {/* Menu */}
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                style={{
                    border: 'none',
                    fontSize: 14,
                }}
            />
        </Sider>
    );
};