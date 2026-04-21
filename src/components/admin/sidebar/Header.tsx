import React from 'react';
import { Badge, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Account } from './Account';

export const Header: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 16,
            marginBottom: 8,
        }}>
            <Badge count={0} size="small">
                <BellOutlined style={{ fontSize: 20, color: '#595959', cursor: 'pointer' }} />
            </Badge>
            <Account />
        </div>
    );
};