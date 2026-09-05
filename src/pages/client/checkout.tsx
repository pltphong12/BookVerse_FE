import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    ChevronRight,
    CreditCard,
    Banknote,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Plus,
    MapPin,
    Trash2,
    Edit3,
} from 'lucide-react';
import { ICartDetail, ICustomerAddress } from '../../types/backend';
import {
    callFetchCartApi,
    callCreateOrderApi,
    callFetchMyAddressesApi,
    callDeleteAddressApi,
    callUpdateAddressApi,
} from '../../services/api';
import { AxiosError } from 'axios';
import { formatPrice } from '../../common/formatPrice';
import { showToast, ToastType } from '../../common/showToast';
import { RootState } from '../../redux/store';
import { resetCart } from '../../redux/slide/cart.slice';
import { useAppDispatch } from '../../redux/hook';
import { AddressModal } from '../../components/client/address/AddressModal';
import { Popconfirm } from 'antd';

// ------ Zod Schema ------
const checkoutSchema = z.object({
    shippingAddressId: z
        .number({ required_error: 'Vui lòng chọn địa chỉ giao hàng' })
        .min(1, 'Vui lòng chọn địa chỉ giao hàng'),
    note: z.string().optional(),
    paymentMethod: z.enum(['COD', 'VNPAY'], {
        errorMap: () => ({ message: 'Vui lòng chọn phương thức thanh toán' }),
    }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;
type PaymentMethodType = 'COD' | 'VNPAY';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const account = useSelector((state: RootState) => state.account.account);

    const [cartItems, setCartItems] = useState<ICartDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('COD');

    // Addresses state
    const [addresses, setAddresses] = useState<ICustomerAddress[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [addressToEdit, setAddressToEdit] = useState<ICustomerAddress | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            shippingAddressId: 0,
            note: '',
            paymentMethod: 'COD',
        },
    });

    const selectedAddressId = watch('shippingAddressId');

    // Fetch customer addresses
    const fetchAddresses = async (preferredId?: number) => {
        setIsLoadingAddresses(true);
        try {
            const res = await callFetchMyAddressesApi();
            const rawList: any[] = res.data?.data || [];
            const list: ICustomerAddress[] = rawList.map((item: any) => ({
                ...item,
                isDefault: Boolean(item.isDefault ?? item.default ?? item.is_default ?? false),
            }));
            setAddresses(list);

            if (list.length > 0) {
                if (preferredId && list.some((a) => a.id === preferredId)) {
                    setValue('shippingAddressId', preferredId, { shouldValidate: true });
                } else {
                    const defaultAddr = list.find((a) => a.isDefault) || list[0];
                    setValue('shippingAddressId', defaultAddr.id, { shouldValidate: true });
                }
            } else {
                setValue('shippingAddressId', 0);
            }
        } catch (error) {
            console.error(error);
            showToast('Không thể tải danh sách địa chỉ giao hàng', ToastType.ERROR);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    // Fetch cart on mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await callFetchCartApi();
                if (res.status === 200) {
                    const cart = res.data.data;
                    setCartItems(cart?.cartDetails || []);
                }
            } catch (error) {
                console.error(error);
                showToast('Không thể tải giỏ hàng', ToastType.ERROR);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
        fetchAddresses();
    }, []);

    // Redirect if cart empty after fetching
    useEffect(() => {
        if (!isLoading && cartItems.length === 0) {
            navigate('/cart');
        }
    }, [isLoading, cartItems, navigate]);

    // ---- Price calculations ----
    const totalOriginal = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    const totalDiscount = cartItems.reduce((sum, item) => {
        const discount = item.book.discount ?? 0;
        return sum + item.book.price * (discount / 100) * item.quantity;
    }, 0);
    const subtotal = totalOriginal - totalDiscount;
    const shippingFee = 0;
    const total = subtotal + shippingFee;

    // ---- Handle payment method selection ----
    const handlePaymentSelect = (method: PaymentMethodType) => {
        setSelectedPayment(method);
        setValue('paymentMethod', method, { shouldValidate: true });
    };

    const handleOpenAddAddress = () => {
        setAddressToEdit(null);
        setModalOpen(true);
    };

    const handleOpenEditAddress = (addr: ICustomerAddress, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setAddressToEdit(addr);
        setModalOpen(true);
    };

    const handleAddressModalSuccess = (savedAddress?: ICustomerAddress) => {
        fetchAddresses(savedAddress?.id);
    };

    const handleConfirmDelete = async (addressId: number) => {
        try {
            await callDeleteAddressApi(addressId);
            showToast('Đã xóa địa chỉ thành công!', ToastType.SUCCESS);
            fetchAddresses();
        } catch (error) {
            if (error instanceof AxiosError) {
                const errMsg = error.response?.data?.message || error.response?.data?.error;
                showToast(
                    errMsg || 'Không thể xóa địa chỉ. Vui lòng thử lại.',
                    ToastType.ERROR
                );
            } else {
                showToast('Không thể xóa địa chỉ lúc này', ToastType.ERROR);
            }
        }
    };

    const handleSetDefaultAddress = async (addr: ICustomerAddress, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (addr.isDefault) return;

        try {
            const payload: any = {
                id: addr.id,
                receiverName: addr.receiverName,
                receiverPhone: addr.receiverPhone,
                province: addr.province,
                ward: addr.ward,
                addressLine: addr.addressLine,
                isDefault: true,
                default: true,
            };
            await callUpdateAddressApi(payload);
            showToast('Đã đặt làm địa chỉ mặc định!', ToastType.SUCCESS);
            fetchAddresses(addr.id);
        } catch (error) {
            if (error instanceof AxiosError) {
                showToast(error.response?.data?.message || 'Không thể đặt làm mặc định', ToastType.ERROR);
            } else {
                showToast('Có lỗi xảy ra', ToastType.ERROR);
            }
        }
    };

    // ---- Submit ----
    const onSubmit = async (data: CheckoutFormData) => {
        if (cartItems.length === 0) return;

        if (!data.shippingAddressId || data.shippingAddressId <= 0) {
            showToast('Vui lòng chọn hoặc thêm một địa chỉ giao hàng để tiếp tục!', ToastType.WARN);
            return;
        }

        const chosenAddress = addresses.find((a) => a.id === data.shippingAddressId);

        setIsSubmitting(true);
        try {
            const items = cartItems.map((item) => ({
                bookId: item.book.id,
                quantity: item.quantity,
            }));

            const res = await callCreateOrderApi({
                shippingAddressId: data.shippingAddressId,
                paymentMethod: data.paymentMethod,
                note: data.note || '',
                receiverName: chosenAddress?.receiverName,
                receiverPhone: chosenAddress?.receiverPhone,
                receiverAddress: chosenAddress?.fullAddress,
                receiverEmail: account?.email || '',
                items,
            });

            if (res.status === 201 || res.status === 200) {
                const order = res.data.data;

                // If VNPAY → redirect to payment URL returned by server
                if (data.paymentMethod === 'VNPAY' && order?.paymentUrl) {
                    window.location.href = order.paymentUrl;
                    return;
                }

                showToast('Đặt hàng thành công!', ToastType.SUCCESS);
                dispatch(resetCart());
                navigate(`/payment/success?orderCode=${order?.orderCode}&method=${data.paymentMethod}`);
            }
        } catch (error: any) {
            const msg =
                error?.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.';
            showToast(msg, ToastType.ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ---- Loading skeleton ----
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-white rounded-xl border border-[#E5E2DD] p-12 text-center shadow-xs flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
                    <p className="text-sm text-[#4C4546] font-medium">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 font-sans text-[#1A1A1A]">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-body text-slate-500">
                    <li>
                        <Link to="/" className="text-slate-500 hover:text-[#0070B5] transition-colors">
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </li>
                    <li>
                        <Link to="/cart" className="text-slate-500 hover:text-[#0070B5] transition-colors">
                            Giỏ hàng
                        </Link>
                    </li>
                    <li>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </li>
                    <li aria-current="page" className="text-[#1A1A1A] font-semibold">
                        Thanh toán
                    </li>
                </ol>
            </nav>

            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
                        Thanh toán
                    </h1>
                    <p className="text-sm text-[#4C4546] mt-1.5">
                        Vui lòng chọn địa chỉ giao hàng và phương thức thanh toán.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* ===================== LEFT COLUMN ===================== */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Section 1: Thông tin giao hàng (Shopee Style) */}
                        <section>
                            <div className="flex items-center justify-between mb-6 border-b border-[#E5E2DD] pb-3">
                                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
                                    1. Thông tin giao hàng
                                </h2>
                            </div>

                            {isLoadingAddresses ? (
                                <div className="p-8 text-center bg-white border border-[#E5E2DD] flex items-center justify-center gap-2 text-sm text-slate-500">
                                    <Loader2 className="w-4 h-4 animate-spin text-[#1A1A1A]" />
                                    <span>Đang tải sổ địa chỉ...</span>
                                </div>
                            ) : addresses.length === 0 ? (
                                /* Empty Address Book State */
                                <div className="bg-[#FAF9F7] border-2 border-dashed border-[#E5E2DD] p-8 text-center">
                                    <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                    <h4 className="font-serif font-bold text-base text-[#1A1A1A] mb-1">
                                        Bạn chưa có địa chỉ nhận hàng nào
                                    </h4>
                                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
                                        Hệ thống yêu cầu chọn 1 địa chỉ giao hàng để đặt sách. Vui lòng thêm địa chỉ nhận hàng ngay bên dưới.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleOpenAddAddress}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#2F3130] text-white text-sm font-semibold transition-colors cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Thêm địa chỉ nhận hàng</span>
                                    </button>
                                </div>
                            ) : (
                                /* Shopee Style Address List matching Stitch Screen */
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        {addresses.map((addr) => {
                                            const isSelected = selectedAddressId === addr.id;
                                            const isDefault = Boolean(addr.isDefault);

                                            let cardStyles = '';
                                            if (isDefault) {
                                                // Darker tone for default address
                                                cardStyles = isSelected
                                                    ? 'border-2 border-[#1A1A1A] bg-[#ECE6DC] shadow-sm'
                                                    : 'border border-[#333333] bg-[#F2EDE4] hover:bg-[#EBE5DB]';
                                            } else {
                                                cardStyles = isSelected
                                                    ? 'border-2 border-[#1A1A1A] bg-[#FAF9F7] shadow-xs'
                                                    : 'border border-[#E5E2DD] bg-white hover:bg-[#FAF9F7]';
                                            }

                                            return (
                                                <label
                                                    key={addr.id}
                                                    onClick={() => setValue('shippingAddressId', addr.id, { shouldValidate: true })}
                                                    className={`flex items-start p-4 cursor-pointer transition-all relative ${cardStyles}`}
                                                >
                                                    {/* Radio Ledger */}
                                                    <input
                                                        type="radio"
                                                        name="delivery_address"
                                                        value={addr.id}
                                                        checked={isSelected}
                                                        onChange={() => setValue('shippingAddressId', addr.id, { shouldValidate: true })}
                                                        className="mt-1 h-4 w-4 border border-[#1A1A1A] text-[#1A1A1A] accent-[#1A1A1A] focus:ring-0 cursor-pointer"
                                                    />

                                                    <div className="ml-4 flex-1 pr-8">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                                            <span className="font-semibold text-sm text-[#1A1A1A]">
                                                                {addr.receiverName}
                                                            </span>
                                                            <span className="text-slate-300 font-light text-xs">|</span>
                                                            <span className="text-sm text-[#4C4546]">
                                                                {addr.receiverPhone}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm text-[#4C4546] leading-relaxed">
                                                            {addr.fullAddress || `${addr.addressLine}, ${addr.ward}, ${addr.province}`}
                                                        </p>

                                                        {isDefault && (
                                                            <div className="mt-2.5">
                                                                <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-white bg-[#1A1A1A] uppercase tracking-wider">
                                                                    Mặc định
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions right */}
                                                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleOpenEditAddress(addr, e)}
                                                                className="text-xs font-semibold text-[#0070B5] hover:underline transition-colors cursor-pointer flex items-center gap-0.5"
                                                            >
                                                                <Edit3 className="w-3 h-3" />
                                                                <span>Sửa</span>
                                                            </button>

                                                            {!isDefault && (
                                                                <Popconfirm
                                                                    title="Xóa địa chỉ"
                                                                    description="Bạn có chắc chắn muốn xóa địa chỉ này?"
                                                                    onConfirm={() => handleConfirmDelete(addr.id)}
                                                                    okText="Xóa"
                                                                    cancelText="Hủy"
                                                                    okButtonProps={{ danger: true }}
                                                                    placement="topRight"
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="text-xs font-semibold text-red-600 hover:underline transition-colors cursor-pointer flex items-center gap-0.5"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                        <span>Xóa</span>
                                                                    </button>
                                                                </Popconfirm>
                                                            )}
                                                        </div>

                                                        {!isDefault && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleSetDefaultAddress(addr, e)}
                                                                className="text-[11px] text-slate-500 hover:text-[#1A1A1A] hover:underline transition-colors cursor-pointer"
                                                            >
                                                                Đặt làm mặc định
                                                            </button>
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {/* Add Address Button (Dashed Border Stitch Style) */}
                                    <button
                                        type="button"
                                        onClick={handleOpenAddAddress}
                                        className="w-full py-3.5 border border-dashed border-[#1A1A1A] hover:bg-[#FAF9F7] text-[#1A1A1A] font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Thêm Địa Chỉ Mới</span>
                                    </button>

                                    {/* Order Notes */}
                                    <div className="pt-3">
                                        <label className="block text-xs font-semibold text-[#4C4546] uppercase tracking-wider mb-1.5" htmlFor="notes">
                                            Ghi chú đơn hàng (tùy chọn)
                                        </label>
                                        <input
                                            id="notes"
                                            type="text"
                                            placeholder="Ghi chú thêm cho đơn hàng (VD: Giao giờ hành chính...)"
                                            {...register('note')}
                                            className="ledger-input block w-full appearance-none bg-transparent py-2.5 px-2 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {errors.shippingAddressId && (
                                <p className="mt-2 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    {errors.shippingAddressId.message}
                                </p>
                            )}
                        </section>

                        {/* Section 2: Phương thức giao hàng */}
                        <section>
                            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1A1A] mb-6 border-b border-[#E5E2DD] pb-3">
                                2. Phương thức giao hàng
                            </h2>

                            <label className="flex items-center justify-between p-4 border border-[#1A1A1A] bg-white cursor-pointer transition-colors shadow-2xs">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        checked
                                        readOnly
                                        className="h-4 w-4 rounded-full border border-[#1A1A1A] text-[#1A1A1A] accent-[#1A1A1A] focus:ring-0 cursor-pointer"
                                    />
                                    <div>
                                        <span className="block text-sm font-semibold text-[#1A1A1A]">
                                            Giao hàng tiêu chuẩn
                                        </span>
                                        <span className="block text-xs text-[#7E7576] mt-0.5">
                                            Dự kiến giao hàng trong 2 - 4 ngày làm việc
                                        </span>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-emerald-700">Miễn phí</span>
                            </label>
                        </section>

                        {/* Section 3: Phương thức thanh toán */}
                        <section>
                            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1A1A] mb-6 border-b border-[#E5E2DD] pb-3">
                                3. Phương thức thanh toán
                            </h2>

                            <div className="space-y-3">
                                {/* COD Option */}
                                <label
                                    onClick={() => handlePaymentSelect('COD')}
                                    className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${selectedPayment === 'COD'
                                            ? 'border-[#1A1A1A] bg-white shadow-2xs'
                                            : 'border-[#E5E2DD] bg-white hover:bg-[#FAF9F7]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={selectedPayment === 'COD'}
                                            onChange={() => handlePaymentSelect('COD')}
                                            className="h-4 w-4 rounded-full border border-[#1A1A1A] text-[#1A1A1A] accent-[#1A1A1A] focus:ring-0 cursor-pointer"
                                        />
                                        <div className="w-8 h-8 rounded bg-[#FAF9F7] border border-[#E5E2DD] text-[#1A1A1A] flex items-center justify-center shrink-0">
                                            <Banknote className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-sm font-semibold text-[#1A1A1A]">
                                                Thanh toán khi nhận hàng (COD)
                                            </span>
                                            <span className="block text-xs text-[#7E7576] mt-0.5">
                                                Thanh toán bằng tiền mặt khi shipper giao hàng tận nơi
                                            </span>
                                        </div>
                                    </div>
                                </label>

                                {/* VNPay Option */}
                                <label
                                    onClick={() => handlePaymentSelect('VNPAY')}
                                    className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${selectedPayment === 'VNPAY'
                                            ? 'border-[#1A1A1A] bg-white shadow-2xs'
                                            : 'border-[#E5E2DD] bg-white hover:bg-[#FAF9F7]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="VNPAY"
                                            checked={selectedPayment === 'VNPAY'}
                                            onChange={() => handlePaymentSelect('VNPAY')}
                                            className="h-4 w-4 rounded-full border border-[#1A1A1A] text-[#1A1A1A] accent-[#1A1A1A] focus:ring-0 cursor-pointer"
                                        />
                                        <div className="w-8 h-8 rounded bg-[#FAF9F7] border border-[#E5E2DD] text-[#1A1A1A] flex items-center justify-center shrink-0">
                                            <CreditCard className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="block text-sm font-semibold text-[#1A1A1A]">
                                                Thanh toán trực tuyến VNPay
                                            </span>
                                            <span className="block text-xs text-[#7E7576] mt-0.5">
                                                Hỗ trợ thẻ ATM nội địa, Visa, MasterCard, JCB và quét mã QR
                                            </span>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {errors.paymentMethod && (
                                <p className="mt-2 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                    {errors.paymentMethod.message}
                                </p>
                            )}
                        </section>

                        {/* Back to Cart link */}
                        <div className="pt-2">
                            <Link
                                to="/cart"
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] hover:text-[#0070B5] hover:underline underline-offset-4 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại giỏ hàng
                            </Link>
                        </div>
                    </div>

                    {/* ===================== RIGHT COLUMN (Order Summary) ===================== */}
                    <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                        <div className="sticky top-24 bg-white border border-[#E5E2DD] p-6 sm:p-8 shadow-xs">
                            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-6 border-b border-[#E5E2DD] pb-4">
                                Tóm tắt đơn hàng
                            </h3>

                            {/* Cart Items List */}
                            <div className="space-y-4 mb-6 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 border-b border-[#E5E2DD] pb-6">
                                {cartItems.map((item) => {
                                    const discount = item.book.discount ?? 0;
                                    const discountedPrice =
                                        discount > 0
                                            ? item.book.price * (1 - discount / 100)
                                            : item.book.price;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="relative w-12 h-16 flex-shrink-0 border border-[#E5E2DD] overflow-hidden bg-[#FAF9F7]">
                                                    {item.book.image ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_BACKENDURL || import.meta.env.VITE_BACKEND_URL}/storage/book/${item.book.image}`}
                                                            alt={item.book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-sm bg-[#FAF9F7]">
                                                            📚
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-medium text-[#1A1A1A] line-clamp-1">
                                                        {item.book.title}
                                                    </h4>
                                                    <p className="text-xs text-[#7E7576]">Số lượng: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-[#1A1A1A] shrink-0">
                                                {formatPrice(discountedPrice * item.quantity)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-[#4C4546]">
                                    <span>Tạm tính</span>
                                    <span className="font-medium text-[#1A1A1A]">{formatPrice(totalOriginal)}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-[#4C4546]">
                                        <span>Giảm giá</span>
                                        <span className="font-semibold text-[#BA1A1A]">-{formatPrice(totalDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-[#4C4546]">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-semibold text-emerald-700">Miễn phí</span>
                                </div>
                            </div>

                            {/* Total Row */}
                            <div className="flex justify-between items-center border-t border-[#E5E2DD] pt-4 mb-6">
                                <span className="font-serif font-bold text-lg text-[#1A1A1A]">Tổng cộng</span>
                                <span className="font-serif font-bold text-2xl text-[#1A1A1A]">{formatPrice(total)}</span>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || cartItems.length === 0 || addresses.length === 0}
                                className="w-full bg-[#1A1A1A] text-white font-semibold text-sm py-4 hover:bg-[#2F3130] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Đang xử lý đặt hàng...
                                    </span>
                                ) : (
                                    'Đặt hàng'
                                )}
                            </button>

                            {addresses.length === 0 && (
                                <p className="text-xs text-[#BA1A1A] text-center mt-2 font-medium">
                                    * Vui lòng thêm địa chỉ nhận hàng để có thể bấm Đặt hàng.
                                </p>
                            )}

                            <p className="text-xs text-[#7E7576] text-center mt-4 leading-relaxed">
                                Bằng cách đặt hàng, bạn đồng ý với{' '}
                                <a href="#" className="underline hover:text-[#1A1A1A]">Điều khoản dịch vụ</a> và{' '}
                                <a href="#" className="underline hover:text-[#1A1A1A]">Chính sách bảo mật</a> của BookVerse.
                            </p>
                        </div>
                    </div>
                </div>
            </form>

            {/* Reusable Modal for Add / Edit in Checkout */}
            <AddressModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setAddressToEdit(null);
                }}
                onSuccess={handleAddressModalSuccess}
                addressToEdit={addressToEdit}
                isFirstAddress={addresses.length === 0}
            />
        </div>
    );
}
