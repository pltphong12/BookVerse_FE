import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { CategoryTable } from "../../components/admin/category/categoty.table";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { callFetchAllCategoriesWithPaginationAndFilterApi } from "../../services/api";
import { ICategory } from "../../types/backend";

export const CategoryPage = () => {
    const size = 10;

    const [dataSource, setDataSource] = React.useState<ICategory[]>([]);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    // Manage pagination
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    // Filter
    const [searchWithName, setSearchWithName] = React.useState<string>("");
    const [dateFrom, setDateFrom] = React.useState<string>("")

    // Fetch all with pagination and filter
    const { data: categoriesQuery, isPending, error } = useQuery({
        queryKey: ['fetchingCategories', searchWithName, dateFrom, page],
        queryFn: () => callFetchAllCategoriesWithPaginationAndFilterApi(searchWithName, dateFrom, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData
    });

    

    React.useEffect(() => {
        if (categoriesQuery?.data.data) {
            setDataSource(categoriesQuery.data.data.result);
            setTotalPage(categoriesQuery.data.data.meta.pages)
        }
        
    }, [categoriesQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Thể loại", path: "/admin/categories" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingCategories'] });
    };

    const getTable = () => {
        if (isPending) return (
            <>
                <div>Đang tải...</div>
            </>
        )
        else if (error) return (
            <>
                <div>Lỗi + {error.message}</div>
            </>
        )
        else {
            return (
                <>
                    <CategoryTable
                        load={load}
                        dataSource={dataSource}
                        page={page}
                        totalPage={totalPage}
                        setPage={setPage}
                        searchWithName={searchWithName}
                        setSearchWithName={setSearchWithName}                     
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