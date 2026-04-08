import React, { useEffect, useRef, useState } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface OrderSearchAndFilterProps {
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
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const ORDER_STATUSES = [
    { value: '', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELLED', label: 'Đã hủy' },
];

const PAYMENT_METHODS = [
    { value: '', label: 'Tất cả' },
    { value: 'COD', label: 'COD' },
    { value: 'VNPAY', label: 'VNPAY' },
];

const PAYMENT_STATUSES = [
    { value: '', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ thanh toán' },
    { value: 'PAID', label: 'Đã thanh toán' },
    { value: 'FAILED', label: 'Thất bại' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền' },
];

export const OrderSearchAndFilter: React.FC<OrderSearchAndFilterProps> = ({
    orderCode, setOrderCode,
    status, setStatus,
    paymentMethod, setPaymentMethod,
    paymentStatus, setPaymentStatus,
    dateFrom, setDateFrom,
    setPage
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const searchRef = useRef<HTMLInputElement>(null);

    const activeFilterCount = [status, paymentMethod, paymentStatus, dateFrom].filter(v => v !== '').length;

    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, []);

    const handleReset = () => {
        setOrderCode('');
        setStatus('');
        setPaymentMethod('');
        setPaymentStatus('');
        setDateFrom('');
        setPage(1);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 w-full">
            <div className="p-4 sm:flex items-center justify-between">
                <div className="relative flex-1 sm:max-w-md mb-4 sm:mb-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        ref={searchRef}
                        name="orderCode"
                        value={orderCode}
                        onChange={(e) => {
                            e.preventDefault();
                            setOrderCode(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Nhập mã đơn hàng..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                        <Filter size={16} />
                        <span>Bộ lọc</span>
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    {activeFilterCount > 0 && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Xóa bộ lọc"
                        >
                            <RotateCcw size={16} />
                            <span>Xóa lọc</span>
                        </button>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 border-t border-gray-200 grid sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                    <div className="space-y-2">
                        <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700">
                            Trạng thái đơn hàng
                        </label>
                        <select
                            id="orderStatus"
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                            {ORDER_STATUSES.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                            Phương thức thanh toán
                        </label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                            {PAYMENT_METHODS.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
                            Trạng thái thanh toán
                        </label>
                        <select
                            id="paymentStatus"
                            value={paymentStatus}
                            onChange={(e) => {
                                setPaymentStatus(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                            {PAYMENT_STATUSES.map(ps => (
                                <option key={ps.value} value={ps.value}>{ps.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                            Ngày tạo
                        </label>
                        <input
                            type="date"
                            id="dateFrom"
                            name="dateFrom"
                            value={dateFrom}
                            onChange={(e) => {
                                setDateFrom(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
