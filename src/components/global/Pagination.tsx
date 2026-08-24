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

    const baseNumberButtonClass =
        'w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-headline font-bold text-xs sm:text-sm rounded-full transition-all duration-200 cursor-pointer select-none';
    const defaultNumberButtonClass =
        'bg-white text-slate-700 border border-[#dff1fb] hover:bg-[#e3f2fd] hover:text-[#1a237e] hover:border-blue-300 shadow-sm';
    const activeNumberButtonClass =
        'bg-[#1a237e] text-white border border-[#1a237e] shadow-md shadow-indigo-950/15';

    const baseNavButtonClass =
        'w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-200 select-none';
    const defaultNavButtonClass =
        'text-slate-600 hover:text-[#1a237e] hover:bg-[#e3f2fd] border border-[#dff1fb] bg-white shadow-sm cursor-pointer';
    const disabledNavButtonClass =
        'text-slate-300 border border-slate-200/60 bg-slate-50 cursor-not-allowed';

    const ellipsisClass =
        'w-8 h-8 flex items-center justify-center text-sm font-medium text-slate-400 select-none';

    return (
        <div className="flex justify-center items-center gap-2 mt-8 py-4">
            {/* Nút Previous */}
            <button
                className={`${baseNavButtonClass} ${page === 1 ? disabledNavButtonClass : defaultNavButtonClass}`}
                disabled={page === 1}
                onClick={handlePreviousPage}
                aria-label="Trang trước"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
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
                        className={`${baseNumberButtonClass} ${isActive ? activeNumberButtonClass : defaultNumberButtonClass}`}
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
                className={`${baseNavButtonClass} ${page === totalPage ? disabledNavButtonClass : defaultNavButtonClass}`}
                disabled={page === totalPage}
                onClick={handleNextPage}
                aria-label="Trang tiếp theo"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};