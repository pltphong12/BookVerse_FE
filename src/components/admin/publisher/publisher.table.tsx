import { Edit, Trash, View } from "lucide-react";
import React from "react";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deletePublisher, ICreatePublisher, resetDeletePublisher } from "../../../redux/slide/publisher.slice";
import { IPublisher } from "../../../types/backend";
import { Pagination } from "../../global/Pagination";
import { PublisherForm } from "./publisher.form";
import { PublisherSearchAndFilter } from "./publisher.search_filter";
import { PublisherView } from "./publisher.view";


interface PublisherTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: IPublisher[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const PublisherTable: React.FC<PublisherTableProps> = ({ load, page, totalPage, setPage, dataSource, search, setSearch, dateFrom, setDateFrom }) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedPublisher, setSelectedPublisher] = React.useState<IPublisher | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);

    const isDeletePublisherSuccess = useAppSelector((state) => state.publisher.isDeletePublisherSuccess);
    const isDeletePublisherFailed = useAppSelector((state) => state.publisher.isDeletePublisherFailed);

    const [publisherToEdit, setPublisherToEdit] = React.useState<ICreatePublisher | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const message = useAppSelector((state) => state.publisher.message);
    const dispatch = useAppDispatch();

    const handleViewPublisher = (publisher: IPublisher) => {
        setSelectedPublisher(publisher);
        setIsViewModalOpen(true);
    };

    const executeDeletePublisher = (id: number) => {
        dispatch(deletePublisher(id));
    }

    React.useEffect(() => {
        if (isDeletePublisherSuccess) {
            showToast("Delete Publisher successfully", ToastType.SUCCESS);
            dispatch(resetDeletePublisher());
            load()
            setPage(1)
        }
        if (isDeletePublisherFailed) {
            showToast("Delete Publisher failed " + message, ToastType.ERROR);
            dispatch(resetDeletePublisher());
        }
    }, [isDeletePublisherSuccess, isDeletePublisherFailed, message, dispatch, setPage, load]);
    return (
        <>
            <div className='flex'>
                <PublisherSearchAndFilter
                    search={search}
                    setSearch={setSearch}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý nhà xuất bản</div>
                <button
                    className="btn btn-neutral justify-end"
                    onClick={() => {
                        setIsModalOpen(true);
                        setPublisherToEdit(undefined);
                    }}
                >
                    Tạo nhà xuất bản
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
                                    <span>Tên nhà xuất bản</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Địa chỉ</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Email</span>
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
                                                <div className="font-bold">{record.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {record.address}
                                    </td>
                                    <td>
                                        {record.email}
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
                                                        onClick={() => handleViewPublisher(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => {
                                                            setPublisherToEdit(record);
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
                                                                    onClick={() => executeDeletePublisher(record.id)}
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

            <PublisherView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                publisher={selectedPublisher}
            />

            < PublisherForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                publisherToEdit={publisherToEdit}
            />
        </>
    )
}
