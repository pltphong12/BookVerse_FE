import { X } from 'lucide-react';
import { IBook } from '../../../types/backend';
import { formatPrice } from '../../../common/formatPrice';

interface BookViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    book: IBook | null;
}

export const BookView: React.FC<BookViewProps> = ({ isOpen, setIsOpen, book }) => {
    if (!isOpen || !book) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>

            {/* Modal */}
            <div className="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Thông tin sách
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Book Cover */}
                        <div className="flex-shrink-0">
                            <div className="w-64 h-80 bg-gradient-to-b from-blue-900 to-blue-700 rounded-lg shadow-lg overflow-hidden relative">
                                {book.image ? (
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${book.image}`}
                                        alt={book.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-900">
                                        {/* Default Book Cover Design */}
                                        <div className="p-6 h-full flex flex-col justify-between text-white">
                                            <div>
                                                <h3 className="text-xl   text-yellow-400 mb-2 line-clamp-2">
                                                    {book.title.toUpperCase()}
                                                </h3>
                                            </div>

                                            {/* Abstract design */}
                                            <div className="flex-1 flex items-center justify-center">
                                                <div className="relative">
                                                    <div className="w-20 h-12 bg-blue-600 rounded-full opacity-80"></div>
                                                    <div className="absolute top-2 left-6 w-2 h-2 bg-cyan-300 rounded-full"></div>
                                                    <div className="absolute top-2 right-6 w-2 h-2 bg-cyan-300 rounded-full"></div>
                                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-red-500 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Decorative elements */}
                                            <div className="flex items-end justify-center space-x-1 mb-4">
                                                <div className="w-1 h-8 bg-yellow-400 opacity-70"></div>
                                                <div className="w-1 h-6 bg-yellow-400 opacity-70"></div>
                                                <div className="w-1 h-10 bg-yellow-400 opacity-70"></div>
                                                <div className="w-1 h-4 bg-yellow-400 opacity-70"></div>
                                                <div className="w-1 h-12 bg-yellow-400 opacity-70"></div>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-sm font-semibold line-clamp-2">
                                                    {book.authors && book.authors.length > 0
                                                        ? book.authors.map(author => author.name).join(', ').toUpperCase()
                                                        : 'UNKNOWN AUTHOR'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Book Details */}
                        <div className="flex-1 space-y-6">
                            {/* Title */}
                            <div>
                                <h1 className="text-3xl   text-gray-800 dark:text-white mb-2">{book.title}</h1>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Nhà xuất bản:</span>
                                    <span className="text-gray-800 dark:text-white font-semibold">{book.publisher.name}</span>
                                </div>

                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Tác giả:</span>
                                    <div className="text-right">
                                        {book.authors && book.authors.length > 0 ? (
                                            book.authors.map((author, index) => (
                                                <div key={author.id} className="text-gray-800 dark:text-white font-semibold">
                                                    {author.name}
                                                    {index < book.authors.length - 1 && ', '}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-400">Chưa có tác giả</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Thể loại:</span>
                                    <span className="text-gray-800 dark:text-white font-semibold">{book.category.name}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Giá:</span>
                                    <span className="text-2xl  ">{formatPrice(book.price)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Số lượng:</span>
                                    <span className="text-xl   text-gray-800 dark:text-white">{book.quantity} cuốn</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Ngày tạo:</span>
                                    <span className="text-gray-800 dark:text-white font-semibold">
                                        {book.createdAt && new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        }).format(new Date(book.createdAt))}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}


                            {/* Additional Information */}
                        </div>
                    </div>
                    <div className='pt-4'>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg   text-gray-800 dark:text-white">Mô tả</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {book.description || 'Chưa có mô tả cho cuốn sách này.'}
                            </p>
                        </div>
                    </div>
                    {/* <div className='pt-4'>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg   text-gray-800 dark:text-white mb-3">Thông tin bổ sung</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Ngày tạo:</span>
                                <span className="text-gray-800 dark:text-white font-semibold">
                                    {book.createdAt && new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    }).format(new Date(book.createdAt))}
                                </span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};
