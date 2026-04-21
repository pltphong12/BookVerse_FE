import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

export interface BreadCrumbItem {
    label: string;
    path?: string;
}

interface BreadCrumbsProps {
    items: BreadCrumbItem[];
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items }) => {
    const breadcrumbItems = items.map((item, idx) => ({
        key: idx,
        title: item.path ? (
            <Link to={item.path}>
                {idx === 0 && <HomeOutlined style={{ marginRight: 4 }} />}
                {item.label}
            </Link>
        ) : (
            <span>{item.label}</span>
        ),
    }));

    return (
        <Breadcrumb
            items={breadcrumbItems}
            style={{ marginBottom: 16 }}
        />
    );
};