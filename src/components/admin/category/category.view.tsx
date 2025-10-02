import { X } from 'lucide-react';
import { ICategory } from '../../../types/backend';

interface CategoryViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    category: ICategory | null;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ isOpen, setIsOpen, category }) => {
    if (!isOpen || !category) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>

            {/* Modal */}
            <div className="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Thông tin thể loại
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
                        <h4 className="text-lg font-semibold">Thể loại: </h4>
                        <p>{category.name}</p>
                    </div>
                    <div className="items-center space-x-4">
                        <h4 className="text-lg font-semibold">Sách: {' '}</h4>
                        <p>
                            {category.infoBookInCategory && category.infoBookInCategory.length > 0
                                ? category.infoBookInCategory.map(book => book.title).join(', ')
                                : 'Không có sách thể loại này'
                            }
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tạo</p>
                            <p className="text-gray-900 dark:text-white">
                                {category.createdAt && new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }).format(new Date(category.createdAt))}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mô tả</p>
                            <p className="text-gray-900 dark:text-white">{category.description}</p>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};
