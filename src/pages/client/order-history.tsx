import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight,
    ChevronDown,
    Package,
    Loader2,
    ShoppingBag,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    CreditCard,
    Banknote,
    MapPin,
    Phone,
    Calendar,
    Hash,
    Eye,
    EyeOff,
    PackageOpen,
} from 'lucide-react';
import { IOrder, IMeta } from '../../types/backend';
import { callFetchMyOrdersApi } from '../../services/api';
import { formatPrice } from '../../common/formatPrice';

// ─── Status helpers ───────────────────────────────────────────────

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    PENDING: {
        label: 'Chờ xác nhận',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: <Clock className="w-3.5 h-3.5" />,
    },
    CONFIRMED: {
        label: 'Đã xác nhận',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    SHIPPING: {
        label: 'Đang giao',
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        icon: <Truck className="w-3.5 h-3.5" />,
    },
    DELIVERED: {
        label: 'Đã giao',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    CANCELLED: {
        label: 'Đã hủy',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <XCircle className="w-3.5 h-3.5" />,
    },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Chờ thanh toán', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    PAID: { label: 'Đã thanh toán', color: 'text-green-600 bg-green-50 border-green-200' },
    FAILED: { label: 'Thất bại', color: 'text-red-600 bg-red-50 border-red-200' },
    REFUNDED: { label: 'Đã hoàn tiền', color: 'text-purple-600 bg-purple-50 border-purple-200' },
};

function formatDate(dateStr?: string | null) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ─── Page size ────────────────────────────────────────────────────

const PAGE_SIZE = 5;

// ─── Order Card ───────────────────────────────────────────────────

function OrderCard({ order }: { order: IOrder }) {
    const [expanded, setExpanded] = useState(false);

    const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING;
    const paymentStatus = PAYMENT_STATUS_MAP[order.paymentStatus] || PAYMENT_STATUS_MAP.PENDING;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
                        hover:shadow-md hover:border-gray-200 transition-all duration-300">
            {/* ── Header ────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
                            px-5 py-4 border-b border-gray-100 bg-gray-50/40">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg
                                    bg-gradient-to-br from-primary-500 to-primary-600
                                    shadow-sm shadow-primary-200/40 flex-shrink-0">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 font-mono tracking-wide truncate">
                            {order.orderCode}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Order status badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${status.color}`}>
                        {status.icon}
                        {status.label}
                    </span>
                    {/* Payment status badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${paymentStatus.color}`}>
                        <CreditCard className="w-3 h-3" />
                        {paymentStatus.label}
                    </span>
                </div>
            </div>

            {/* ── Body ──────────────────────────────────────── */}
            <div className="px-5 py-4">
                {/* Products preview (always show first 2) */}
                <div className="space-y-2.5">
                    {(order.orderDetails || []).slice(0, expanded ? undefined : 2).map((detail) => (
                        <div key={detail.id} className="flex gap-3 items-center">
                            {/* Thumbnail */}
                            <div className="relative flex-shrink-0 w-14 h-[68px] rounded-lg overflow-hidden
                                            bg-gray-100 border border-gray-100">
                                {detail.book.image ? (
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${detail.book.image}`}
                                        alt={detail.book.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center
                                                    bg-gradient-to-br from-primary-50 to-primary-100">
                                        <span className="text-lg">📚</span>
                                    </div>
                                )}
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                    {detail.book.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {detail.book.authors?.map(a => a.name).join(', ') || 'Tác giả'}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Số lượng: <span className="font-medium text-gray-600">{detail.quantity}</span>
                                </p>
                            </div>
                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                                <p className="text-sm font-bold text-primary-600">
                                    {formatPrice(detail.price)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show more items toggle */}
                {(order.orderDetails?.length || 0) > 2 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-3 flex items-center gap-1.5 text-xs text-primary-500
                                   hover:text-primary-600 font-medium transition-colors"
                    >
                        {expanded ? (
                            <>
                                <EyeOff className="w-3.5 h-3.5" />
                                Ẩn bớt
                            </>
                        ) : (
                            <>
                                <Eye className="w-3.5 h-3.5" />
                                Xem thêm {(order.orderDetails?.length || 0) - 2} sản phẩm
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* ── Footer ────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
                            px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
                {/* Meta info */}
                <div className="flex items-center gap-4 flex-wrap text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        {order.paymentMethod === 'VNPAY' ? (
                            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                            <Banknote className="w-3.5 h-3.5 text-green-400" />
                        )}
                        {order.paymentMethod}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="max-w-[180px] truncate">{order.receiverAddress || '—'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {order.receiverPhone}
                    </span>
                </div>

                {/* Total */}
                <div className="flex items-center gap-3">
                    {(order.discountTotal ?? 0) > 0 && (
                        <span className="text-xs text-red-400 font-medium">
                            -{formatPrice(order.discountTotal ?? 0)}
                        </span>
                    )}
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-500">Tổng:</span>
                        <span className="text-lg font-bold text-primary-600">
                            {formatPrice(order.totalPrice)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────

function OrderHistoryEmpty() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl
                            bg-gradient-to-br from-gray-100 to-gray-200">
                <PackageOpen className="w-10 h-10 text-gray-400" />
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold text-gray-700">Chưa có đơn hàng nào</h3>
                <p className="text-sm text-gray-400 mt-1">
                    Hãy khám phá và mua sắm những cuốn sách yêu thích nhé!
                </p>
            </div>
            <Link
                to="/products"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5
                           bg-gradient-to-r from-primary-500 to-primary-600 text-white
                           text-sm font-semibold rounded-xl shadow-lg shadow-primary-200/50
                           hover:from-primary-600 hover:to-primary-700
                           active:scale-[0.98] transition-all duration-200"
            >
                <ShoppingBag className="w-4 h-4" />
                Mua sắm ngay
            </Link>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [meta, setMeta] = useState<IMeta | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const fetchOrders = useCallback(async (page: number, append: boolean) => {
        try {
            const res = await callFetchMyOrdersApi(page, PAGE_SIZE);
            if (res.status === 200 && res.data.data) {
                const data = res.data.data;
                setOrders(prev => append ? [...prev, ...data.result] : data.result);
                setMeta(data.meta);
            }
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    }, []);

    // Initial load
    useEffect(() => {
        setIsLoading(true);
        fetchOrders(1, false).finally(() => setIsLoading(false));
    }, [fetchOrders]);

    // Load more handler
    const handleLoadMore = async () => {
        const nextPage = currentPage + 1;
        setIsLoadingMore(true);
        await fetchOrders(nextPage, true);
        setCurrentPage(nextPage);
        setIsLoadingMore(false);
    };

    const hasMore = meta ? currentPage < meta.pages : false;

    // ── Loading skeleton ──────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    <p className="text-sm text-gray-400">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] pb-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-primary-500 transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-800 font-semibold">Lịch sử đơn hàng</span>
            </div>

            {/* Page Title */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl
                                    bg-gradient-to-br from-primary-500 to-primary-600
                                    shadow-lg shadow-primary-200/40">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
                        <p className="text-sm text-gray-400">
                            {meta && meta.total > 0
                                ? `${meta.total} đơn hàng`
                                : 'Chưa có đơn hàng nào'}
                        </p>
                    </div>
                </div>

                {/* Order count badge */}
                {meta && meta.total > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                                    bg-primary-50 border border-primary-100">
                        <Hash className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-sm font-semibold text-primary-600">{meta.total}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            {orders.length === 0 ? (
                <OrderHistoryEmpty />
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}

                    {/* Load more */}
                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="inline-flex items-center gap-2 px-6 py-3
                                           bg-white border-2 border-gray-200 text-gray-700
                                           text-sm font-semibold rounded-xl
                                           hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50
                                           active:scale-[0.98]
                                           disabled:opacity-60 disabled:cursor-not-allowed
                                           shadow-sm hover:shadow-md
                                           transition-all duration-200"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Đang tải...
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4" />
                                        Xem thêm đơn hàng
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* All loaded indicator */}
                    {!hasMore && orders.length > 0 && (
                        <div className="flex items-center justify-center gap-2 py-6 text-gray-400 text-sm">
                            <div className="w-8 h-px bg-gray-200" />
                            <span>Đã hiển thị tất cả đơn hàng</span>
                            <div className="w-8 h-px bg-gray-200" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
