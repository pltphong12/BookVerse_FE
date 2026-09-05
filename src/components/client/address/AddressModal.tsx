import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MapPin, AlertCircle } from 'lucide-react';
import { ICustomerAddress } from '../../../types/backend';
import { callCreateAddressApi, callUpdateAddressApi } from '../../../services/api';
import { showToast, ToastType } from '../../../common/showToast';
import { VIETNAM_PROVINCES, getWardsByProvince } from '../../../common/vietnamAddressData';
import { AxiosError } from 'axios';

const addressSchema = z.object({
    receiverName: z
        .string()
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
        .max(100, 'Họ và tên không được quá 100 ký tự'),
    receiverPhone: z
        .string()
        .min(10, 'Số điện thoại phải có ít nhất 10 số')
        .max(15, 'Số điện thoại tối đa 15 số')
        .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không đúng định dạng (VD: 0901234567)'),
    province: z
        .string()
        .min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
    ward: z
        .string()
        .min(1, 'Vui lòng chọn hoặc nhập Phường/Xã'),
    addressLine: z
        .string()
        .min(5, 'Địa chỉ cụ thể phải có ít nhất 5 ký tự')
        .max(255, 'Địa chỉ cụ thể không được quá 255 ký tự'),
    isDefault: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (savedAddress?: ICustomerAddress) => void;
    addressToEdit?: ICustomerAddress | null;
    isFirstAddress?: boolean;
}

export const AddressModal: React.FC<AddressModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    addressToEdit,
    isFirstAddress = false,
}) => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isCustomWard, setIsCustomWard] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            receiverName: '',
            receiverPhone: '',
            province: '',
            ward: '',
            addressLine: '',
            isDefault: isFirstAddress,
        },
    });

    const watchedProvince = watch('province');
    const availableWards = useMemo(() => {
        if (!watchedProvince) return [];
        return getWardsByProvince(watchedProvince);
    }, [watchedProvince]);

    const isAddressDefault = Boolean(
        isFirstAddress ||
        addressToEdit?.isDefault ||
        (addressToEdit as any)?.default ||
        (addressToEdit as any)?.is_default
    );

    useEffect(() => {
        if (addressToEdit) {
            const isDef = Boolean(
                addressToEdit.isDefault ??
                (addressToEdit as any).default ??
                (addressToEdit as any).is_default ??
                false
            );
            reset({
                receiverName: addressToEdit.receiverName,
                receiverPhone: addressToEdit.receiverPhone,
                province: addressToEdit.province,
                ward: addressToEdit.ward,
                addressLine: addressToEdit.addressLine,
                isDefault: isDef,
            });
            const wards = getWardsByProvince(addressToEdit.province);
            setIsCustomWard(wards.length > 0 && !wards.includes(addressToEdit.ward));
        } else {
            reset({
                receiverName: '',
                receiverPhone: '',
                province: '',
                ward: '',
                addressLine: '',
                isDefault: isFirstAddress,
            });
            setIsCustomWard(false);
        }
    }, [addressToEdit, isFirstAddress, reset, isOpen]);

    const handleProvinceChange = (provinceName: string) => {
        setValue('province', provinceName, { shouldValidate: true });
        setValue('ward', '', { shouldValidate: false });
        setIsCustomWard(false);
    };

    const onSubmit = async (data: AddressFormData) => {
        setSubmitting(true);
        try {
            const isDef = isAddressDefault ? true : Boolean(data.isDefault);
            const payload: any = {
                receiverName: data.receiverName.trim(),
                receiverPhone: data.receiverPhone.trim(),
                province: data.province.trim(),
                ward: data.ward.trim(),
                addressLine: data.addressLine.trim(),
                isDefault: isDef,
                default: isDef,
            };

            let res;
            if (addressToEdit?.id) {
                payload.id = addressToEdit.id;
                res = await callUpdateAddressApi(payload);
                showToast('Cập nhật địa chỉ thành công!', ToastType.SUCCESS);
            } else {
                res = await callCreateAddressApi(payload);
                showToast('Thêm địa chỉ mới thành công!', ToastType.SUCCESS);
            }

            onSuccess(res.data.data);
            onClose();
        } catch (error) {
            if (error instanceof AxiosError) {
                const errMsg = error.response?.data?.message || error.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại';
                showToast(errMsg, ToastType.ERROR);
            } else {
                showToast('Không thể lưu địa chỉ lúc này', ToastType.ERROR);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-lg rounded-none border border-[#1A1A1A] shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DD] bg-[#FAF9F7]">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#1A1A1A]" />
                        <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                            {addressToEdit ? 'Cập nhật địa chỉ giao hàng' : 'Thêm địa chỉ giao hàng mới'}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[#7E7576] hover:text-[#1A1A1A] p-1 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Receiver Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                                Họ và tên người nhận <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    {...register('receiverName')}
                                    className={`w-full bg-[#FAF9F7] border border-[#E5E2DD] focus:border-[#1A1A1A] px-3 py-2 text-sm text-[#1A1A1A] outline-none transition-colors ${
                                        errors.receiverName ? 'border-red-500' : ''
                                    }`}
                                />
                            </div>
                            {errors.receiverName && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    {errors.receiverName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                                Số điện thoại <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="0901234567"
                                {...register('receiverPhone')}
                                className={`w-full bg-[#FAF9F7] border border-[#E5E2DD] focus:border-[#1A1A1A] px-3 py-2 text-sm text-[#1A1A1A] outline-none transition-colors ${
                                    errors.receiverPhone ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.receiverPhone && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    {errors.receiverPhone.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 2-Level Administrative Division: Tỉnh/Thành phố & Phường/Xã (NO District) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Cấp 1: Tỉnh / Thành phố */}
                        <div>
                            <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                                Tỉnh / Thành phố <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={watchedProvince || ''}
                                onChange={(e) => handleProvinceChange(e.target.value)}
                                className={`w-full bg-[#FAF9F7] border border-[#E5E2DD] focus:border-[#1A1A1A] px-3 py-2 text-sm text-[#1A1A1A] outline-none transition-colors ${
                                    errors.province ? 'border-red-500' : ''
                                }`}
                            >
                                <option value="">-- Chọn Tỉnh / Thành phố --</option>
                                {VIETNAM_PROVINCES.map((prov) => (
                                    <option key={prov.name} value={prov.name}>
                                        {prov.name}
                                    </option>
                                ))}
                            </select>
                            {errors.province && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    {errors.province.message}
                                </p>
                            )}
                        </div>

                        {/* Cấp 2: Phường / Xã */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                                    Phường / Xã <span className="text-red-600">*</span>
                                </label>
                                {availableWards.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCustomWard(!isCustomWard);
                                            setValue('ward', '');
                                        }}
                                        className="text-[11px] text-[#0070B5] hover:underline"
                                    >
                                        {isCustomWard ? 'Chọn từ danh sách' : 'Nhập tự do'}
                                    </button>
                                )}
                            </div>

                            {!isCustomWard && availableWards.length > 0 ? (
                                <select
                                    {...register('ward')}
                                    disabled={!watchedProvince}
                                    className={`w-full bg-[#FAF9F7] border border-[#E5E2DD] focus:border-[#1A1A1A] px-3 py-2 text-sm text-[#1A1A1A] outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-400 ${
                                        errors.ward ? 'border-red-500' : ''
                                    }`}
                                >
                                    <option value="">-- Chọn Phường / Xã --</option>
                                    {availableWards.map((w) => (
                                        <option key={w} value={w}>
                                            {w}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="VD: Phường Bến Nghé hoặc Xã Bình Hưng"
                                    {...register('ward')}
                                    disabled={!watchedProvince}
                                    className={`w-full bg-[#FAF9F7] border border-[#E5E2DD] focus:border-[#1A1A1A] px-3 py-2 text-sm text-[#1A1A1A] outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-400 ${
                                        errors.ward ? 'border-red-500' : ''
                                    }`}
                                />
                            )}
                            {errors.ward && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    {errors.ward.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Detailed address: số nhà, tên đường */}
                    <div>
                        <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                            Địa chỉ cụ thể (Số nhà, tên đường, tòa nhà...) <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            rows={2}
                            placeholder="VD: 12 Nguyễn Huệ hoặc Tòa nhà Bitexco, Tầng 15"
                            {...register('addressLine')}
                            className={`w-full bg-[#FAF9F7] border border-[#E5E2DD] focus:border-[#1A1A1A] px-3 py-2 text-sm text-[#1A1A1A] outline-none transition-colors resize-none ${
                                errors.addressLine ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.addressLine && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                {errors.addressLine.message}
                            </p>
                        )}
                    </div>

                    {/* Checkbox Default Address */}
                    <div className="pt-2">
                        <label
                            className={`flex items-center gap-2.5 select-none ${
                                isAddressDefault
                                    ? 'cursor-not-allowed text-slate-400 opacity-60'
                                    : 'cursor-pointer text-[#1A1A1A]'
                            }`}
                        >
                            <input
                                type="checkbox"
                                {...register('isDefault')}
                                checked={isAddressDefault ? true : undefined}
                                disabled={isAddressDefault}
                                className={`w-4 h-4 rounded-none border border-[#1A1A1A] accent-[#1A1A1A] ${
                                    isAddressDefault ? 'cursor-not-allowed bg-slate-200' : 'cursor-pointer focus:ring-0'
                                }`}
                            />
                            <span className="text-sm font-medium">
                                Đặt làm địa chỉ mặc định
                            </span>
                        </label>
                        {isAddressDefault && (
                            <p className="text-xs text-slate-500 mt-1 pl-6 italic">
                                {isFirstAddress
                                    ? 'Địa chỉ đầu tiên tự động được chọn làm mặc định.'
                                    : 'Địa chỉ này hiện đang là địa chỉ mặc định của bạn (không thể hủy chọn).'}
                            </p>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E2DD]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-5 py-2.5 border border-[#E5E2DD] hover:bg-[#FAF9F7] text-sm font-medium text-[#1A1A1A] transition-colors cursor-pointer"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#2F3130] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
                        >
                            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            <span>{addressToEdit ? 'Lưu thay đổi' : 'Thêm địa chỉ'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
