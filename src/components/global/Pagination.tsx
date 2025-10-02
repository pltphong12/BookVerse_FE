interface PaginationProps {
    page: number;
    totalPage: number
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination = (props: PaginationProps) => {
    const { page, totalPage, setPage } = props;

    const handlePreviousPage = () => {
        setPage(page - 1);
    }

    const handleNextPage = () => {
        setPage(page + 1);
    }

    if (totalPage === 1 || totalPage === 0) return null;

    return (
        <div className="join justify-center">
            <button className='join-item btn btn-md' disabled={page === 1 ? true : false} onClick={handlePreviousPage}>«</button>
            {[...Array(totalPage)].map((_, index) => (
                <button
                    key={index + 1}
                    className={`join-item btn btn-md ${page === index + 1 ? 'btn-active' : ''}`}
                    onClick={() => setPage(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
            <button className="join-item btn btn-md" disabled={page === totalPage ? true : false} onClick={handleNextPage}>»</button>
        </div>
    )
}