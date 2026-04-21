import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Spin } from "antd";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { callFetchAllCustomersWithPaginationAndFilterApi } from "../../services/api";
import { ICustomer } from "../../types/backend";
import { CustomerTable } from "../../components/admin/customer/customer.table";

export const CustomerPage = () => {
    const size = 10;

    const [dataSource, setDataSource] = React.useState<ICustomer[]>([]);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    // Manage pagination
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    // Filter
    const [search, setSearch] = React.useState<string>("");
    // Id to attach in url to filter
    const [customerLevel, setCustomerLevel] = React.useState<string>("");
    const [dateFrom, setDateFrom] = React.useState<string>("")

    // Fetch all with pagination and filter
    const { data: customersQuery, isPending } = useQuery({
        queryKey: ['fetchingCustomers', search, customerLevel, dateFrom, page],
        queryFn: () => callFetchAllCustomersWithPaginationAndFilterApi(search, customerLevel, dateFrom, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    });

    React.useEffect(() => {
        if (customersQuery?.data.data) {
            setDataSource(customersQuery.data.data.result);
            setTotalPage(customersQuery.data.data.meta.pages)
        }
    }, [customersQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Khách hàng", path: "/admin/customers" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingCustomers'] });
    };

    return (
        <Spin spinning={isPending} tip="Đang tải..." size="large">
            <CustomerTable
                load={load}
                dataSource={dataSource}
                page={page}
                totalPage={totalPage}
                setPage={setPage}
                search={search}
                setSearch={setSearch}
                customerLevel={customerLevel}
                setCustomerLevel={setCustomerLevel}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
            />
        </Spin>
    );
}
