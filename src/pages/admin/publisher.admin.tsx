import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { PublisherTable } from "../../components/admin/publisher/publisher.table";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { callFetchAllPublishersWithPaginationAndFilterApi } from "../../services/api";
import { IPublisher } from "../../types/backend";

export const PublisherPage = () => {
    const size = 10;

    const [dataSource, setDataSource] = React.useState<IPublisher[]>([]);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    // Manage pagination
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    // Filter
    const [search, setSearch] = React.useState<string>("");

    // Fetching to render at dropdown
    const [dateFrom, setDateFrom] = React.useState<string>("")

    // Fetch all with pagination and filter
    const { data: publishersQuery, isPending } = useQuery({
        queryKey: ['fetchingPublishers', search, dateFrom, page],
        queryFn: () => callFetchAllPublishersWithPaginationAndFilterApi(search, dateFrom, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    });

    React.useEffect(() => {
        if (publishersQuery?.data.data) {
            setDataSource(publishersQuery.data.data.result);
            setTotalPage(publishersQuery.data.data.meta.pages)
        }
        
    }, [publishersQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Nhà xuất bản", path: "/admin/publishers" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingPublishers'] });
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
                    <PublisherTable
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

