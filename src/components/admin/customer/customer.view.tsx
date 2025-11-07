import { DollarSign, ShoppingBag, User, X } from 'lucide-react';
import { ICustomer } from '../../../types/backend';

interface CustomerViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    customer: ICustomer | null;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ isOpen, setIsOpen, customer }) => {
    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>

            {/* Modal */}
            <div className="relative z-50 w-full max-w-4xl rounded-lg bg-white p-6 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="w-6 h-6" />
                        Thông tin khách hàng
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Customer Info Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <div className="flex items-center space-x-6">
                            <div className="avatar">
                                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${customer.user.avatar}`}
                                        alt="Customer Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {customer.user.fullName}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Cấp bậc khách hàng: {customer.customerLevel}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                                    <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tổng đơn hàng</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {customer.totalOrder || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Tổng chi tiêu</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                        {customer.totalSpending ? new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(customer.totalSpending) : '0 ₫'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h5 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                                Thông tin cá nhân
                            </h5>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mã CCCD</p>
                                    <p className="text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                                        {customer.identityCard || 'Chưa cập nhật'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Địa chỉ</p>
                                    <p className="text-gray-900 dark:text-white">{customer.user.address || 'Chưa cập nhật'}</p>
                                </div>


                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="space-y-4">
                            <h5 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                                Thông tin tài khoản
                            </h5>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tên đăng nhập</p>
                                    <p className="text-gray-900 dark:text-white ">{customer.user.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="text-gray-900 dark:text-white ">{customer.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số điện thoại</p>
                                    <p className="text-gray-900 dark:text-white ">{customer.user.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tạo</p>
                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                        {customer.createdAt && new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        }).format(new Date(customer.createdAt))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};