import { Edit, Trash, View } from "lucide-react";
import React from "react";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { deleteCustomer, resetDeleteCustomer } from "../../../redux/slide/customer.slide";
import { ICustomer } from "../../../types/backend";
import { Pagination } from "../../global/Pagination";
import { CustomerForm } from "./customer.form";
import { CustomerSearchAndFilter } from "./customer.search_filter";
import { CustomerView } from "./customer.view";

interface CustomerTableProps {
    load: () => Promise<void>;
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    dataSource: ICustomer[];
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    customerLevel: string;
    setCustomerLevel: React.Dispatch<React.SetStateAction<string>>;
    dateFrom: string;
    setDateFrom: React.Dispatch<React.SetStateAction<string>>;
}

export const CustomerTable: React.FC<CustomerTableProps> = (props) => {
    const { dataSource, load, page, totalPage, setPage, search, setSearch, customerLevel, setCustomerLevel, dateFrom, setDateFrom } = props;

    const [isViewModalOpen, setIsViewModalOpen] = React.useState<boolean>(false);
    const [selectedCustomer, setSelectedCustomer] = React.useState<ICustomer | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState<boolean>(false);

    const isDeleteCustomerSuccess = useAppSelector((state) => state.customer.isDeleteCustomerSuccess);
    const isDeleteCustomerFailed = useAppSelector((state) => state.customer.isDeleteCustomerFailed);

    const [customerToEdit, setCustomerToEdit] = React.useState<ICustomer | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

    const message = useAppSelector((state) => state.customer.message);
    const dispatch = useAppDispatch();

    const handleViewCustomer = (customer: ICustomer) => {
        setSelectedCustomer(customer);
        setIsViewModalOpen(true);
    };

    const executeDeleteCustomer = (id: number) => {
        dispatch(deleteCustomer(id));
    }

    React.useEffect(() => {
        if (isDeleteCustomerSuccess) {
            showToast("Xóa khách hàng thành công", ToastType.SUCCESS);
            dispatch(resetDeleteCustomer());
            setPage(1)
            load()
        }
        if (isDeleteCustomerFailed) {
            showToast("Xóa khách hàng không thành công " + message, ToastType.ERROR);
            dispatch(resetDeleteCustomer());
        }
    }, [isDeleteCustomerSuccess, isDeleteCustomerFailed, message, dispatch, setPage, load]);


    return (
        <>
            <div className='flex'>
                <CustomerSearchAndFilter
                    search={search}
                    setSearch={setSearch}
                    customerLevel={customerLevel}
                    setCustomerLevel={setCustomerLevel}
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}

                    setPage={setPage}
                />
            </div>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">Quản lý khách hàng</div>
                <button
                    className="btn btn-neutral justify-end"
                    onClick={() => {
                        setIsModalOpen(true);
                        setCustomerToEdit(undefined);
                    }}
                >
                    Tạo khách hàng
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
                                    <span>Tên khách hàng</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Số căn cước công dân</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Cấp bậc khách hàng</span>
                                </div>
                            </th>
                            <th className='cursor-pointer hover:bg-base-200'>
                                <div className='flex items-center gap-1'>
                                    <span>Tổng đơn hàng</span>
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
                                                <div className="font-bold">{record.user.fullName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {record.identityCard}
                                    </td>
                                    <td>
                                        {record.customerLevel}
                                    </td>
                                    <td>
                                        {record.totalOrder}
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
                                                        onClick={() => handleViewCustomer(record)}
                                                    >
                                                        <View className="w-4 h-4" />
                                                        <span>Xem</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center gap-2 text-warning"
                                                        onClick={() => {
                                                            setCustomerToEdit(record as any);
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
                                                                    onClick={() => executeDeleteCustomer(record.id)}
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

            <CustomerView
                isOpen={isViewModalOpen}
                setIsOpen={setIsViewModalOpen}
                customer={selectedCustomer}
            />

            <CustomerForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                load={load}
                customerToEdit={customerToEdit}
            />
        </>
    )
}