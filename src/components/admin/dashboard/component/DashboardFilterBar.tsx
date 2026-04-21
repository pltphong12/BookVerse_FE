import React from 'react';
import { Card, DatePicker, Select, Button, Space, Row, Col, Segmented } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PresetKey, PresetItem, PRESETS } from './dashboard.utils';

interface DashboardFilterBarProps {
    fromDate: string;
    toDate: string;
    groupBy: string;
    topN: number;
    activePreset: PresetKey;
    onFromDateChange: (value: string) => void;
    onToDateChange: (value: string) => void;
    onGroupByChange: (value: string) => void;
    onTopNChange: (value: number) => void;
    onPresetClick: (preset: PresetItem) => void;
    onFilter: () => void;
    onReset: () => void;
}

export default function DashboardFilterBar({
    fromDate, toDate, groupBy, topN, activePreset,
    onFromDateChange, onToDateChange, onGroupByChange,
    onTopNChange, onPresetClick, onFilter, onReset,
}: DashboardFilterBarProps) {
    return (
        <Card
            size="small"
            style={{ marginBottom: 20, borderRadius: 12 }}
            styles={{ body: { padding: '16px 20px' } }}
        >
            {/* Preset buttons */}
            <div style={{ marginBottom: 12 }}>
                <Segmented
                    options={PRESETS.map(p => ({ label: p.label, value: p.key }))}
                    value={activePreset || undefined}
                    onChange={(val) => {
                        const preset = PRESETS.find(p => p.key === val);
                        if (preset) onPresetClick(preset);
                    }}
                    size="small"
                />
            </div>

            {/* Filters */}
            <Row gutter={[12, 12]} align="middle">
                <Col xs={24} sm={12} md={5}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#8c8c8c', marginBottom: 4, textTransform: 'uppercase' }}>
                        Từ ngày
                    </div>
                    <DatePicker
                        value={fromDate ? dayjs(fromDate) : null}
                        onChange={(_d, ds) => onFromDateChange(ds as string)}
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </Col>
                <Col xs={24} sm={12} md={5}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#8c8c8c', marginBottom: 4, textTransform: 'uppercase' }}>
                        Đến ngày
                    </div>
                    <DatePicker
                        value={toDate ? dayjs(toDate) : null}
                        onChange={(_d, ds) => onToDateChange(ds as string)}
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#8c8c8c', marginBottom: 4, textTransform: 'uppercase' }}>
                        Nhóm theo
                    </div>
                    <Select
                        value={groupBy}
                        onChange={onGroupByChange}
                        style={{ width: '100%' }}
                        size="small"
                        options={[
                            { value: 'DAY', label: 'Ngày' },
                            { value: 'WEEK', label: 'Tuần' },
                            { value: 'MONTH', label: 'Tháng' },
                        ]}
                    />
                </Col>
                <Col xs={24} sm={12} md={4}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#8c8c8c', marginBottom: 4, textTransform: 'uppercase' }}>
                        Top sản phẩm
                    </div>
                    <Select
                        value={topN}
                        onChange={onTopNChange}
                        style={{ width: '100%' }}
                        size="small"
                        options={[
                            { value: 3, label: 'Top 3' },
                            { value: 5, label: 'Top 5' },
                            { value: 10, label: 'Top 10' },
                        ]}
                    />
                </Col>
                <Col xs={24} sm={24} md={6}>
                    <div style={{ fontSize: 11, marginBottom: 4, opacity: 0 }}>_</div>
                    <Space>
                        <Button type="primary" icon={<FilterOutlined />} onClick={onFilter} size="small">
                            Lọc
                        </Button>
                        <Button icon={<ReloadOutlined />} onClick={onReset} size="small" />
                    </Space>
                </Col>
            </Row>
        </Card>
    );
}
