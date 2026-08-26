import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Loader2,
    RotateCcw,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { IOrder, IMeta } from '../../types/backend';
import { callFetchMyOrdersApi, callAddToCartApi } from '../../services/api';
import { formatPrice } from '../../common/formatPrice';
import { showToast, ToastType } from '../../common/showToast';
import { useDispatch } from 'react-redux';
import { setCartSum } from '../../redux/slide/cart.slice';

// ─── Status helpers ───────────────────────────────────────────────

type FilterTab = 'ALL' | 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

const ORDER_STATUS_MAP: Record<string, { label: string; dotClass: string; badgeClass: string }> = {
    PENDING: {
        label: 'Chờ xác nhận',
        dotClass: 'bg-amber-500',
        badgeClass: 'bg-[#FAF9F7] text-[#1A1A1A] border border-[#E5E2DD]',
    },
    CONFIRMED: {
        label: 'Đã xác nhận',
        dotClass: 'bg-blue-500',
        badgeClass: 'bg-[#FAF9F7] text-[#1A1A1A] border border-[#E5E2DD]',
    },
    SHIPPING: {
        label: 'Đang giao hàng',
        dotClass: 'bg-indigo-500',
        badgeClass: 'bg-[#FAF9F7] text-[#1A1A1A] border border-[#E5E2DD]',
    },
    DELIVERED: {
        label: 'Hoàn thành',
        dotClass: 'bg-emerald-600',
        badgeClass: 'bg-[#FAF9F7] text-[#1A1A1A] border border-[#E5E2DD]',
    },
    CANCELLED: {
        label: 'Đã hủy',
        dotClass: 'bg-[#BA1A1A]',
        badgeClass: 'bg-[#FAF9F7] text-[#BA1A1A] border border-[#E5E2DD]',
    },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string }> = {
    PENDING: { label: 'Chờ thanh toán' },
    PAID: { label: 'Đã thanh toán' },
    FAILED: { label: 'Thanh toán thất bại' },
    REFUNDED: { label: 'Đã hoàn tiền' },
};

function formatDate(dateStr?: string | null) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

const PAGE_SIZE = 10;

// ─── Order Card ───────────────────────────────────────────────────

function OrderCard({
    order,
    onReorder,
    isReordering,
}: {
    order: IOrder;
    onReorder: (order: IOrder) => void;
    isReordering: boolean;
}) {
    const [showDetails, setShowDetails] = useState(false);

    const status = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.PENDING;
    const paymentStatus = PAYMENT_STATUS_MAP[order.paymentStatus] || PAYMENT_STATUS_MAP.PENDING;
    const isCancelled = order.status === 'CANCELLED';

    return (
        <article
            className={`bg-white p-6 sm:p-8 border border-[#E5E2DD] rounded-xl shadow-xs flex flex-col gap-6 transition-all ${
                isCancelled ? 'opacity-80' : ''
            }`}
        >
            {/* ── Card Header ────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E2DD]">
                <div>
                    <span className="text-xs font-semibold text-[#7E7576] uppercase tracking-widest block">
                        Đơn hàng
                    </span>
                    <h3 className={`font-serif font-bold text-lg sm:text-xl text-[#1A1A1A] mt-0.5 ${isCancelled ? 'line-through text-[#7E7576]' : ''}`}>
                        #{order.orderCode}
                    </h3>
                    <p className="text-xs text-[#7E7576] mt-0.5">
                        Đặt ngày {formatDate(order.createdAt)}
                    </p>
                </div>
                <div>
                    <span className={`inline-flex items-center px-3.5 py-1 text-xs font-medium rounded-full ${status.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${status.dotClass} mr-2`} />
                        {status.label}
                    </span>
                </div>
            </div>

            {/* ── Order Items ──────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
                {(order.orderDetails || []).map((detail) => (
                    <div key={detail.id} className="flex gap-4 items-start">
                        <Link
                            to={`/product/${detail.book.id}`}
                            className="w-16 h-24 sm:w-20 sm:h-28 flex-shrink-0 bg-[#FAF9F7] border border-[#E5E2DD] rounded overflow-hidden"
                        >
                            {detail.book.image ? (
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${detail.book.image}`}
                                    alt={detail.book.title}
                                    className={`w-full h-full object-cover ${isCancelled ? 'grayscale' : ''}`}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#FAF9F7] text-xl">
                                    📚
                                </div>
                            )}
                        </Link>
                        <div className="flex-grow min-w-0">
                            <Link
                                to={`/product/${detail.book.id}`}
                                className="font-serif font-bold text-base sm:text-lg text-[#1A1A1A] hover:text-[#0070B5] transition-colors line-clamp-2"
                            >
                                {detail.book.title}
                            </Link>
                            <p className="text-xs text-[#7E7576] mt-1">
                                Số lượng: {detail.quantity}
                            </p>
                        </div>
                        <div className="text-right flex-shrink-0 font-semibold text-sm sm:text-base text-[#1A1A1A]">
                            {formatPrice(detail.price * detail.quantity)}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Optional Detail Expandable Panel ────────────────── */}
            {showDetails && (
                <div className="bg-[#FAF9F7] border border-[#E5E2DD] rounded-lg p-5 space-y-3 text-xs text-[#4C4546]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <span className="text-[#7E7576]">Người nhận: </span>
                            <span className="font-semibold text-[#1A1A1A]">{order.receiverName}</span>
                        </div>
                        <div>
                            <span className="text-[#7E7576]">Điện thoại: </span>
                            <span className="font-semibold text-[#1A1A1A]">{order.receiverPhone}</span>
                        </div>
                        <div className="sm:col-span-2">
                            <span className="text-[#7E7576]">Địa chỉ nhận hàng: </span>
                            <span className="font-semibold text-[#1A1A1A]">{order.receiverAddress}</span>
                        </div>
                        <div>
                            <span className="text-[#7E7576]">Thanh toán: </span>
                            <span className="font-semibold text-[#1A1A1A]">
                                {order.paymentMethod === 'VNPAY' ? 'VNPay Online' : 'COD (Tiền mặt)'}
                            </span>
                            <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-white border border-[#E5E2DD]">
                                {paymentStatus.label}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Card Footer ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E5E2DD]">
                <div className="flex items-baseline gap-2">
                    <span className="text-sm text-[#4C4546]">Tổng tiền:</span>
                    <span className="font-serif font-bold text-lg sm:text-xl text-[#1A1A1A]">
                        {formatPrice(order.totalPrice)}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-5 py-2.5 border border-[#1A1A1A] text-[#1A1A1A] text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#FAF9F7] active:bg-[#F0EEEA] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                        {showDetails ? (
                            <>
                                <ChevronUp className="w-3.5 h-3.5" />
                                Thu gọn
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3.5 h-3.5" />
                                Xem chi tiết
                            </>
                        )}
                    </button>
                    {!isCancelled && (
                        <button
                            onClick={() => onReorder(order)}
                            disabled={isReordering}
                            className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#0070B5] active:bg-[#005a92] transition-colors duration-200 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            {isReordering ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <RotateCcw className="w-3.5 h-3.5" />
                            )}
                            Mua lại
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

// ─── Empty state ──────────────────────────────────────────────────

function OrderHistoryEmpty() {
    return (
        <div className="bg-white rounded-xl border border-[#E5E2DD] p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-xs">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1A1A1A] mb-2">
                Chưa có đơn hàng nào
            </h3>
            <p className="text-sm text-[#4C4546] max-w-sm mb-6">
                Hãy khám phá kho tàng tri thức với hàng ngàn đầu sách hấp dẫn của BookVerse!
            </p>
            <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1A1A1A] hover:bg-[#0070B5] active:bg-[#005a92] text-white font-semibold text-sm rounded-lg shadow-xs transition-colors duration-200 cursor-pointer"
            >
                Khám phá sách ngay
            </Link>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function OrderHistoryPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [meta, setMeta] = useState<IMeta | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
    const [reorderingId, setReorderingId] = useState<number | null>(null);

    const fetchOrders = useCallback(async (page: number) => {
        try {
            const res = await callFetchMyOrdersApi(page, PAGE_SIZE);
            if (res.status === 200 && res.data.data) {
                const data = res.data.data;
                setOrders(data.result);
                setMeta(data.meta);
            }
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    }, []);

    // Initial load
    useEffect(() => {
        setIsLoading(true);
        fetchOrders(currentPage).finally(() => setIsLoading(false));
    }, [fetchOrders, currentPage]);

    // Reorder handler: Adds items from order back to cart and redirects to /cart
    const handleReorder = async (order: IOrder) => {
        setReorderingId(order.id);
        try {
            let lastSum = 0;
            for (const detail of order.orderDetails || []) {
                const res = await callAddToCartApi(detail.book.id, detail.quantity);
                if (res.status === 200) {
                    lastSum = res.data.data?.sum || 0;
                }
            }
            if (lastSum > 0) {
                dispatch(setCartSum(lastSum));
            }
            showToast('Đã thêm sản phẩm vào giỏ hàng!', ToastType.SUCCESS);
            navigate('/cart');
        } catch (err) {
            console.error(err);
            showToast('Không thể thêm sản phẩm vào giỏ hàng', ToastType.ERROR);
        } finally {
            setReorderingId(null);
        }
    };

    // Filter orders by active tab
    const filteredOrders = orders.filter((order) => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'PENDING') return order.status === 'PENDING' || order.status === 'CONFIRMED';
        if (activeTab === 'SHIPPING') return order.status === 'SHIPPING';
        if (activeTab === 'DELIVERED') return order.status === 'DELIVERED';
        if (activeTab === 'CANCELLED') return order.status === 'CANCELLED';
        return true;
    });

    const tabs: { key: FilterTab; label: string }[] = [
        { key: 'ALL', label: 'Tất cả' },
        { key: 'PENDING', label: 'Chờ xác nhận' },
        { key: 'SHIPPING', label: 'Đang giao' },
        { key: 'DELIVERED', label: 'Hoàn thành' },
        { key: 'CANCELLED', label: 'Đã hủy' },
    ];

    // ── Loading skeleton ──────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-white rounded-xl border border-[#E5E2DD] p-12 text-center shadow-xs flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
                    <p className="text-sm text-[#4C4546] font-medium">Đang tải lịch sử đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-10 font-sans text-[#1A1A1A]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7E7576] mb-6">
                <Link to="/" className="hover:text-[#0070B5] transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#CFC4C5]" />
                <span className="text-[#1A1A1A] font-semibold">Lịch sử đơn hàng</span>
            </div>

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
                    Lịch sử đơn hàng
                </h1>
                <p className="text-sm text-[#4C4546] mt-1.5">
                    Xem lại các ấn phẩm bạn đã mua và trạng thái giao hàng.
                </p>
            </div>

            {/* Order Tabs/Filters */}
            <div className="flex overflow-x-auto gap-4 sm:gap-8 mb-8 border-b border-[#E5E2DD] scrollbar-none">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`text-sm pb-3 px-1 font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                                isActive
                                    ? 'text-[#1A1A1A] border-[#1A1A1A]'
                                    : 'text-[#7E7576] border-transparent hover:text-[#1A1A1A]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <OrderHistoryEmpty />
            ) : (
                <div className="flex flex-col gap-6">
                    {filteredOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onReorder={handleReorder}
                            isReordering={reorderingId === order.id}
                        />
                    ))}

                    {/* Pagination */}
                    {meta && meta.pages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-8">
                            {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setCurrentPage(p)}
                                    className={`w-9 h-9 rounded-lg font-semibold text-sm flex items-center justify-center transition-all cursor-pointer ${
                                        p === currentPage
                                            ? 'bg-[#1A1A1A] text-white shadow-xs'
                                            : 'bg-white border border-[#E5E2DD] text-[#1A1A1A] hover:bg-[#FAF9F7]'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
