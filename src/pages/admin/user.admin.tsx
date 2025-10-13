import React from "react";
import { callFetchAllRole, callFetchAllUserWithPaginationApi } from "../../services/api";
import { IRole, IUser } from "../../types/backend";
import { UserTable } from "../../components/admin/user/user.table";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const UserPage = () => {
    const size = 10;

    const [dataSource, setDataSource] = React.useState<IUser[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    const [search, setSearch] = React.useState<string>("");
    const [roles, setRoles] = React.useState<IRole[]>([])
    const [roleId, setRoleId] = React.useState<number>(0)
    const [dateForm, setDateForm] = React.useState<string>("")

    // Fetch all with pagination and filter
    const { data: usersQuery, isPending } = useQuery({
        queryKey: ['fetchingUsers', search, roleId, dateForm, page],
        queryFn: () => callFetchAllUserWithPaginationApi(search, roleId, dateForm, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    });

    // Fetch all roles with pagination and filter
    const { data: rolesQuery } = useQuery({
        queryKey: ['fetchAllRoles'],
        queryFn: callFetchAllRole,
        refetchOnWindowFocus: false,
        retry: false
    })

    React.useEffect(() => {
        if (usersQuery?.data.data) {
            setDataSource(usersQuery.data.data.result);
            setTotalPage(usersQuery.data.data.meta.pages)
        }
        if (rolesQuery?.data.data) {
            setRoles(rolesQuery.data.data)
        }
    }, [usersQuery, rolesQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Người dùng", path: "/admin/users" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingUsers'] });
    };

    const getTable = () => {
        if (isPending) return (
            <>
                <div>Loading...</div>
            </>
        )
        else {
            return (
                <>
                    <UserTable
                        load={load}
                        dataSource={dataSource}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        page={page}
                        totalPage={totalPage}
                        setPage={setPage}
                        search={search}
                        setSearch={setSearch}
                        roles={roles}
                        roleId={roleId}
                        setRoleId={setRoleId}
                        dateFrom={dateForm}
                        setDateFrom={setDateForm}
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
