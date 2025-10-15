import { Edit, Trash, View } from "lucide-react";
import React from "react";
import { formatPrice } from "../../../common/formatPrice";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteBook, ICreateBook, resetDeleteBook } from "../../../redux/slide/book.slice";
import { IAuthorInBook, IBook, ICategoryInBook, IPublisher, ISupplier } from "../../../types/backend";
import { Pagination } from "../../global/Pagination";
import { BookForm } from "./book.form";
import { BookSearchAndFilter } from "./book.search_filter";
import { BookView } from "./book.view";

interface BookTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IBook[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    publishers: IPublisher[];
    suppliers: ISupplier[];
    authors: IAuthorInBook[];
    categories: ICategoryInBook[];
    publisherId: number;
    setPublisherId: React.Dispatch<React.SetStateAction<number>>;
    authorId: number;
    setAuthorId: React.Dispatch<React.SetStateAction<number>>;
    categoryId: number;
    setCategoryId: React.Dispatch<React.SetStateAction<number>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const BookTable: React.FC<BookTableProps> = (props) => {
    const { dataSource, load, page, totalPage, setPage, search, setSearch, publishers, suppliers,authors, categories, dateFrom, setDateFrom, publisherId, setPublisherId, authorId, setAuthorId, categoryId, setCategoryId } = props;

    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedBook, setSelectedBook] = React.useState<IBook | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);

    const isDeleteBookSuccess = useAppSelector((state) => state.book.isDeleteBookSuccess);
    const isDeleteBookFailed = useAppSelector((state) => state.book.isDeleteBookFailed);

    const [bookToEdit, setBookToEdit] = React.useState<ICreateBook | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const message = useAppSelector((state) => state.book.message);
    const dispatch = useAppDispatch();

    const handleViewBook = (book: IBook) => {
        setSelectedBook(book);
        setIsViewModalOpen(true);
    };

    const executeDeleteBook = (id: number) => {
        dispatch(deleteBook(id));
    }

    React.useEffect(() => {
        if (isDeleteBookSuccess) {
            showToast("Xóa sách thành công", ToastType.SUCCESS);
            dispatch(resetDeleteBook());
            setPage(1)
            load()
        }
        if (isDeleteBookFailed) {
            showToast("Xóa sách không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteBook());
        }
    }, [isDeleteBookSuccess, isDeleteBookFailed, message, dispatch, setPage, load]);


    return (
        <>
            <div className='flex'>
                <BookSearchAndFilter
                    search={search}
                    setSearch={setSearch}
                    authors={authors}
                    categories={categories}
                    publishers={publishers}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    publisherId={publisherId}
                    setPublisherId={setPublisherId}
                    authorId={authorId}
                    setAuthorId={setAuthorId}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý sách</div>
                <button
                    className="btn btn-neutral justify-end"
                    onClick={() => {
                        setIsModalOpen(true);
                        setBookToEdit(undefined);
                    }}
                >
                    Tạo sách
                </button>
            </div>

            <div className="rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <span>STT</span>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Tên sách</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Nhà xuất bản</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Nhà cung cấp</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Thể loại</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Giá</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Ngày tạo</span>
                                </div>
                            </th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataSource.map((record, index) => {
                            return (
                                <tr key={record.id} className='hover:bg-base-300'>
                                    <td>
                                        <div className=''>
                                            {index + (page - 1) * 10 + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-bold">{record.title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {record.publisher.name}
                                    </td>
                                    <td>
                                        {record.supplier?.name || ''}
                                    </td>
                                    <td>
                                        {record.category.name}
                                    </td>
                                    <td>
                                        {formatPrice(record.price)}
                                    </td>
                                    <td>
                                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(record.createdAt as string))}
                                    </td>
                                    <td className="w-[1%]">
                                        <div className="dropdown dropdown-left">
                                            <button tabIndex={0} className="btn btn-ghost btn-sm" onMouseDown={() => {
                                                setIsDeleteModalOpen(false)
                                            }}>
                                                ⋮
                                            </button>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content menu bg-base-100 rounded-box z-[10] w-36 p-2 shadow-lg border border-base-content/20"
                                            >
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-info"
                                                        onClick={() => handleViewBook(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => {
                                                            setBookToEdit(record as any);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        <span>Sửa</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button tabIndex={0} className="flex items-center gap-2 text-error"
                                                        onClick={() => {
                                                            setIsDeleteModalOpen(true)
                                                        }}>
                                                        <Trash className="w-4 h-4" />
                                                        <span>Xóa</span>
                                                    </button>
                                                    {isDeleteModalOpen && (
                                                        <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[10] w-52 p-2 shadow-lg border border-base-content/20">
                                                            <li className='w-full'>Bạn có chắn chắn muốn xóa</li>
                                                            <li className="mt-1">
                                                                <button
                                                                    className="btn btn-error btn-sm w-full"
                                                                    onClick={() => executeDeleteBook(record.id)}
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </li>

                                                        </ul>
                                                    )}
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>

                </table>

            </div >
            {dataSource.length === 0 && <div className=''>Không có dữ liệu</div>}
            < Pagination page={page} totalPage={totalPage} setPage={setPage} />

            <BookView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                book={selectedBook}
            />

            < BookForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                bookToEdit={bookToEdit}
                publishers={publishers}
                suppliers={suppliers}
                authors={authors}
                categories={categories}
            />
        </>
    )
}