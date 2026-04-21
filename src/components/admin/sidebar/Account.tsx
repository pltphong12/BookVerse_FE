import React from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast, ToastType } from '../../../common/showToast';
import { AxiosError } from 'axios';
import { callLogoutApi } from '../../../services/api';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { resetAccount } from '../../../redux/slide/account.slide';
import { Dropdown, Avatar, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Text } = Typography;

export const Account: React.FC = () => {
    const navigate = useNavigate();
    const account = useAppSelector((state) => state.account);
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        try {
            queryClient.clear();
            await callLogoutApi();
            localStorage.removeItem('access_token');
            showToast('Đăng xuất thành công', ToastType.SUCCESS);
            dispatch(resetAccount());
            navigate('/login');
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(`Đăng xuất thất bại ${error.response?.data.message}`, ToastType.ERROR);
            }
        }
    };

    const items: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Chi tiết tài khoản',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cập nhật tài khoản',
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
            onClick: handleLogout,
        },
    ];

    const avatarUrl = account.account?.avatar
        ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${account.account.avatar}`
        : undefined;

    return (
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', padding: '4px 8px', borderRadius: 8,
                transition: 'background 0.2s',
            }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
                <Avatar
                    src={avatarUrl}
                    icon={<UserOutlined />}
                    size={36}
                    style={{ background: avatarUrl ? undefined : '#1677ff' }}
                />
                <Text strong style={{ fontSize: 13 }}>
                    {account.account?.fullName || 'Admin'}
                </Text>
            </div>
        </Dropdown>
    );
};
