import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Spin } from "antd";
import { RoleTable } from "../../components/admin/role/role.table";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { callFetchAllRolesWithPaginationAndFilterApi } from "../../services/api";
import { IRole } from "../../types/backend";

export const RolePage = () => {
    const size = 10;

    const [dataSource, setDataSource] = React.useState<IRole[]>([]);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    // Manage pagination
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    // Filter
    const [search, setSearch] = React.useState<string>("");
    const [dateFrom, setDateFrom] = React.useState<string>("");

    // Fetch all with pagination and filter
    const { data: rolesQuery, isPending } = useQuery({
        queryKey: ['fetchingRoles', search, dateFrom, page],
        queryFn: () => callFetchAllRolesWithPaginationAndFilterApi(search, dateFrom, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false,
    });

    React.useEffect(() => {
        if (rolesQuery?.data.data) {
            setDataSource(rolesQuery.data.data.result);
            setTotalPage(rolesQuery.data.data.meta.pages);
        }
    }, [rolesQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs());
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Vai Trò", path: "/admin/roles" },
            { label: "Danh sách" },
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingRoles'] });
    };

    return (
        <Spin spinning={isPending} tip="Đang tải..." size="large">
            <RoleTable
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
};