// ─── Dashboard Shared Helpers & Constants ───────────────

export const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B ₫`
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M ₫`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K ₫`
    return `${value.toLocaleString('vi-VN')} ₫`
}

export const formatFullCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + ' ₫'
}

export const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export const getToday = () => {
    const d = new Date()
    return d.toISOString().split('T')[0]
}

export const getDateOffset = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString().split('T')[0]
}

// ─── Status config ──────────────────────────────────────
export const STATUS_COLORS: Record<string, string> = {
    PENDING: '#f59e0b',
    CONFIRMED: '#3b82f6',
    SHIPPING: '#8b5cf6',
    DELIVERED: '#10b981',
    CANCELLED: '#ef4444',
    RETURNED: '#ec4899',
}

export const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã huỷ',
    RETURNED: 'Hoàn trả',
}

// ─── Preset periods ─────────────────────────────────────
export type PresetKey = 'today' | '7d' | '30d' | '90d' | 'year' | ''
export interface PresetItem {
    key: PresetKey
    label: string
    days: number
}

export const PRESETS: PresetItem[] = [
    { key: 'today', label: 'Hôm nay', days: 0 },
    { key: '7d', label: '7 ngày', days: 6 },
    { key: '30d', label: '30 ngày', days: 29 },
    { key: '90d', label: '90 ngày', days: 89 },
    { key: 'year', label: '1 năm', days: 364 },
]
