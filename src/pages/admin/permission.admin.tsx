import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { callFetchAllPermissionsWithPaginationAndFilterApi } from "../../services/api";
import { IPermission } from "../../types/backend";
import { PermissionTable } from "../../components/admin/role/permission/permission.table";

export const PermissionPage = () => {
    const size = 10;

    const [dataSource, setDataSource] = React.useState<IPermission[]>([]);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    // Manage pagination
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    // Filter
    const [search, setSearch] = React.useState<string>("");
    const [method, setMethod] = React.useState<string>("");

    // Fetching to render at dropdown
    const [dateFrom, setDateFrom] = React.useState<string>("")

    // Fetch all with pagination and filter
    const { data: permissionsQuery, isPending, error } = useQuery({
        queryKey: ['fetchingPermissions', search, method, dateFrom, page],
        queryFn: () => callFetchAllPermissionsWithPaginationAndFilterApi(search, method, dateFrom, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData
    });

    React.useEffect(() => {
        if (permissionsQuery?.data.data) {
            setDataSource(permissionsQuery.data.data.result);
            setTotalPage(permissionsQuery.data.data.meta.pages)
        }
        
    }, [permissionsQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Quyền hạn", path: "/admin/permissions" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingPermissions'] });
    };

    const getTable = () => {
        if (isPending) return (
            <>
                <div>Loading...</div>
            </>
        )
        else if (error) return (
            <>
                <div>Error + {error.message}</div>
            </>
        )
        else {
            return (
                <>
                    <PermissionTable
                        load={load}
                        dataSource={dataSource}
                        page={page}
                        totalPage={totalPage}
                        setPage={setPage}
                        search={search}
                        setSearch={setSearch}
                        method={method}
                        setMethod={setMethod}         
                        dateFrom={dateFrom}
                        setDateFrom={setDateFrom}
                    />
                </>
            )
        }
    }

    return (
        <>
            {getTable()}
        </>
    );
}

