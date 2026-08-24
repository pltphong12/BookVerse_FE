import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Package,
    Loader2,
    ShoppingBag,
    CreditCard,
    Banknote,
    MapPin,
    Phone,
    PackageOpen,
    Eye,
    EyeOff,
    RotateCcw,
} from 'lucide-react';
import { IOrder, IMeta } from '../../types/backend';
import { callFetchMyOrdersApi, callAddToCartApi } from '../../services/api';
import { formatPrice } from '../../common/formatPrice';
import { showToast, ToastType } from '../../common/showToast';
import { useDispatch } from 'react-redux';
import { setCartSum } from '../../redux/slide/cart.slice';

// ─── Status helpers ───────────────────────────────────────────────

type FilterTab = 'ALL' | 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

const ORDER_STATUS_MAP: Record<string, { label: string; badgeClass: string }> = {
    PENDING: {
        label: 'Chờ xác nhận',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    CONFIRMED: {
        label: 'Đã xác nhận',
        badgeClass: 'bg-[#e3f2fd] text-[#1a237e] border border-blue-200',
    },
    SHIPPING: {
        label: 'Đang giao hàng',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    },
    DELIVERED: {
        label: 'Hoàn thành',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    CANCELLED: {
        label: 'Đã hủy',
        badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
    },
};

const PAYMENT_STATUS_MAP: Record<string, { label: string; badgeClass: string }> = {
    PENDING: { label: 'Chờ thanh toán', badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200' },
    PAID: { label: 'Đã thanh toán', badgeClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200' },
    FAILED: { label: 'Thanh toán thất bại', badgeClass: 'text-rose-700 bg-rose-50 border border-rose-200' },
    REFUNDED: { label: 'Đã hoàn tiền', badgeClass: 'text-purple-700 bg-purple-50 border border-purple-200' },
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
        <div
            className={`bg-white border border-[#dff1fb] rounded-xl p-5 sm:p-6 transition-all hover:shadow-[0_8px_20px_rgba(26,35,126,0.04)] ${
                isCancelled ? 'opacity-85' : ''
            }`}
        >
            {/* ── Card Header ────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-4 gap-3">
                <div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`font-headline font-bold text-sm sm:text-base text-[#0d1e25] ${
                                isCancelled ? 'line-through text-slate-400' : ''
                            }`}
                        >
                            #{order.orderCode}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.badgeClass}`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="font-body text-xs text-slate-400 mt-1">
                        Ngày đặt: {formatDate(order.createdAt)}
                    </p>
                </div>
                <div
                    className={`font-headline font-bold text-base sm:text-lg ${
                        isCancelled ? 'text-slate-400 line-through' : 'text-[#1a237e]'
                    } sm:text-right`}
                >
                    {formatPrice(order.totalPrice)}
                </div>
            </div>

            {/* ── Order Items ──────────────────────────────────────── */}
            <div className="flex flex-col gap-3.5 mb-5">
                {(order.orderDetails || []).map((detail) => (
                    <div key={detail.id} className="flex items-center gap-4">
                        <Link
                            to={`/product/${detail.book.id}`}
                            className="w-16 h-22 sm:w-16 sm:h-24 bg-[#f4faff] rounded-lg border border-[#dff1fb] overflow-hidden flex-shrink-0"
                        >
                            {detail.book.image ? (
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${detail.book.image}`}
                                    alt={detail.book.title}
                                    className={`w-full h-full object-cover ${isCancelled ? 'grayscale' : ''}`}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#e3f2fd]">
                                    <span className="text-xl">📚</span>
                                </div>
                            )}
                        </Link>
                        <div className="flex-grow min-w-0">
                            <Link
                                to={`/product/${detail.book.id}`}
                                className="font-headline font-bold text-xs sm:text-sm text-[#0d1e25] hover:text-[#1a237e] transition-colors line-clamp-2"
                            >
                                {detail.book.title}
                            </Link>
                            <p className="font-body text-xs text-slate-400 mt-0.5">
                                x{detail.quantity}
                            </p>
                        </div>
                        <div className="font-headline font-semibold text-xs sm:text-sm text-[#0d1e25] text-right flex-shrink-0">
                            {formatPrice(detail.price * detail.quantity)}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Optional Detail Expandable Panel ────────────────── */}
            {showDetails && (
                <div className="bg-[#f4faff] border border-[#dff1fb] rounded-xl p-4 mb-4 space-y-3 text-xs font-body text-slate-600 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">Người nhận:</span>
                            <span className="font-semibold text-slate-800">{order.receiverName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-400">Điện thoại:</span>
                            <span className="font-semibold text-slate-800">{order.receiverPhone}</span>
                        </div>
                        <div className="sm:col-span-2 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-slate-400">Địa chỉ:</span>
                            <span className="font-semibold text-slate-800">{order.receiverAddress}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {order.paymentMethod === 'VNPAY' ? (
                                <CreditCard className="w-3.5 h-3.5 text-[#1a237e]" />
                            ) : (
                                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                            <span className="text-slate-400">Thanh toán:</span>
                            <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
                            <span className={`ml-1 text-[11px] px-2 py-0.5 rounded-full ${paymentStatus.badgeClass}`}>
                                {paymentStatus.label}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Actions Footer ──────────────────────────────────── */}
            <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1 text-xs text-slate-400 font-body">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.orderDetails?.length || 0} sản phẩm</span>
                </div>

                <div className="flex items-center gap-2.5 ml-auto">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="font-headline font-semibold text-xs sm:text-sm border border-[#1a237e] text-[#1a237e] px-4 sm:px-5 py-2 rounded-lg hover:bg-[#e3f2fd]/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        {showDetails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showDetails ? 'Thu gọn' : 'Xem chi tiết'}
                    </button>
                    <button
                        onClick={() => onReorder(order)}
                        disabled={isReordering}
                        className="font-headline font-semibold text-xs sm:text-sm bg-[#1a237e] text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-[#283593] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                        {isReordering ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <RotateCcw className="w-3.5 h-3.5" />
                        )}
                        Mua lại
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────

function OrderHistoryEmpty() {
    return (
        <div className="bg-white rounded-2xl border border-[#dff1fb] p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#e3f2fd] flex items-center justify-center text-[#1a237e] mb-4">
                <PackageOpen className="w-10 h-10" />
            </div>
            <h3 className="font-headline font-bold text-xl text-[#0d1e25] mb-1">Chưa có đơn hàng nào</h3>
            <p className="font-body text-sm text-slate-500 max-w-sm mb-6">
                Hãy khám phá kho tàng tri thức với hàng ngàn đầu sách hấp dẫn của BookVerse!
            </p>
            <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a237e] hover:bg-[#283593] text-white font-headline font-bold text-sm rounded-xl shadow-md shadow-indigo-950/10 transition-all cursor-pointer"
            >
                <ShoppingBag className="w-4 h-4" />
                Mua sắm ngay
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
        { key: 'PENDING', label: 'Chờ thanh toán / xác nhận' },
        { key: 'SHIPPING', label: 'Đang giao' },
        { key: 'DELIVERED', label: 'Hoàn thành' },
        { key: 'CANCELLED', label: 'Đã hủy' },
    ];

    // ── Loading skeleton ──────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-[#dff1fb] p-12 text-center shadow-sm flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-[#e3f2fd] border-t-[#1a237e] rounded-full animate-spin"></div>
                    <p className="font-body text-sm text-slate-500 font-medium">Đang tải lịch sử đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-body text-slate-400 mb-6">
                <Link to="/" className="hover:text-[#1a237e] transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-700 font-semibold">Lịch sử đơn hàng</span>
            </div>

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="font-headline font-bold text-2xl sm:text-4xl text-[#0d1e25]">
                    Lịch sử đơn hàng
                </h1>
                <p className="font-body text-sm text-slate-500 mt-2">
                    Theo dõi và quản lý các đơn hàng bạn đã đặt tại BookVerse.
                </p>
            </div>

            {/* Order Tabs/Filters matching Stitch */}
            <div className="flex overflow-x-auto gap-4 sm:gap-6 mb-8 pb-2 border-b border-[#dff1fb] scrollbar-none">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`font-headline text-sm pb-2 px-1 whitespace-nowrap transition-colors cursor-pointer ${
                                isActive
                                    ? 'text-[#1a237e] font-bold border-b-2 border-[#1a237e]'
                                    : 'text-slate-500 hover:text-[#1a237e] font-medium'
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

                    {/* Pagination buttons if multiple pages */}
                    {meta && meta.pages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-6">
                            {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setCurrentPage(p)}
                                    className={`w-9 h-9 rounded-full font-headline font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
                                        p === currentPage
                                            ? 'bg-[#1a237e] text-white shadow-md shadow-indigo-950/15'
                                            : 'bg-white border border-[#dff1fb] text-slate-700 hover:bg-[#e3f2fd] hover:text-[#1a237e]'
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
