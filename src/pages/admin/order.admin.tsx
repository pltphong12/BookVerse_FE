import React from "react";
import { Spin } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { callFetchAllOrdersWithPaginationAndFilterApi } from "../../services/api";
import { IOrder } from "../../types/backend";
import { useAppDispatch } from "../../redux/hook";
import { clearBreadcrumbs, setBreadcrumbs } from "../../redux/slide/breadcrumbs.slice";
import { OrderTable } from "../../components/admin/order/order.table";

export const OrderPage = () => {
    const size = 10;
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const [dataSource, setDataSource] = React.useState<IOrder[]>([]);

    // Pagination state
    const [page, setPage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);

    // Filter state
    const [orderCode, setOrderCode] = React.useState<string>("");
    const [status, setStatus] = React.useState<string>("");
    const [paymentMethod, setPaymentMethod] = React.useState<string>("");
    const [paymentStatus, setPaymentStatus] = React.useState<string>("");
    const [dateFrom, setDateFrom] = React.useState<string>("");

    const { data: ordersQuery, isPending } = useQuery({
        queryKey: ['fetchingOrders', orderCode, status, paymentMethod, paymentStatus, dateFrom, page],
        queryFn: () => callFetchAllOrdersWithPaginationAndFilterApi(
            orderCode, status, paymentMethod, paymentStatus, dateFrom, page, size
        ),
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
        retry: false
    });

    React.useEffect(() => {
        if (ordersQuery?.data?.data) {
            setDataSource(ordersQuery.data.data.result);
            setTotalPage(ordersQuery.data.data.meta.pages);
        }
    }, [ordersQuery]);

    React.useEffect(() => {
        dispatch(clearBreadcrumbs());
        dispatch(setBreadcrumbs([
            { label: "Quản lý", path: "/admin" },
            { label: "Đơn hàng", path: "/admin/orders" },
            { label: "Danh sách" }
        ]));
    }, [dispatch]);

    const load = async () => {
        await queryClient.invalidateQueries({ queryKey: ['fetchingOrders'] });
    };

    return (
        <Spin spinning={isPending} tip="Đang tải..." size="large">
            <OrderTable
                load={load}
                dataSource={dataSource}
                page={page}
                totalPage={totalPage}
                setPage={setPage}
                orderCode={orderCode}
                setOrderCode={setOrderCode}
                status={status}
                setStatus={setStatus}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paymentStatus={paymentStatus}
                setPaymentStatus={setPaymentStatus}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
            />
        </Spin>
    );
};
