interface PaginationProps {
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination = (props: PaginationProps) => {
    const { page, totalPage, setPage } = props;

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPage) setPage(page + 1);
    };

    const handlePageClick = (pageNumber: number) => {
        setPage(pageNumber);
    };

    // Không hiển thị pagination nếu chỉ có 1 trang hoặc không có trang nào
    if (totalPage <= 1) return null;

    // Tạo danh sách các trang cần hiển thị
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 6; // Số trang tối đa hiển thị

        if (totalPage <= maxVisiblePages) {
            // Nếu tổng số trang ít, hiển thị tất cả
            for (let i = 1; i <= totalPage; i++) {
                pages.push(i);
            }
        } else {
            // Luôn hiển thị trang đầu
            pages.push(1);

            if (page <= 4) {
                // Trang hiện tại ở đầu: 1 2 3 4 5 ... lastPage
                for (let i = 2; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPage);
            } else if (page >= totalPage - 3) {
                // Trang hiện tại ở cuối: 1 ... last-4 last-3 last-2 last-1 lastPage
                pages.push('...');
                for (let i = totalPage - 4; i <= totalPage; i++) {
                    pages.push(i);
                }
            } else {
                // Trang hiện tại ở giữa: 1 ... page-1 page page+1 ... lastPage
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPage);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const baseButtonClass =
        'inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg border transition-all duration-200 cursor-pointer select-none';
    const defaultButtonClass =
        'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300';
    const activeButtonClass =
        'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 hover:bg-blue-700';
    const disabledButtonClass =
        'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed hover:bg-gray-100';
    const ellipsisClass =
        'inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium text-gray-400 select-none';

    return (
        <div className="flex justify-center items-center gap-1.5 mt-6 py-4">
            {/* Nút Previous */}
            <button
                className={`${baseButtonClass} ${page === 1 ? disabledButtonClass : defaultButtonClass}`}
                disabled={page === 1}
                onClick={handlePreviousPage}
                aria-label="Trang trước"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Các số trang */}
            {pageNumbers.map((pageNumber, index) => {
                if (pageNumber === '...') {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className={ellipsisClass}
                        >
                            ...
                        </span>
                    );
                }

                const isActive = pageNumber === page;

                return (
                    <button
                        key={pageNumber}
                        className={`${baseButtonClass} ${isActive ? activeButtonClass : defaultButtonClass}`}
                        onClick={() => handlePageClick(pageNumber as number)}
                        aria-label={`Trang ${pageNumber}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            {/* Nút Next */}
            <button
                className={`${baseButtonClass} ${page === totalPage ? disabledButtonClass : defaultButtonClass}`}
                disabled={page === totalPage}
                onClick={handleNextPage}
                aria-label="Trang tiếp theo"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};