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
                receiverEmail: data.receiverEmail || account?.email || '',
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
                <div className="bg-white rounded-xl border border-[#E5E2DD] p-12 text-center shadow-xs flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
                    <p className="text-sm text-[#4C4546] font-medium">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-10 font-sans text-[#1A1A1A]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7E7576] mb-6">
                <Link to="/" className="hover:text-[#0070B5] transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#CFC4C5]" />
                <Link to="/cart" className="hover:text-[#0070B5] transition-colors">
                    Giỏ hàng
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#CFC4C5]" />
                <span className="text-[#1A1A1A] font-semibold">Thanh toán</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
                        Thanh toán
                    </h1>
                    <p className="text-sm text-[#4C4546] mt-1.5">
                        Vui lòng kiểm tra lại thông tin nhận hàng và phương thức thanh toán.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* ===================== LEFT COLUMN ===================== */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Section 1: Thông tin giao hàng */}
                        <section>
                            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1A1A] mb-6 border-b border-[#E5E2DD] pb-3">
                                1. Thông tin giao hàng
                            </h2>

                            <div className="space-y-5">
                                {/* Họ và tên */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5" htmlFor="receiverName">
                                        Họ và tên <span className="text-[#BA1A1A]">*</span>
                                    </label>
                                    <input
                                        id="receiverName"
                                        type="text"
                                        placeholder="VD: Nguyễn Văn A"
                                        {...register('receiverName')}
                                        className={`ledger-input block w-full appearance-none bg-transparent py-2.5 px-2 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${errors.receiverName ? 'ledger-input-error' : ''
                                            }`}
                                    />
                                    {errors.receiverName && (
                                        <p className="mt-1.5 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                            {errors.receiverName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Hidden Email Input */}
                                <input type="hidden" {...register('receiverEmail')} />

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5" htmlFor="receiverPhone">
                                        Số điện thoại <span className="text-[#BA1A1A]">*</span>
                                    </label>
                                    <input
                                        id="receiverPhone"
                                        type="tel"
                                        placeholder="VD: 0901234567"
                                        {...register('receiverPhone')}
                                        className={`ledger-input block w-full appearance-none bg-transparent py-2.5 px-2 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${errors.receiverPhone ? 'ledger-input-error' : ''
                                            }`}
                                    />
                                    {errors.receiverPhone && (
                                        <p className="mt-1.5 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                            {errors.receiverPhone.message}
                                        </p>
                                    )}
                                </div>

                                {/* Địa chỉ */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5" htmlFor="receiverAddress">
                                        Địa chỉ giao hàng <span className="text-[#BA1A1A]">*</span>
                                    </label>
                                    <input
                                        id="receiverAddress"
                                        type="text"
                                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                        {...register('receiverAddress')}
                                        className={`ledger-input block w-full appearance-none bg-transparent py-2.5 px-2 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm ${errors.receiverAddress ? 'ledger-input-error' : ''
                                            }`}
                                    />
                                    {errors.receiverAddress && (
                                        <p className="mt-1.5 text-xs text-[#BA1A1A] flex items-center gap-1 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                            {errors.receiverAddress.message}
                                        </p>
                                    )}
                                </div>

                                {/* Ghi chú */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5" htmlFor="note">
                                        Ghi chú <span className="text-xs text-[#7E7576] font-normal">(tùy chọn)</span>
                                    </label>
                                    <input
                                        id="note"
                                        type="text"
                                        placeholder="Ghi chú thêm cho đơn hàng (thời gian nhận hàng, chỉ dẫn...)"
                                        {...register('note')}
                                        className="ledger-input block w-full appearance-none bg-transparent py-2.5 px-2 text-[#1A1A1A] placeholder:text-[#7E7576] text-sm"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Phương thức giao hàng */}
                        <section>
                            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1A1A] mb-6 border-b border-[#E5E2DD] pb-3">
                                2. Phương thức giao hàng
                            </h2>

                            <label className="flex items-center justify-between p-4 border border-[#1A1A1A] bg-white rounded-lg cursor-pointer transition-colors shadow-2xs">
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
                                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'COD'
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
                                        <div className="w-8 h-8 rounded-lg bg-[#FAF9F7] border border-[#E5E2DD] text-[#1A1A1A] flex items-center justify-center shrink-0">
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
                                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'VNPAY'
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
                                        <div className="w-8 h-8 rounded-lg bg-[#FAF9F7] border border-[#E5E2DD] text-[#1A1A1A] flex items-center justify-center shrink-0">
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
                        <div className="sticky top-24 bg-white border border-[#E5E2DD] p-6 sm:p-8 shadow-xs rounded-xl">
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
                                                <div className="relative w-12 h-16 flex-shrink-0 rounded border border-[#E5E2DD] overflow-hidden bg-[#FAF9F7]">
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
                                disabled={isSubmitting || cartItems.length === 0}
                                className="w-full bg-[#1A1A1A] text-white font-semibold text-sm py-4 rounded-lg hover:bg-[#0070B5] active:bg-[#005a92] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs"
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

                            <p className="text-xs text-[#7E7576] text-center mt-4 leading-relaxed">
                                Bằng cách đặt hàng, bạn đồng ý với{' '}
                                <a href="#" className="underline hover:text-[#1A1A1A]">Điều khoản dịch vụ</a> và{' '}
                                <a href="#" className="underline hover:text-[#1A1A1A]">Chính sách bảo mật</a> của BookVerse.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
