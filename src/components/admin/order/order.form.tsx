import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IOrder } from '../../../types/backend';
import { callFetchOrderByIdApi } from '../../../services/api';
import { showToast, ToastType } from '../../../common/showToast';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { IUpdateOrder, resetUpdateOrder, updateOrder } from '../../../redux/slide/order.slide';
import {
    Modal, Input, Form, Button, Select, Row, Col, Divider, Spin, Typography
} from 'antd';
import {
    SaveOutlined, ShoppingOutlined, UserOutlined,
    PhoneOutlined, MailOutlined, EnvironmentOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface OrderFormProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    load: () => Promise<void>;
    orderIdToEdit: number | null;
}

const ORDER_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Chờ xác nhận', color: 'orange' },
    { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'blue' },
    { value: 'SHIPPING', label: 'Đang giao', color: 'geekblue' },
    { value: 'DELIVERED', label: 'Đã giao', color: 'green' },
    { value: 'CANCELLED', label: 'Đã hủy', color: 'red' },
];

const PAYMENT_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Chờ thanh toán', color: 'orange' },
    { value: 'PAID', label: 'Đã thanh toán', color: 'green' },
    { value: 'FAILED', label: 'Thất bại', color: 'red' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền', color: 'purple' },
];

const updateOrderSchema = z.object({
    receiverName: z.string()
        .min(2, 'Tên người nhận ít nhất 2 kí tự')
        .max(100, 'Tên người nhận tối đa 100 kí tự'),
    receiverAddress: z.string()
        .min(2, 'Địa chỉ ít nhất 2 kí tự')
        .max(300, 'Địa chỉ tối đa 300 kí tự'),
    receiverPhone: z.string()
        .min(10, 'Số điện thoại ít nhất 10 số')
        .max(15, 'Số điện thoại tối đa 15 số'),
    receiverEmail: z.string()
        .email('Email không đúng định dạng'),
    status: z.string().min(1, 'Vui lòng chọn trạng thái'),
    paymentStatus: z.string().min(1, 'Vui lòng chọn trạng thái thanh toán'),
});

type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;

export const OrderForm: React.FC<OrderFormProps> = ({ isModalOpen, setIsModalOpen, load, orderIdToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [orderDetail, setOrderDetail] = useState<IOrder | null>(null);

    const dispatch = useAppDispatch();
    const isUpdateOrderSuccess = useAppSelector((state) => state.order.isUpdateOrderSuccess);
    const isUpdateOrderFailed = useAppSelector((state) => state.order.isUpdateOrderFailed);
    const message = useAppSelector((state) => state.order.message);

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control,
    } = useForm<UpdateOrderFormData>({
        resolver: zodResolver(updateOrderSchema),
        defaultValues: {
            receiverName: '', receiverAddress: '', receiverPhone: '',
            receiverEmail: '', status: '', paymentStatus: '',
        }
    });

    useEffect(() => {
        if (isModalOpen && orderIdToEdit) {
            setLoading(true);
            callFetchOrderByIdApi(orderIdToEdit)
                .then(res => {
                    if (res.data?.data) {
                        const order = res.data.data;
                        setOrderDetail(order);
                        setValue('receiverName', order.receiverName || '');
                        setValue('receiverAddress', order.receiverAddress || '');
                        setValue('receiverPhone', order.receiverPhone || '');
                        setValue('receiverEmail', order.receiverEmail || '');
                        setValue('status', order.status || '');
                        setValue('paymentStatus', order.paymentStatus || '');
                    }
                })
                .catch(err => {
                    console.error('Failed to fetch order:', err);
                    showToast('Không thể tải thông tin đơn hàng', ToastType.ERROR);
                })
                .finally(() => setLoading(false));
        }
    }, [isModalOpen, orderIdToEdit, setValue]);

    const resetForm = useCallback(() => {
        reset({
            receiverName: '', receiverAddress: '', receiverPhone: '',
            receiverEmail: '', status: '', paymentStatus: '',
        });
        setOrderDetail(null);
        setIsSubmitting(false);
    }, [reset]);

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        resetForm();
    }, [setIsModalOpen, resetForm]);

    const onSubmit = async (data: UpdateOrderFormData) => {
        if (!orderIdToEdit) return;
        setIsSubmitting(true);

        const payload: IUpdateOrder = {
            id: orderIdToEdit,
            receiverName: data.receiverName,
            receiverAddress: data.receiverAddress,
            receiverPhone: data.receiverPhone,
            receiverEmail: data.receiverEmail,
            status: data.status,
            paymentStatus: data.paymentStatus,
        };

        dispatch(updateOrder(payload));
        setIsSubmitting(false);
    };

    useEffect(() => {
        if (isUpdateOrderSuccess) {
            showToast('Cập nhật đơn hàng thành công', ToastType.SUCCESS);
            dispatch(resetUpdateOrder());
            load();
            handleClose();
        }
        if (isUpdateOrderFailed) {
            showToast('Cập nhật đơn hàng không thành công ' + message, ToastType.ERROR);
            dispatch(resetUpdateOrder());
            setIsSubmitting(false);
        }
    }, [isUpdateOrderSuccess, isUpdateOrderFailed, dispatch, load, message, handleClose]);

    return (
        <Modal
            title={
                <div>
                    <Title level={4} style={{ margin: 0 }}>Chỉnh sửa đơn hàng</Title>
                    {orderDetail && (
                        <Text code style={{ fontSize: 12 }}>{orderDetail.orderCode}</Text>
                    )}
                </div>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={null}
            width={640}
            destroyOnHidden
            centered
            styles={{ body: { maxHeight: '75vh', overflowY: 'auto', padding: '16px 24px' } }}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Order Status */}
                    <Form.Item
                        label={<><ShoppingOutlined /> Trạng thái đơn hàng</>}
                        validateStatus={errors.status ? 'error' : ''}
                        help={errors.status?.message}
                        required
                        layout="vertical"
                    >
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    style={{ width: '100%' }}
                                    placeholder="Chọn trạng thái"
                                    options={ORDER_STATUS_OPTIONS}
                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                />
                            )}
                        />
                    </Form.Item>

                    {/* Payment Status */}
                    <Form.Item
                        label="Trạng thái thanh toán"
                        validateStatus={errors.paymentStatus ? 'error' : ''}
                        help={errors.paymentStatus?.message}
                        required
                        layout="vertical"
                    >
                        <Controller
                            name="paymentStatus"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    style={{ width: '100%' }}
                                    placeholder="Chọn trạng thái thanh toán"
                                    options={PAYMENT_STATUS_OPTIONS}
                                    getPopupContainer={(trigger) => trigger.parentElement!}
                                />
                            )}
                        />
                    </Form.Item>

                    <Divider style={{ margin: '8px 0 16px' }}>Thông tin người nhận</Divider>

                    {/* Receiver Name */}
                    <Form.Item
                        label={<><UserOutlined /> Tên người nhận</>}
                        validateStatus={errors.receiverName ? 'error' : ''}
                        help={errors.receiverName?.message}
                        required
                        layout="vertical"
                    >
                        <Controller
                            name="receiverName"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Nhập tên người nhận" />
                            )}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={<><PhoneOutlined /> SĐT</>}
                                validateStatus={errors.receiverPhone ? 'error' : ''}
                                help={errors.receiverPhone?.message}
                                required
                                layout="vertical"
                            >
                                <Controller
                                    name="receiverPhone"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Nhập SĐT" />
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={<><MailOutlined /> Email</>}
                                validateStatus={errors.receiverEmail ? 'error' : ''}
                                help={errors.receiverEmail?.message}
                                required
                                layout="vertical"
                            >
                                <Controller
                                    name="receiverEmail"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Nhập email" type="email" />
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Address */}
                    <Form.Item
                        label={<><EnvironmentOutlined /> Địa chỉ nhận hàng</>}
                        validateStatus={errors.receiverAddress ? 'error' : ''}
                        help={errors.receiverAddress?.message}
                        required
                        layout="vertical"
                    >
                        <Controller
                            name="receiverAddress"
                            control={control}
                            render={({ field }) => (
                                <TextArea {...field} rows={2} placeholder="Nhập địa chỉ nhận hàng" />
                            )}
                        />
                    </Form.Item>

                    {/* Footer */}
                    <div style={{
                        display: 'flex', justifyContent: 'flex-end', gap: 8,
                        paddingTop: 16, borderTop: '1px solid #f0f0f0',
                    }}>
                        <Button onClick={handleClose} disabled={isSubmitting}>
                            Đóng
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={isSubmitting}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
