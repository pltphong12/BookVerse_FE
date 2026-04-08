import { X, Package, User, MapPin, Phone, Mail } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IOrder } from '../../../types/backend';
import { callFetchOrderByIdApi } from '../../../services/api';
import { showToast, ToastType } from '../../../common/showToast';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { IUpdateOrder, resetUpdateOrder, updateOrder } from '../../../redux/slide/order.slide';

interface OrderFormProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    load: () => Promise<void>;
    orderIdToEdit: number | null;
}

const ORDER_STATUSES = [
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELLED', label: 'Đã hủy' },
];

const PAYMENT_STATUSES = [
    { value: 'PENDING', label: 'Chờ thanh toán' },
    { value: 'PAID', label: 'Đã thanh toán' },
    { value: 'FAILED', label: 'Thất bại' },
    { value: 'REFUNDED', label: 'Đã hoàn tiền' },
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

const getStatusBadgeColor = (status: string) => {
    const map: Record<string, string> = {
        PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        CONFIRMED: 'text-blue-600 bg-blue-50 border-blue-200',
        SHIPPING: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        DELIVERED: 'text-green-600 bg-green-50 border-green-200',
        CANCELLED: 'text-red-600 bg-red-50 border-red-200',
    };
    return map[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const getPaymentStatusBadgeColor = (status: string) => {
    const map: Record<string, string> = {
        PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        PAID: 'text-green-600 bg-green-50 border-green-200',
        FAILED: 'text-red-600 bg-red-50 border-red-200',
        REFUNDED: 'text-purple-600 bg-purple-50 border-purple-200',
    };
    return map[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const OrderForm: React.FC<OrderFormProps> = ({ isModalOpen, setIsModalOpen, load, orderIdToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [orderDetail, setOrderDetail] = useState<IOrder | null>(null);

    const dispatch = useAppDispatch();
    const isUpdateOrderSuccess = useAppSelector((state) => state.order.isUpdateOrderSuccess);
    const isUpdateOrderFailed = useAppSelector((state) => state.order.isUpdateOrderFailed);
    const message = useAppSelector((state) => state.order.message);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateOrderFormData>({
        resolver: zodResolver(updateOrderSchema),
        defaultValues: {
            receiverName: '',
            receiverAddress: '',
            receiverPhone: '',
            receiverEmail: '',
            status: '',
            paymentStatus: '',
        }
    });

    const currentStatus = watch('status');
    const currentPaymentStatus = watch('paymentStatus');

    // Fetch order detail when modal opens
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
            receiverName: '',
            receiverAddress: '',
            receiverPhone: '',
            receiverEmail: '',
            status: '',
            paymentStatus: '',
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
            paymentStatus: data.paymentStatus
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

    if (!isModalOpen) return null;

    return (
        <dialog className={`modal ${isModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle w-full`}>
            <div className="modal-box max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Chỉnh sửa đơn hàng</h3>
                            {orderDetail && (
                                <p className="text-sm text-gray-500 font-mono">{orderDetail.orderCode}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Order Status */}
                        <div className="mb-6">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Trạng thái đơn hàng
                                </span>
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {ORDER_STATUSES.map(s => (
                                    <label
                                        key={s.value}
                                        className={`flex items-center justify-center px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm font-medium
                                            ${currentStatus === s.value
                                                ? getStatusBadgeColor(s.value) + ' border-current shadow-sm'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value={s.value}
                                            {...register('status')}
                                            className="hidden"
                                        />
                                        {s.label}
                                    </label>
                                ))}
                            </div>
                            {errors.status && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.status.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Payment Status */}
                        <div className="mb-6">
                            <label className="label">
                                <span className="label-text font-semibold flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Trạng thái thanh toán
                                </span>
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {PAYMENT_STATUSES.map(ps => (
                                    <label
                                        key={ps.value}
                                        className={`flex items-center justify-center px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm font-medium
                                            ${currentPaymentStatus === ps.value
                                                ? getPaymentStatusBadgeColor(ps.value) + ' border-current shadow-sm'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value={ps.value}
                                            {...register('paymentStatus')}
                                            className="hidden"
                                        />
                                        {ps.label}
                                    </label>
                                ))}
                            </div>
                            {errors.paymentStatus && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.paymentStatus.message}</span>
                                </label>
                            )}
                        </div>

                        <div className="divider text-sm text-gray-400">Thông tin người nhận</div>

                        {/* Receiver Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    Tên người nhận
                                </span>
                            </label>
                            <input
                                type="text"
                                {...register('receiverName')}
                                placeholder="Nhập tên người nhận"
                                className={`input input-bordered w-full ${errors.receiverName ? 'input-error' : ''}`}
                            />
                            {errors.receiverName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.receiverName.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Receiver Phone */}
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    Số điện thoại
                                </span>
                            </label>
                            <input
                                type="tel"
                                {...register('receiverPhone')}
                                placeholder="Nhập số điện thoại"
                                className={`input input-bordered w-full ${errors.receiverPhone ? 'input-error' : ''}`}
                            />
                            {errors.receiverPhone && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.receiverPhone.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Receiver Email */}
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    Email
                                </span>
                            </label>
                            <input
                                type="email"
                                {...register('receiverEmail')}
                                placeholder="Nhập email"
                                className={`input input-bordered w-full ${errors.receiverEmail ? 'input-error' : ''}`}
                            />
                            {errors.receiverEmail && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.receiverEmail.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Receiver Address */}
                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    Địa chỉ nhận hàng
                                </span>
                            </label>
                            <textarea
                                {...register('receiverAddress')}
                                placeholder="Nhập địa chỉ nhận hàng"
                                className={`textarea textarea-bordered w-full ${errors.receiverAddress ? 'textarea-error' : ''}`}
                                rows={2}
                            />
                            {errors.receiverAddress && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.receiverAddress.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="submit"
                                className="btn btn-neutral"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    'Cập nhật'
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn btn-error"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Đóng
                            </button>
                        </div>
                    </form>
                )}
            </div>
            {/* Backdrop */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    );
};
