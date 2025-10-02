import { X } from 'lucide-react';
import { IAuthor } from '../../../types/backend';

interface AuthorViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    author: IAuthor | null;
}

export const AuthorView: React.FC<AuthorViewProps> = ({ isOpen, setIsOpen, author }) => {
    if (!isOpen || !author) return null;

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
                                {author.avatar ? (
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/author/${author.avatar}`}
                                        alt={author.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-900">
                                        {/* Default Book Cover Design */}
                                        <div className="p-6 h-full flex flex-col justify-between text-white">


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
                                                    {author.books && author.books.length > 0
                                                        ? author.books.map(book => book.title).join(', ').toUpperCase()
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
                            {/* <div>
                                        <h1 className="text-3xl   text-gray-800 dark:text-white mb-2">{author.title}</h1>
                                    </div> */}

                            {/* Details Grid */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Họ và tên: </span>
                                    <span className="text-gray-800 dark:text-white font-semibold">{author.name}</span>
                                </div>

                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Sách: </span>
                                    <div className="text-right">
                                        {author.books && author.books.length > 0 ? (
                                            author.books.map((book, index) => (
                                                <div key={book.id} className="text-gray-800 dark:text-white font-semibold">
                                                    {book.title}
                                                    {index < author.books.length - 1 && ', '}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-400">Chưa có sách</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Quê quán: </span>
                                    <span className="text-gray-800 dark:text-white font-semibold">{author.nationality}</span>
                                </div>

                                {/* <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">Giá:</span>
                                            <span className="text-2xl  ">{formatPrice(book.price)}</span>
                                        </div> */}

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Ngày sinh:</span>
                                    <span className=" text-gray-800 dark:text-white font-semibold">
                                        {author.birthday && new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                        }).format(new Date(author.birthday))}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">Ngày tạo:</span>
                                    <span className="text-gray-800 dark:text-white font-semibold">
                                        {author.createdAt && new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        }).format(new Date(author.createdAt))}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}


                            {/* Additional Information */}
                        </div>
                    </div>
                    {/* <div className='pt-4'>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg   text-gray-800 dark:text-white">Mô tả</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {book.description || 'Chưa có mô tả cho cuốn sách này.'}
                            </p>
                        </div>
                    </div> */}
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
