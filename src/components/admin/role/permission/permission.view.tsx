import { X } from 'lucide-react';
import { IPermission } from '../../../../types/backend';

interface PermissionViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    permission: IPermission | null;
}

export const PermissionView: React.FC<PermissionViewProps> = ({ isOpen, setIsOpen, permission }) => {
    if (!isOpen || !permission) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>

            {/* Modal */}
            <div className="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Thông tin quyền hạn
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
                    <div className="items-center space-x-4">
                        <h4 className="text-lg font-semibold">Tên quyền hạn: </h4>
                        <p>{permission.name}</p>
                    </div>
                    <div className="items-center space-x-4">
                        <h4 className="text-lg font-semibold">Đường dẫn: </h4>
                        <p>{permission.apiPath}</p>
                    </div>
                    <div className="items-center space-x-4">
                        <h4 className="text-lg font-semibold">Phương thức: </h4>
                        <p>{permission.method}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tạo</p>
                            <p className="text-gray-900 dark:text-white">
                                {permission.createdAt && new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }).format(new Date(permission.createdAt))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
