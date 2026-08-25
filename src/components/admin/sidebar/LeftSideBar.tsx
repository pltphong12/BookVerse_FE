import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined, UserOutlined, SafetyCertificateOutlined,
    KeyOutlined, TeamOutlined, BookOutlined, EditOutlined,
    BankOutlined, ShopOutlined, TagsOutlined, ShoppingCartOutlined,
    MenuFoldOutlined, MenuUnfoldOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import Logo from '../../../assets/logo_v2.png';

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
        key: 'system-management',
        label: 'Quản lý người dùng',
        type: 'group',
        children: [
            {
                key: 'users-submenu',
                icon: <UserOutlined />,
                label: 'Người dùng',
                children: [
                    {
                        key: '/admin/user',
                        icon: <TeamOutlined />,
                        label: <Link to="/admin/user">Danh sách người dùng</Link>,
                    },
                    {
                        key: '/admin/role',
                        icon: <SafetyCertificateOutlined />,
                        label: <Link to="/admin/role">Vai trò</Link>,
                    },
                    {
                        key: '/admin/permission',
                        icon: <KeyOutlined />,
                        label: <Link to="/admin/permission">Quyền hạn</Link>,
                    },
                ],
            },
        ],
    },
    { type: 'divider' },
    {
        key: 'catalog-management',
        label: 'Quản lý cửa hàng',
        type: 'group',
        children: [
            {
                key: 'products-submenu',
                icon: <BookOutlined />,
                label: 'Sản phẩm',
                children: [
                    {
                        key: '/admin/book',
                        icon: <BookOutlined />,
                        label: <Link to="/admin/book">Danh sách sách</Link>,
                    },
                    {
                        key: '/admin/author',
                        icon: <EditOutlined />,
                        label: <Link to="/admin/author">Tác giả</Link>,
                    },
                    {
                        key: '/admin/category',
                        icon: <TagsOutlined />,
                        label: <Link to="/admin/category">Thể loại</Link>,
                    },
                    {
                        key: '/admin/publisher',
                        icon: <BankOutlined />,
                        label: <Link to="/admin/publisher">Nhà xuất bản</Link>,
                    },
                    {
                        key: '/admin/supplier',
                        icon: <ShopOutlined />,
                        label: <Link to="/admin/supplier">Nhà cung cấp</Link>,
                    },
                ],
            },
            {
                key: 'orders-submenu',
                icon: <ShoppingCartOutlined />,
                label: 'Đơn hàng',
                children: [
                    {
                        key: '/admin/order',
                        icon: <ShoppingCartOutlined />,
                        label: <Link to="/admin/order">Danh sách đơn hàng</Link>,
                    },
                ],
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
            trigger={null}
            theme="light"
            className="admin-sider"
            style={{
                height: '100vh',
                position: 'sticky',
                top: 0,
                left: 0,
                borderRight: '1px solid #f0f0f0',
            }}
        >
            {/* Logo */}
            <div style={{
                padding: collapsed ? '14px 8px' : '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid #f0f0f0',
                transition: 'all 0.2s',
                flexShrink: 0,
                minHeight: 64,
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <img
                        src={Logo}
                        alt="BookVerse Logo"
                        style={{
                            maxHeight: collapsed ? 36 : 48,
                            width: 'auto',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            transition: 'all 0.2s',
                        }}
                    />
                </Link>
            </div>

            {/* Scrollable Menu */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                minHeight: 0,
            }}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    style={{
                        border: 'none',
                        fontSize: 14,
                    }}
                />
            </div>

            {/* Custom Collapse Trigger */}
            <div
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderTop: '1px solid #f0f0f0',
                    transition: 'all 0.2s',
                    color: '#595959',
                    fontSize: 16,
                    flexShrink: 0,
                }}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
        </Sider>
    );
};