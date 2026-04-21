import React from 'react';
import { Skeleton, Row, Col, Card } from 'antd';

export default function DashboardSkeleton() {
    return (
        <div>
            {/* Stat cards skeleton */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Col xs={12} sm={8} lg={4} key={i}>
                        <Card size="small" style={{ borderRadius: 12 }}>
                            <Skeleton active paragraph={{ rows: 2 }} title={false} />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Charts skeleton */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} lg={16}>
                    <Card style={{ borderRadius: 12, height: 380 }}>
                        <Skeleton active paragraph={{ rows: 8 }} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card style={{ borderRadius: 12, height: 380 }}>
                        <Skeleton active paragraph={{ rows: 8 }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
