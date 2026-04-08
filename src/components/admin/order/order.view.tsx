import { X, Package, CreditCard, MapPin, User, Clock, FileText } from 'lucide-react';
import React from 'react';
import { IOrder } from '../../../types/backend';
import { callFetchOrderByIdApi } from '../../../services/api';

interface OrderViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    orderId: number | null;
}

const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
        PENDING: { label: 'Chờ xác nhận', className: 'badge-warning' },
        CONFIRMED: { label: 'Đã xác nhận', className: 'badge-info' },
        SHIPPING: { label: 'Đang giao', className: 'badge-primary' },
        DELIVERED: { label: 'Đã giao', className: 'badge-success' },
        CANCELLED: { label: 'Đã hủy', className: 'badge-error' },
    };
    const info = map[status] || { label: status, className: 'badge-ghost' };
    return <span className={`badge ${info.className} badge-sm`}>{info.label}</span>;
};

const getPaymentStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
        PENDING: { label: 'Chờ thanh toán', className: 'badge-warning' },
        PAID: { label: 'Đã thanh toán', className: 'badge-success' },
        FAILED: { label: 'Thất bại', className: 'badge-error' },
        REFUNDED: { label: 'Đã hoàn tiền', className: 'badge-info' },
    };
    const info = map[status] || { label: status, className: 'badge-ghost' };
    return <span className={`badge ${info.className} badge-sm`}>{info.label}</span>;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDateTime = (dateStr: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(dateStr));
};

export const OrderView: React.FC<OrderViewProps> = ({ isOpen, setIsOpen, orderId }) => {
    const [order, setOrder] = React.useState<IOrder | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (isOpen && orderId) {
            setLoading(true);
            callFetchOrderByIdApi(orderId)
                .then(res => {
                    if (res.data?.data) {
                        setOrder(res.data.data);
                    }
                })
                .catch(err => {
                    console.error('Failed to fetch order detail:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, orderId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>

            {/* Modal */}
            <div className="relative z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Chi tiết đơn hàng
                            </h3>
                            {order && (
                                <p className="text-sm text-gray-500">{order.orderCode}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : order ? (
                    <div className="space-y-6">
                        {/* Order Status & Payment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Trạng thái đơn hàng</span>
                                </div>
                                <div>{getStatusBadge(order.status)}</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <CreditCard className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Thanh toán</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-outline badge-sm">{order.paymentMethod}</span>
                                    {getPaymentStatusBadge(order.paymentStatus)}
                                </div>
                            </div>
                        </div>

                        {/* Receiver Info */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Thông tin người nhận</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400">Tên người nhận</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{order.receiverName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Số điện thoại</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{order.receiverPhone}</p>
                                </div>
                                {order.receiverEmail && (
                                    <div>
                                        <p className="text-xs text-gray-400">Email</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{order.receiverEmail}</p>
                                    </div>
                                )}
                                {order.receiverAddress && (
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-gray-400" />
                                            <p className="text-xs text-gray-400">Địa chỉ</p>
                                        </div>
                                        <p className="font-medium text-gray-900 dark:text-white">{order.receiverAddress}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        {order.orderDetails && order.orderDetails.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Sản phẩm đặt hàng</h4>
                                <div className="rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-700">
                                                <th className="text-xs">Sản phẩm</th>
                                                <th className="text-xs text-right">Đơn giá</th>
                                                <th className="text-xs text-center">SL</th>
                                                <th className="text-xs text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderDetails.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            {item.book?.image && (
                                                                <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                                                                    <img
                                                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${item.book.image}`}
                                                                        alt={item.book.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-medium text-sm text-gray-900 dark:text-white">{item.book?.title}</p>
                                                                {item.book?.authors && item.book.authors.length > 0 && (
                                                                    <p className="text-xs text-gray-400">
                                                                        {item.book.authors.map(a => a.name).join(', ')}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-right text-sm">{formatCurrency(item.price)}</td>
                                                    <td className="text-center text-sm">{item.quantity}</td>
                                                    <td className="text-right text-sm font-medium">{formatCurrency(item.price * item.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Price Summary */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tạm tính</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
                                </div>
                                {order.shippingFee !== undefined && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Phí vận chuyển</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {order.shippingFee === 0 ? 'Miễn phí' : formatCurrency(order.shippingFee)}
                                        </span>
                                    </div>
                                )}
                                {order.discountTotal !== undefined && order.discountTotal > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Giảm giá</span>
                                        <span className="text-green-600">-{formatCurrency(order.discountTotal)}</span>
                                    </div>
                                )}
                                <div className="divider my-1"></div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-900 dark:text-white">Tổng cộng</span>
                                    <span className="font-bold text-lg text-blue-600">{formatCurrency(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Thông tin thời gian</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {order.createdAt && (
                                    <div>
                                        <p className="text-xs text-gray-400">Ngày tạo</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDateTime(order.createdAt)}</p>
                                    </div>
                                )}
                                {order.updatedAt && (
                                    <div>
                                        <p className="text-xs text-gray-400">Cập nhật lần cuối</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDateTime(order.updatedAt)}</p>
                                    </div>
                                )}
                                {order.paidAt && (
                                    <div>
                                        <p className="text-xs text-gray-400">Ngày thanh toán</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDateTime(order.paidAt)}</p>
                                    </div>
                                )}
                                {order.createdBy && (
                                    <div>
                                        <p className="text-xs text-gray-400">Tạo bởi</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.createdBy}</p>
                                    </div>
                                )}
                                {order.updatedBy && (
                                    <div>
                                        <p className="text-xs text-gray-400">Cập nhật bởi</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.updatedBy}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">Không tìm thấy thông tin đơn hàng</div>
                )}
            </div>
        </div>
    );
};
