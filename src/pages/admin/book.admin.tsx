import React from "react";
import { BookTable } from "../../components/admin/book/book.table"
import { useAppDispatch } from "../../redux/hook";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { callFetchAllAuthorsApi, callFetchAllBooksWithPaginationApi, callFetchAllCategoriesApi, callFetchAllPublishersApi, callFetchAllSuppliersApi } from "../../services/api";
import { IAuthorInBook, IBook, ICategoryInBook, IPublisher, ISupplier } from "../../types/backend";

export const BookPage = () => {
    const size = 10;

    const [dataSource, setDataSource] = React.useState<IBook[]>([]);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    // Manage pagination
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    // Filter
    const [search, setSearch] = React.useState<string>("");
    // Fetching to render at dropdown
    const [publishers, setPublishers] = React.useState<IPublisher[]>([])
    const [suppliers, setSuppliers] = React.useState<ISupplier[]>([])
    const [authors, setAuthors] = React.useState<IAuthorInBook[]>([])
    const [categories, setCategories] = React.useState<ICategoryInBook[]>([])
    // Id to attach in url to filter
    const [publisherId, setPublisherId] = React.useState<number>(0)
    const [authorId, setAuthorId] = React.useState<number>(0)
    const [categoryId, setCategoryId] = React.useState<number>(0)
    const [dateFrom, setDateFrom] = React.useState<string>("")

    // Fetch all with pagination and filter
    const { data: booksQuery, isPending } = useQuery({
        queryKey: ['fetchingBooks', search, publisherId, authorId, categoryId, dateFrom, page],
        queryFn: () => callFetchAllBooksWithPaginationApi(search, publisherId, authorId, categoryId, dateFrom, page, size),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    });

    // Fetch all authors with pagination and filter
    const { data: authorsQuery } = useQuery({
        queryKey: ['fetchAllAuthors'],
        queryFn: callFetchAllAuthorsApi,
        refetchOnWindowFocus: false,
        retry: false
    })

    // Fetch all categories with pagination and filter
    const { data: categoriesQuery } = useQuery({
        queryKey: ['fetchAllCategories'],
        queryFn: callFetchAllCategoriesApi,
        refetchOnWindowFocus: false,
        retry: false

    })

    // Fetch all categories with pagination and filter
    const { data: publishersQuery } = useQuery({
        queryKey: ['fetchAllPublishers'],
        queryFn: callFetchAllPublishersApi,
        refetchOnWindowFocus: false,
        retry: false
    })

    // Fetch all suppliers with pagination and filter
    const { data: suppliersQuery } = useQuery({
        queryKey: ['fetchAllSuppliers'],
        queryFn: callFetchAllSuppliersApi,
        refetchOnWindowFocus: false,
        retry: false
    })

    React.useEffect(() => {
        if (booksQuery?.data.data) {
            setDataSource(booksQuery.data.data.result);
            setTotalPage(booksQuery.data.data.meta.pages)
        }
        if (authorsQuery?.data.data) {
            setAuthors(authorsQuery.data.data)
        }
        if (categoriesQuery?.data.data) {
            setCategories(categoriesQuery.data.data)
        }
        if (publishersQuery?.data.data) {
            setPublishers(publishersQuery.data.data)
        }
        if (suppliersQuery?.data.data) {
            setSuppliers(suppliersQuery.data.data)
        }
    }, [booksQuery, authorsQuery, categoriesQuery, publishersQuery, suppliersQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs())
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Sách", path: "/admin/books" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingBooks'] });
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
                    <BookTable
                        load={load}
                        dataSource={dataSource}
                        page={page}
                        totalPage={totalPage}
                        setPage={setPage}
                        search={search}
                        setSearch={setSearch}
                        publishers={publishers}
                        suppliers={suppliers}
                        authors={authors}
                        categories={categories}
                        publisherId={publisherId}
                        setPublisherId={setPublisherId}
                        authorId={authorId}
                        setAuthorId={setAuthorId}
                        categoryId={categoryId}
                        setCategoryId={setCategoryId}
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

