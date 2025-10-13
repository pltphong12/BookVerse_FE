import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { AuthorTable } from "../../components/admin/author/author.table";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { callFetchAllAuthorsWithPaginationAndFilterApi } from "../../services/api";
import { IAuthor } from "../../types/backend";

export const AuthorPage = () => {
    const size = 10;

    const [dataSource, setDataSource] = React.useState<IAuthor[]>([]);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    // Manage pagination
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    // Filter
    const [searchWithName, setSearchWithName] = React.useState<string>("");
    const [searchWithNationality, setSearchWithNationality] = React.useState<string>("");
    const [dateFrom, setDateFrom] = React.useState<string>("")

    // Fetch all with pagination and filter
    const { data: authorsQuery, isPending} = useQuery({
        queryKey: ['fetchingAuthors', searchWithName, searchWithNationality, dateFrom, page],
        queryFn: () => callFetchAllAuthorsWithPaginationAndFilterApi(searchWithName, searchWithNationality, dateFrom, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    });

    

    React.useEffect(() => {
        if (authorsQuery?.data.data) {
            setDataSource(authorsQuery.data.data.result);
            setTotalPage(authorsQuery.data.data.meta.pages)
        }
        
    }, [authorsQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Tác giả", path: "/admin/authors" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingAuthors'] });
    };

    const getTable = () => {
        if (isPending) return (
            <>
                <div>Đang tải...</div>
            </>
        )
        else {
            return (
                <>
                    <AuthorTable
                        load={load}
                        dataSource={dataSource}
                        page={page}
                        totalPage={totalPage}
                        setPage={setPage}
                        searchWithName={searchWithName}
                        setSearchWithName={setSearchWithName}
                        searchWithNationality={searchWithNationality}
                        setSearchWithNationality={setSearchWithNationality}                        
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

