import { Edit, View } from "lucide-react";
import React from "react";
import { IOrder } from "../../../types/backend";
import { Pagination } from "../../global/Pagination";
import { OrderSearchAndFilter } from "./order.search_filter";
import { OrderView } from "./order.view";
import { OrderForm } from "./order.form";

interface OrderTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IOrder[];
    orderCode: string;
    setOrderCode: React.Dispatch<React.SetStateAction<string>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    paymentMethod: string;
    setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
    paymentStatus: string;
    setPaymentStatus: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
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

export const OrderTable: React.FC<OrderTableProps> = ({
    load, page, totalPage, setPage, dataSource,
    orderCode, setOrderCode,
    status, setStatus,
    paymentMethod, setPaymentMethod,
    paymentStatus, setPaymentStatus,
    dateFrom, setDateFrom
}) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = React.useState<number | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
    const [editOrderId, setEditOrderId] = React.useState<number | null>(null);

    const handleViewOrder = (order: IOrder) => {
        setSelectedOrderId(order.id);
        setIsViewModalOpen(true);
    };

    const handleEditOrder = (order: IOrder) => {
        setEditOrderId(order.id);
        setIsEditModalOpen(true);
    };

    return (
        <>
            <div className='flex'>
                <OrderSearchAndFilter
                    orderCode={orderCode}
                    setOrderCode={setOrderCode}
                    status={status}
                    setStatus={setStatus}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    paymentStatus={paymentStatus}
                    setPaymentStatus={setPaymentStatus}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between mt-1">
                <div className="text-2xl font-bold">Quản lý đơn hàng</div>
            </div>

            <div className="rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <span>STT</span>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Mã đơn hàng</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Khách hàng</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Tổng tiền</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Trạng thái</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Thanh toán</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>TT Thanh toán</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Ngày tạo</span>
                                </div>
                            </th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataSource.map((record, index) => {
                            return (
                                <tr key={record.id} className='hover:bg-base-300'>
                                    <td>
                                        <div>
                                            {index + (page - 1) * 10 + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-mono text-sm font-medium text-blue-600">
                                            {record.orderCode}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div className="font-bold text-sm">{record.receiverName}</div>
                                            <div className="text-xs text-gray-400">{record.receiverPhone}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-semibold text-sm">
                                            {formatCurrency(record.totalPrice)}
                                        </div>
                                    </td>
                                    <td>
                                        {getStatusBadge(record.status)}
                                    </td>
                                    <td>
                                        <span className="badge badge-outline badge-sm">{record.paymentMethod}</span>
                                    </td>
                                    <td>
                                        {getPaymentStatusBadge(record.paymentStatus)}
                                    </td>
                                    <td>
                                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(record.createdAt as string))}
                                    </td>
                                    <td className="w-[1%]">
                                        <div className="dropdown dropdown-left">
                                            <button tabIndex={0} className="btn btn-ghost btn-sm">
                                                ⋮
                                            </button>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content menu bg-base-100 rounded-box z-[10] w-36 p-2 shadow-lg border border-base-content/20"
                                            >
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-info"
                                                        onClick={() => handleViewOrder(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem chi tiết</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => handleEditOrder(record)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        <span>Sửa</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {dataSource.length === 0 && <div className=''>Không có dữ liệu</div>}
            <Pagination page={page} totalPage={totalPage} setPage={setPage} />

            <OrderView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                orderId={selectedOrderId}
            />

            <OrderForm
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                load={load}
                orderIdToEdit={editOrderId}
            />
        </>
    )
}
