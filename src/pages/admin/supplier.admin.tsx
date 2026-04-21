import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Spin } from "antd";
import { SupplierTable } from "../../components/admin/supplier/supplier.table";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { callFetchAllSuppliersWithPaginationAndFilterApi } from "../../services/api";
import { ISupplier } from "../../types/backend";

export const SupplierPage = () => {
    const size = 10;

    const [dataSource, setDataSource] = React.useState<ISupplier[]>([]);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    // Manage pagination
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    // Filter
    const [search, setSearch] = React.useState<string>("");
    const [dateFrom, setDateFrom] = React.useState<string>("")

    // Fetch all with pagination and filter
    const { data: suppliersQuery, isPending } = useQuery({
        queryKey: ['fetchingSuppliers', search, dateFrom, page],
        queryFn: () => callFetchAllSuppliersWithPaginationAndFilterApi(search, dateFrom, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    });

    React.useEffect(() => {
        if (suppliersQuery?.data.data) {
            setDataSource(suppliersQuery.data.data.result);
            setTotalPage(suppliersQuery.data.data.meta.pages)
        }
    }, [suppliersQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Nhà cung cấp", path: "/admin/suppliers" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingSuppliers'] });
    };

    return (
        <Spin spinning={isPending} tip="Đang tải..." size="large">
            <SupplierTable
                load={load}
                dataSource={dataSource}
                page={page}
                totalPage={totalPage}
                setPage={setPage}
                search={search}
                setSearch={setSearch}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
            />
        </Spin>
    );
}
