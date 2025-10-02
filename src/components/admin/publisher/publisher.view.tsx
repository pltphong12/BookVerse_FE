import { X } from 'lucide-react';
import { IPublisher } from '../../../types/backend';

interface PublisherViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    publisher: IPublisher | null;
}

export const PublisherView: React.FC<PublisherViewProps> = ({ isOpen, setIsOpen, publisher }) => {
    if (!isOpen || !publisher) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>

            {/* Modal */}
            <div className="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Thông tin nhà xuất bản
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
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/publisher/${publisher.image}`} alt="User Avatar" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold">{publisher.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email: {publisher.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Địa chỉ</p>
                            <p className="text-gray-900 dark:text-white">{publisher.address}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số điện thoại</p>
                            <p className="text-gray-900 dark:text-white">{publisher.phone}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tạo</p>
                            <p className="text-gray-900 dark:text-white">
                                {publisher.createdAt && new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }).format(new Date(publisher.createdAt))}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mô tả</p>
                            <p className="text-gray-900 dark:text-white">{publisher.description}</p>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};
