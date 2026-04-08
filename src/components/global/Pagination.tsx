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
        const pages = [];
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

    return (
        <div className="join justify-center flex">
            {/* Nút Previous */}
            <button
                className="join-item btn btn-md"
                disabled={page === 1}
                onClick={handlePreviousPage}
                aria-label="Trang trước"
            >
                «
            </button>

            {/* Các số trang */}
            {pageNumbers.map((pageNumber, index) => {
                if (pageNumber === '...') {
                    return (
                        <button
                            key={`ellipsis-${index}`}
                            className="join-item btn btn-md"
                            disabled
                        >
                            ...
                        </button>
                    );
                }

                const isActive = pageNumber === page;

                return (
                    <button
                        key={pageNumber}
                        className={`join-item btn btn-md ${isActive ? 'btn-active' : ''}`}
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
                className="join-item btn btn-md"
                disabled={page === totalPage}
                onClick={handleNextPage}
                aria-label="Trang tiếp theo"
            >
                »
            </button>
        </div>
    );
};