import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    ChevronRight,
    CreditCard,
    MapPin,
    Phone,
    Mail,
    User,
    Truck,
    ShieldCheck,
    Tag,
    ShoppingBag,
    Loader2,
    CheckCircle2,
    Banknote,
    ArrowLeft,
    ScrollText,
} from 'lucide-react';
import { ICartDetail } from '../../types/backend';
import { callFetchCartApi, callCreateOrderApi } from '../../services/api';
import { formatPrice } from '../../common/formatPrice';
import { showToast, ToastType } from '../../common/showToast';
import { RootState } from '../../redux/store';

// ------ Zod Schema ------
const checkoutSchema = z.object({
    receiverName: z
        .string()
        .min(1, 'Họ tên không được để trống')
        .max(100, 'Họ tên tối đa 100 ký tự'),
    receiverAddress: z
        .string()
        .min(1, 'Địa chỉ không được để trống')
        .max(255, 'Địa chỉ tối đa 255 ký tự'),
    receiverPhone: z
        .string()
        .min(1, 'Số điện thoại không được để trống')
        .regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
    receiverEmail: z
        .string()
        .email('Email không hợp lệ')
        .or(z.literal(''))
        .optional(),
    note: z.string().optional(),
    paymentMethod: z.enum(['COD', 'VNPAY'], {
        errorMap: () => ({ message: 'Vui lòng chọn phương thức thanh toán' }),
    }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type PaymentMethodType = 'COD' | 'VNPAY';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const account = useSelector((state: RootState) => state.account.account);

    const [cartItems, setCartItems] = useState<ICartDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            receiverName: '',
            receiverAddress: '',
            receiverPhone: '',
            receiverEmail: '',
            note: '',
            paymentMethod: undefined,
        },
    });

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
    }, []);

    // Pre-fill from account
    useEffect(() => {
        if (account) {
            if (account.fullName) setValue('receiverName', account.fullName);
            if (account.email) setValue('receiverEmail', account.email);
        }
    }, [account, setValue]);

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

    // ---- Submit ----
    const onSubmit = async (data: CheckoutFormData) => {
        if (cartItems.length === 0) return;

        setIsSubmitting(true);
        try {
            const items = cartItems.map((item) => ({
                bookId: item.book.id,
                quantity: item.quantity,
            }));

            const res = await callCreateOrderApi({
                receiverName: data.receiverName,
                receiverAddress: data.receiverAddress,
                receiverPhone: data.receiverPhone,
                receiverEmail: data.receiverEmail || '',
                paymentMethod: data.paymentMethod,
                note: data.note || '',
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
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    <p className="text-sm text-gray-400">Đang tải thông tin giỏ hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] pb-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-primary-500 transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/cart" className="hover:text-primary-500 transition-colors">
                    Giỏ hàng
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-800 font-semibold">Thanh toán</span>
            </div>

            {/* Page Title */}
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl 
                                bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-200/40"
                >
                    <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thanh toán đơn hàng</h1>
                    <p className="text-sm text-gray-400">
                        Kiểm tra thông tin và xác nhận đơn hàng của bạn
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ===================== LEFT COLUMN ===================== */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* ---- Shipping Information ---- */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Section header */}
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800 text-[15px]">
                                        Thông tin giao hàng
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        Nhập thông tin người nhận hàng
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Receiver Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                        <User className="w-4 h-4 text-gray-400" />
                                        Họ và tên người nhận
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="receiverName"
                                        type="text"
                                        placeholder="VD: Nguyễn Văn A"
                                        {...register('receiverName')}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800
                                                   bg-white placeholder-gray-300
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                                                   transition-all duration-200
                                                   ${errors.receiverName ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200'}`}
                                    />
                                    {errors.receiverName && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                                            {errors.receiverName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        Số điện thoại
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="receiverPhone"
                                        type="tel"
                                        placeholder="VD: 0912345678"
                                        {...register('receiverPhone')}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800
                                                   bg-white placeholder-gray-300
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                                                   transition-all duration-200
                                                   ${errors.receiverPhone ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200'}`}
                                    />
                                    {errors.receiverPhone && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                                            {errors.receiverPhone.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        Email
                                        <span className="text-xs text-gray-400 font-normal">(không bắt buộc)</span>
                                    </label>
                                    <input
                                        id="receiverEmail"
                                        type="email"
                                        placeholder="VD: example@email.com"
                                        {...register('receiverEmail')}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800
                                                   bg-white placeholder-gray-300
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                                                   transition-all duration-200
                                                   ${errors.receiverEmail ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200'}`}
                                    />
                                    {errors.receiverEmail && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                                            {errors.receiverEmail.message}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        Địa chỉ giao hàng
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="receiverAddress"
                                        rows={3}
                                        placeholder="VD: Số 1, Đường ABC, Quận XYZ, TP.HCM"
                                        {...register('receiverAddress')}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800
                                                   bg-white placeholder-gray-300 resize-none
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                                                   transition-all duration-200
                                                   ${errors.receiverAddress ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-200'}`}
                                    />
                                    {errors.receiverAddress && (
                                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                                            {errors.receiverAddress.message}
                                        </p>
                                    )}
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                        <ScrollText className="w-4 h-4 text-gray-400" />
                                        Ghi chú
                                        <span className="text-xs text-gray-400 font-normal">(không bắt buộc)</span>
                                    </label>
                                    <textarea
                                        id="note"
                                        rows={2}
                                        placeholder="Ghi chú thêm về đơn hàng"
                                        {...register('note')}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-800
                                                   bg-white placeholder-gray-300 resize-none
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                                                   transition-all duration-200 border-gray-200`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ---- Payment Method ---- */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800 text-[15px]">
                                        Phương thức thanh toán
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        Chọn cách bạn muốn thanh toán
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 space-y-3">
                                {/* COD */}
                                <button
                                    type="button"
                                    onClick={() => handlePaymentSelect('COD')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 
                                               transition-all duration-200 cursor-pointer text-left
                                               ${selectedPayment === 'COD'
                                            ? 'border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-100'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                                        }`}
                                >
                                    <div
                                        className={`flex items-center justify-center w-12 h-12 rounded-xl 
                                                    ${selectedPayment === 'COD'
                                                ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-200/50'
                                                : 'bg-gray-100'
                                            }`}
                                    >
                                        <Banknote
                                            className={`w-6 h-6 ${selectedPayment === 'COD' ? 'text-white' : 'text-gray-400'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p
                                            className={`font-semibold text-sm ${selectedPayment === 'COD' ? 'text-primary-700' : 'text-gray-700'
                                                }`}
                                        >
                                            Thanh toán khi nhận hàng (COD)
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Thanh toán bằng tiền mặt khi nhận hàng tại địa chỉ của bạn
                                        </p>
                                    </div>
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                                    ${selectedPayment === 'COD'
                                                ? 'border-primary-500 bg-primary-500'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        {selectedPayment === 'COD' && (
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                </button>

                                {/* VNPAY */}
                                <button
                                    type="button"
                                    onClick={() => handlePaymentSelect('VNPAY')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 
                                               transition-all duration-200 cursor-pointer text-left
                                               ${selectedPayment === 'VNPAY'
                                            ? 'border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-100'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                                        }`}
                                >
                                    <div
                                        className={`flex items-center justify-center w-12 h-12 rounded-xl 
                                                    ${selectedPayment === 'VNPAY'
                                                ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-200/50'
                                                : 'bg-gray-100'
                                            }`}
                                    >
                                        <CreditCard
                                            className={`w-6 h-6 ${selectedPayment === 'VNPAY' ? 'text-white' : 'text-gray-400'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p
                                            className={`font-semibold text-sm ${selectedPayment === 'VNPAY' ? 'text-primary-700' : 'text-gray-700'
                                                }`}
                                        >
                                            Thanh toán qua VNPAY
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Thanh toán online qua cổng VNPAY (ATM, Visa, MasterCard, QR Code)
                                        </p>
                                    </div>
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                                    ${selectedPayment === 'VNPAY'
                                                ? 'border-primary-500 bg-primary-500'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        {selectedPayment === 'VNPAY' && (
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                </button>

                                {errors.paymentMethod && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                                        {errors.paymentMethod.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Back link */}
                        <Link
                            to="/cart"
                            className="inline-flex items-center gap-2 text-sm text-primary-500 
                                       hover:text-primary-600 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại giỏ hàng
                        </Link>
                    </div>

                    {/* ===================== RIGHT COLUMN (Summary) ===================== */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                    <ShoppingBag className="w-5 h-5 text-white/90" />
                                    <h3 className="font-bold text-[15px] text-white tracking-wide">
                                        Đơn hàng của bạn
                                    </h3>
                                </div>
                            </div>

                            <div className="p-5 space-y-4">
                                {/* Order items */}
                                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                                    {cartItems.map((item) => {
                                        const discount = item.book.discount ?? 0;
                                        const discountedPrice =
                                            discount > 0
                                                ? item.book.price * (1 - discount / 100)
                                                : item.book.price;

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex gap-3 p-2.5 rounded-lg bg-gray-50/80 border border-gray-100"
                                            >
                                                {/* Thumbnail */}
                                                <div className="relative flex-shrink-0 w-14 h-[72px] rounded-md overflow-hidden bg-gray-100 border border-gray-100">
                                                    {item.book.image ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${item.book.image}`}
                                                            alt={item.book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                                                            <span className="text-lg">📚</span>
                                                        </div>
                                                    )}
                                                    {/* Quantity badge */}
                                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] 
                                                                     flex items-center justify-center px-1
                                                                     text-[10px] font-bold text-white 
                                                                     bg-primary-500 rounded-full shadow-sm">
                                                        {item.quantity}
                                                    </span>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                                                        {item.book.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-xs font-bold text-primary-600">
                                                            {formatPrice(discountedPrice)}
                                                        </span>
                                                        {discount > 0 && (
                                                            <span className="text-[10px] text-gray-400 line-through">
                                                                {formatPrice(item.book.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-dashed border-gray-200" />

                                {/* Price breakdown */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">
                                            Tạm tính ({cartItems.reduce((s, i) => s + i.quantity, 0)} sản phẩm)
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {formatPrice(totalOriginal)}
                                        </span>
                                    </div>

                                    {totalDiscount > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-1.5 text-gray-500">
                                                <Tag className="w-3.5 h-3.5 text-red-400" />
                                                Giảm giá
                                            </span>
                                            <span className="font-medium text-red-500">
                                                -{formatPrice(totalDiscount)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-gray-500">
                                            <Truck className="w-3.5 h-3.5" />
                                            Phí vận chuyển
                                        </span>
                                        {shippingFee === 0 ? (
                                            <span className="font-medium text-green-500">
                                                Miễn phí
                                            </span>
                                        ) : (
                                            <span className="font-medium text-gray-800">
                                                {formatPrice(shippingFee)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-gray-200" />

                                {/* Total */}
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold text-gray-700">
                                        Tổng cộng
                                    </span>
                                    <span className="text-xl font-bold text-primary-600">
                                        {formatPrice(total)}
                                    </span>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || cartItems.length === 0}
                                    className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 
                                               text-white font-semibold text-sm rounded-xl
                                               hover:from-primary-600 hover:to-primary-700 
                                               active:scale-[0.98]
                                               disabled:opacity-50 disabled:cursor-not-allowed
                                               shadow-lg shadow-primary-200/50
                                               transition-all duration-200 
                                               flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-5 h-5" />
                                            Xác nhận đặt hàng
                                        </>
                                    )}
                                </button>

                                {/* Trust badges */}
                                <div className="flex items-center justify-center gap-4 pt-2">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                                        Thanh toán an toàn
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Truck className="w-3.5 h-3.5 text-blue-400" />
                                        Giao hàng nhanh
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
