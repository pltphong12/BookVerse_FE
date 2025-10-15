import { Edit, Trash, View } from "lucide-react";
import React from "react";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteSupplier, ICreateSupplier, resetDeleteSupplier } from "../../../redux/slide/supplier.slide";
import { ISupplier } from "../../../types/backend";
import { Pagination } from "../../global/Pagination";
import { SupplierSearchAndFilter } from "./supplier.search_filter";
import { SupplierView } from "./supplier.view";
import { SupplierForm } from "./supplier.form";


interface SupplierTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: ISupplier[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({ load, page, totalPage, setPage, dataSource, search, setSearch, dateFrom, setDateFrom }) => {
    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedSupplier, setSelectedSupplier] = React.useState<ISupplier | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);

    const isDeleteSupplierSuccess = useAppSelector((state) => state.supplier.isDeleteSupplierSuccess);
    const isDeleteSupplierFailed = useAppSelector((state) => state.supplier.isDeleteSupplierFailed);

    const [supplierToEdit, setSupplierToEdit] = React.useState<ICreateSupplier | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const message = useAppSelector((state) => state.supplier.message);
    const dispatch = useAppDispatch();

    const handleViewSupplier = (supplier: ISupplier) => {
        setSelectedSupplier(supplier);
        setIsViewModalOpen(true);
    };

    const executeDeleteSupplier = (id: number) => {
        dispatch(deleteSupplier(id));
    }

    React.useEffect(() => {
        if (isDeleteSupplierSuccess) {
            showToast("Xóa nhà cung cấp thành công", ToastType.SUCCESS);
            dispatch(resetDeleteSupplier());
            load()
            setPage(1)
        }
        if (isDeleteSupplierFailed) {
            showToast("Xóa nhà cung cấp không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteSupplier());
        }
    }, [isDeleteSupplierSuccess, isDeleteSupplierFailed, message, dispatch, setPage, load]);
    return (
        <>
            <div className='flex'>
                <SupplierSearchAndFilter
                    search={search}
                    setSearch={setSearch}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý nhà cung cấp</div>
                <button
                    className="btn btn-neutral justify-end"
                    onClick={() => {
                        setIsModalOpen(true);
                        setSupplierToEdit(undefined);
                    }}
                >
                    Tạo nhà cung cấp
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
                                    <span>Tên nhà cung cấp</span>
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
                                                        onClick={() => handleViewSupplier(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => {
                                                            setSupplierToEdit(record);
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
                                                                    onClick={() => executeDeleteSupplier(record.id)}
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

            <SupplierView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                supplier={selectedSupplier}
            />

            < SupplierForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                supplierToEdit={supplierToEdit}
            />
        </>
    )
}
