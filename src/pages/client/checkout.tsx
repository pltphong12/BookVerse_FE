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
    Receipt,
    CheckCircle2,
    Banknote,
    ArrowLeft,
    ScrollText,
    Loader2,
    ShieldCheck,
} from 'lucide-react';
import { ICartDetail } from '../../types/backend';
import { callFetchCartApi, callCreateOrderApi } from '../../services/api';
import { formatPrice } from '../../common/formatPrice';
import { showToast, ToastType } from '../../common/showToast';
import { RootState } from '../../redux/store';
import { resetCart } from '../../redux/slide/cart.slice';
import { useAppDispatch } from '../../redux/hook';

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
    const dispatch = useAppDispatch();
    const account = useSelector((state: RootState) => state.account.account);

    const [cartItems, setCartItems] = useState<ICartDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('COD');

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
            paymentMethod: 'COD',
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
                <div className="bg-white rounded-2xl border border-[#dff1fb] p-12 text-center shadow-sm flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-[#e3f2fd] border-t-[#1a237e] rounded-full animate-spin"></div>
                    <p className="font-body text-sm text-slate-500 font-medium">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-body text-slate-400 mb-6">
                <Link to="/" className="hover:text-[#1a237e] transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <Link to="/cart" className="hover:text-[#1a237e] transition-colors">
                    Giỏ hàng
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-700 font-semibold">Thanh toán</span>
            </div>

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="font-headline text-2xl sm:text-4xl font-bold text-[#0d1e25]">
                    Thanh toán
                </h1>
                <p className="font-body text-sm text-slate-500 mt-1">
                    Vui lòng kiểm tra lại thông tin trước khi hoàn tất đơn hàng.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ===================== LEFT COLUMN ===================== */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* 1. Shipping Info Card */}
                        <section className="bg-white border border-[#dff1fb] rounded-xl p-5 sm:p-6 shadow-sm">
                            <h2 className="font-headline font-bold text-base sm:text-lg text-[#0d1e25] mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-[#1a237e]" />
                                Thông tin giao hàng
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Receiver Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-body text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập họ và tên"
                                        {...register('receiverName')}
                                        className={`w-full px-3.5 py-2.5 bg-[#f4faff] border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors ${errors.receiverName
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-[#dff1fb] focus:border-[#1a237e]'
                                            }`}
                                    />
                                    {errors.receiverName && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.receiverName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-body text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Nhập số điện thoại"
                                        {...register('receiverPhone')}
                                        className={`w-full px-3.5 py-2.5 bg-[#f4faff] border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors ${errors.receiverPhone
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-[#dff1fb] focus:border-[#1a237e]'
                                            }`}
                                    />
                                    {errors.receiverPhone && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.receiverPhone.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <label className="font-body text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        Email <span className="text-slate-400 font-normal">(không bắt buộc)</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Nhập email để nhận hóa đơn và thông báo"
                                        {...register('receiverEmail')}
                                        className={`w-full px-3.5 py-2.5 bg-[#f4faff] border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors ${errors.receiverEmail
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-[#dff1fb] focus:border-[#1a237e]'
                                            }`}
                                    />
                                    {errors.receiverEmail && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.receiverEmail.message}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <label className="font-body text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        Địa chỉ cụ thể <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
                                        {...register('receiverAddress')}
                                        className={`w-full px-3.5 py-2.5 bg-[#f4faff] border rounded-lg text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:bg-white transition-colors ${errors.receiverAddress
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-[#dff1fb] focus:border-[#1a237e]'
                                            }`}
                                    />
                                    {errors.receiverAddress && (
                                        <p className="text-xs text-red-500 font-medium">
                                            {errors.receiverAddress.message}
                                        </p>
                                    )}
                                </div>

                                {/* Note */}
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <label className="font-body text-xs font-semibold text-slate-600 flex items-center gap-1">
                                        <ScrollText className="w-3.5 h-3.5 text-slate-400" />
                                        Ghi chú đơn hàng <span className="text-slate-400 font-normal">(không bắt buộc)</span>
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Ghi chú thêm về thời gian giao hàng, chỉ dẫn địa chỉ..."
                                        {...register('note')}
                                        className="w-full px-3.5 py-2.5 bg-[#f4faff] border border-[#dff1fb] rounded-lg text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:border-[#1a237e] focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 2. Shipping Method Card */}
                        <section className="bg-white border border-[#dff1fb] rounded-xl p-5 sm:p-6 shadow-sm">
                            <h2 className="font-headline font-bold text-base sm:text-lg text-[#0d1e25] mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-[#1a237e]" />
                                Phương thức vận chuyển
                            </h2>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-start gap-3 p-3.5 border border-[#1a237e] bg-[#e3f2fd]/40 rounded-xl cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        checked
                                        readOnly
                                        className="mt-1 w-4 h-4 text-[#1a237e] accent-[#1a237e] focus:ring-[#1a237e]"
                                    />
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            <span className="font-headline font-bold text-sm text-[#0d1e25]">
                                                Giao hàng tiêu chuẩn
                                            </span>
                                            <span className="font-headline font-bold text-sm text-emerald-600">
                                                Miễn phí
                                            </span>
                                        </div>
                                        <p className="font-body text-xs text-slate-500 mt-0.5">
                                            Dự kiến giao hàng trong 2 - 4 ngày làm việc.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </section>

                        {/* 3. Payment Method Card */}
                        <section className="bg-white border border-[#dff1fb] rounded-xl p-5 sm:p-6 shadow-sm">
                            <h2 className="font-headline font-bold text-base sm:text-lg text-[#0d1e25] mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#1a237e]" />
                                Phương thức thanh toán
                            </h2>

                            <div className="flex flex-col gap-3">
                                {/* COD */}
                                <label
                                    onClick={() => handlePaymentSelect('COD')}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${selectedPayment === 'COD'
                                            ? 'border-[#1a237e] bg-[#e3f2fd]/40 shadow-sm'
                                            : 'border-[#dff1fb] bg-white hover:bg-[#f4faff]'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={selectedPayment === 'COD'}
                                        onChange={() => handlePaymentSelect('COD')}
                                        className="mt-1 w-4 h-4 text-[#1a237e] accent-[#1a237e] focus:ring-[#1a237e]"
                                    />
                                    <div className="w-8 h-8 rounded-lg bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center shrink-0">
                                        <Banknote className="w-4 h-4" />
                                    </div>
                                    <div className="flex-grow">
                                        <span className="font-headline font-bold text-sm text-[#0d1e25] block">
                                            Thanh toán khi nhận hàng (COD)
                                        </span>
                                        <p className="font-body text-xs text-slate-500 mt-0.5">
                                            Thanh toán bằng tiền mặt khi shipper giao hàng tận nơi.
                                        </p>
                                    </div>
                                    {selectedPayment === 'COD' && (
                                        <CheckCircle2 className="w-5 h-5 text-[#1a237e] shrink-0" />
                                    )}
                                </label>

                                {/* VNPAY */}
                                <label
                                    onClick={() => handlePaymentSelect('VNPAY')}
                                    className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${selectedPayment === 'VNPAY'
                                            ? 'border-[#1a237e] bg-[#e3f2fd]/40 shadow-sm'
                                            : 'border-[#dff1fb] bg-white hover:bg-[#f4faff]'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="VNPAY"
                                        checked={selectedPayment === 'VNPAY'}
                                        onChange={() => handlePaymentSelect('VNPAY')}
                                        className="mt-1 w-4 h-4 text-[#1a237e] accent-[#1a237e] focus:ring-[#1a237e]"
                                    />
                                    <div className="w-8 h-8 rounded-lg bg-[#e3f2fd] text-[#1a237e] flex items-center justify-center shrink-0">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    <div className="flex-grow">
                                        <span className="font-headline font-bold text-sm text-[#0d1e25] block">
                                            Thanh toán online qua VNPAY
                                        </span>
                                        <p className="font-body text-xs text-slate-500 mt-0.5">
                                            Hỗ trợ thẻ ATM nội địa, Visa, MasterCard, JCB và quét mã VNPAY-QR.
                                        </p>
                                    </div>
                                    {selectedPayment === 'VNPAY' && (
                                        <CheckCircle2 className="w-5 h-5 text-[#1a237e] shrink-0" />
                                    )}
                                </label>
                            </div>

                            {errors.paymentMethod && (
                                <p className="mt-2 text-xs text-red-500 font-medium">
                                    {errors.paymentMethod.message}
                                </p>
                            )}
                        </section>

                        {/* Back link */}
                        <div>
                            <Link
                                to="/cart"
                                className="inline-flex items-center gap-1.5 text-sm font-headline font-semibold text-[#1a237e] hover:text-[#283593] transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại giỏ hàng
                            </Link>
                        </div>
                    </div>

                    {/* ===================== RIGHT COLUMN (Order Summary) ===================== */}
                    <div className="lg:col-span-5 sticky top-24">
                        <aside className="bg-white border border-[#dff1fb] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
                            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0d1e25] flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-[#1a237e]" />
                                Tóm tắt đơn hàng
                            </h2>

                            {/* Product List Compact */}
                            <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                                {cartItems.map((item) => {
                                    const discount = item.book.discount ?? 0;
                                    const discountedPrice =
                                        discount > 0
                                            ? item.book.price * (1 - discount / 100)
                                            : item.book.price;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex gap-3 items-center py-2.5 border-b border-slate-100 last:border-0"
                                        >
                                            <div className="relative w-14 h-18 flex-shrink-0 rounded-lg overflow-hidden border border-[#dff1fb] bg-[#f4faff]">
                                                {item.book.image ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/book/${item.book.image}`}
                                                        alt={item.book.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#e3f2fd]">
                                                        <span className="text-lg">📚</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <span className="font-headline font-bold text-xs sm:text-sm text-[#0d1e25] line-clamp-2">
                                                    {item.book.title}
                                                </span>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="font-body text-xs text-slate-400">
                                                        Số lượng: {item.quantity}
                                                    </span>
                                                    <span className="font-headline font-bold text-xs sm:text-sm text-[#1a237e]">
                                                        {formatPrice(discountedPrice * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-sm font-body">
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Tạm tính</span>
                                    <span className="font-semibold text-slate-800">{formatPrice(totalOriginal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Phí vận chuyển</span>
                                    <span className="font-semibold text-emerald-600">
                                        {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                                    </span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between items-center text-red-600">
                                        <span>Giảm giá</span>
                                        <span className="font-semibold">-{formatPrice(totalDiscount)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-baseline pt-4 border-t border-[#dff1fb]">
                                <span className="font-headline font-bold text-base sm:text-lg text-[#0d1e25]">
                                    Tổng cộng
                                </span>
                                <span className="font-headline font-bold text-xl sm:text-2xl text-[#1a237e]">
                                    {formatPrice(total)}
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || cartItems.length === 0}
                                className="w-full bg-[#1a237e] text-white py-3.5 rounded-xl font-headline font-bold text-sm sm:text-base hover:bg-[#283593] transition-all shadow-md shadow-indigo-950/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Đang xử lý đặt hàng...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-5 h-5" />
                                        Đặt hàng ngay
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs font-body text-slate-400">
                                Bằng việc đặt hàng, bạn đồng ý với{' '}
                                <span className="text-[#1a237e] hover:underline cursor-pointer">
                                    Điều khoản sử dụng
                                </span>{' '}
                                của BookVerse.
                            </p>
                        </aside>
                    </div>
                </div>
            </form>
        </div>
    );
}
