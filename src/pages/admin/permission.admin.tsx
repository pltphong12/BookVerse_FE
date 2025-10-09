import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { PermissionTable } from "../../components/admin/role/permission/permission.table";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { callFetchAllPermissionsApi, callFetchAllPermissionsWithPaginationAndFilterApi } from "../../services/api";
import { IPermission } from "../../types/backend";

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
    const [domain, setDomain] = React.useState<string>("");

    // Fetching to render at dropdown
    const [dateFrom, setDateFrom] = React.useState<string>("")

    // Fetch all permissions to get domains
    const { data: allPermissionsQuery } = useQuery({
        queryKey: ['fetchAllPermissions'],
        queryFn: callFetchAllPermissionsApi,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Extract unique domains from all permissions
    const domains = React.useMemo(() => {
        if (!allPermissionsQuery?.data?.data) return [];

        const uniqueDomains = new Set<string>();
        allPermissionsQuery.data.data.forEach((permission: IPermission) => {
            if (permission.domain) {
                uniqueDomains.add(permission.domain);
            }
        });

        return Array.from(uniqueDomains).sort();
    }, [allPermissionsQuery]);

    // Fetch all with pagination and filter
    const { data: permissionsQuery, isPending, error } = useQuery({
        queryKey: ['fetchingPermissions', search, method, domain, dateFrom, page],
        queryFn: () => callFetchAllPermissionsWithPaginationAndFilterApi(search, method, domain, dateFrom, page, size),
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
                        domain={domain}
                        setDomain={setDomain}
                        domains={domains}
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

