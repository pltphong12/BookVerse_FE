import { X } from 'lucide-react';
import { IUser } from '../../../types/backend';

interface UserViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser | null;
}

export const UserView: React.FC<UserViewProps> = ({ isOpen, setIsOpen, user }) => {
    if (!isOpen || !user) return null;
    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center">  
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>

            {/* Modal */}
            <div className="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Thông tin người dùng
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="avatar">
                            <div className="w-28 h-28 rounded-full ring ring-gray-700 ring-offset-base-100 ring-offset-2 overflow-hidden">
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${user.avatar}`} alt="User Avatar" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold">{user.email}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Vai trò: {user.role.name}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Họ và tên</p>
                            <p className="text-gray-900 dark:text-white">{user.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số điện thoại</p>
                            <p className="text-gray-900 dark:text-white">{user.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Địa chỉ</p>
                            <p className="text-gray-900 dark:text-white">{user.address}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-gray-900 dark:text-white">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tạo</p>
                            <p className="text-gray-900 dark:text-white">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(user.createdAt as string))}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
