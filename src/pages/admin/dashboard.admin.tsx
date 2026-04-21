import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Row, Col } from 'antd'
import { useAppDispatch } from '../../redux/hook'
import { clearBreadcrumbs, setBreadcrumbs } from '../../redux/slide/breadcrumbs.slice'
import { callFetchDashboardApi } from '../../services/api'
import { IDashboardData } from '../../types/backend'
import { PresetKey, PresetItem, getToday, getDateOffset } from '../../components/admin/dashboard/component/dashboard.utils'
import DashboardFilterBar from '../../components/admin/dashboard/component/DashboardFilterBar'
import DashboardStatCards from '../../components/admin/dashboard/component/DashboardStatCards'
import RevenueChart from '../../components/admin/dashboard/component/RevenueChart'
import OrderStatusBreakdown from '../../components/admin/dashboard/component/OrderStatusBreakdown'
import TopProductsTable from '../../components/admin/dashboard/component/TopProductsTable'
import DashboardSkeleton from '../../components/admin/dashboard/component/DashboardSkeleton'

export const DashboardAdmin = () => {
    const dispatch = useAppDispatch()
    const location = useLocation()

    // ─── Filter states ──────────────────────────────────
    const [fromDate, setFromDate] = useState(getDateOffset(29))
    const [toDate, setToDate] = useState(getToday())
    const [groupBy, setGroupBy] = useState('DAY')
    const [topN, setTopN] = useState(5)
    const [activePreset, setActivePreset] = useState<PresetKey>('30d')

    // ─── Data states ────────────────────────────────────
    const [data, setData] = useState<IDashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    // ─── Breadcrumbs ────────────────────────────────────
    useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
            { label: 'Quản lý', path: '/admin' },
            { label: 'Dashboard', path: '/admin' },
        ]))
    }, [dispatch, location.pathname])

    // ─── Fetch data ─────────────────────────────────────
    const fetchDashboard = useCallback(async () => {
        setLoading(true)
        try {
            const res = await callFetchDashboardApi(fromDate, toDate, groupBy, topN)
            if (res.data?.data) {
                setData(res.data.data)
            }
        } catch (err) {
            console.error('Failed to fetch dashboard', err)
        } finally {
            setLoading(false)
        }
    }, [fromDate, toDate, groupBy, topN])

    useEffect(() => {
        fetchDashboard()
    }, [fetchDashboard])

    // ─── Handlers ───────────────────────────────────────
    const handlePreset = (preset: PresetItem) => {
        setActivePreset(preset.key)
        setFromDate(preset.days === 0 ? getToday() : getDateOffset(preset.days))
        setToDate(getToday())
        if (preset.days <= 90) setGroupBy('DAY')
        else setGroupBy('MONTH')
    }

    const handleReset = () => {
        setFromDate(getDateOffset(29))
        setToDate(getToday())
        setGroupBy('DAY')
        setTopN(5)
        setActivePreset('30d')
    }

    const handleFromDateChange = (value: string) => {
        setFromDate(value)
        setActivePreset('')
    }

    const handleToDateChange = (value: string) => {
        setToDate(value)
        setActivePreset('')
    }

    // ─── Render ─────────────────────────────────────────
    return (
        <div>
            <DashboardFilterBar
                fromDate={fromDate}
                toDate={toDate}
                groupBy={groupBy}
                topN={topN}
                activePreset={activePreset}
                onFromDateChange={handleFromDateChange}
                onToDateChange={handleToDateChange}
                onGroupByChange={setGroupBy}
                onTopNChange={setTopN}
                onPresetClick={handlePreset}
                onFilter={fetchDashboard}
                onReset={handleReset}
            />

            {loading && <DashboardSkeleton />}

            {!loading && data && (
                <>
                    <DashboardStatCards summary={data.summary} />

                    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                        <Col xs={24} lg={16}>
                            <RevenueChart revenueSeries={data.revenueSeries} />
                        </Col>
                        <Col xs={24} lg={8}>
                            <OrderStatusBreakdown orderStatusBreakdown={data.orderStatusBreakdown} />
                        </Col>
                    </Row>

                    <TopProductsTable topProducts={data.topProducts} />
                </>
            )}
        </div>
    )
}