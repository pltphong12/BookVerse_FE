import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { showToast, ToastType } from "../../../common/showToast";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { createCategory, ICreateCategory, resetCreateCategory, resetUpdateCategory, updateCategory } from "../../../redux/slide/category.slide";
import { Modal, Input, Form, Button } from 'antd';
import { SaveOutlined, TagOutlined, FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface CategoryFormProps {
    load: () => Promise<void>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    categoryToEdit?: ICreateCategory | undefined;
}

const createCategorySchema = z.object({
    name: z.string()
        .min(2, 'Tên thể loại ít nhất 2 kí tự')
        .max(100, 'Tên thể loại tối đa 100 kí tự'),
    description: z.string()
        .min(10, 'Mô tả ít nhất 10 kí tự')
        .max(500, 'Mô tả tối đa 500 kí tự'),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ isModalOpen, setIsModalOpen, load, categoryToEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const isCreateCategorySuccess = useAppSelector((state) => state.category.isCreateCategorySuccess);
    const isCreateCategoryFailed = useAppSelector((state) => state.category.isCreateCategoryFailed);
    const isUpdateCategorySuccess = useAppSelector((state) => state.category.isUpdateCategorySuccess);
    const isUpdateCategoryFailed = useAppSelector((state) => state.category.isUpdateCategoryFailed);
    const message = useAppSelector((state) => state.category.message);

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        control,
    } = useForm<CreateCategoryFormData>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: '',
            description: '',
        }
    });

    useEffect(() => {
        if (categoryToEdit) {
            setValue('name', categoryToEdit.name);
            setValue('description', categoryToEdit.description);
        } else {
            reset({ name: '', description: '' });
        }
    }, [categoryToEdit, setValue, reset]);

    const resetForm = useCallback(() => {
        reset({ name: '', description: '' });
        setIsSubmitting(false);
    }, [reset]);

    const onSubmit = async (data: CreateCategoryFormData) => {
        setIsSubmitting(true);
        const payload = { ...data };
        if (categoryToEdit) {
            dispatch(updateCategory({
                id: categoryToEdit.id!,
                data: payload as ICreateCategory
            }));
        } else {
            dispatch(createCategory(payload as ICreateCategory));
        }
        setIsSubmitting(false);
    };

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (!categoryToEdit) {
            resetForm();
        }
    }, [categoryToEdit, setIsModalOpen, resetForm]);

    useEffect(() => {
        if (isCreateCategorySuccess || isUpdateCategorySuccess) {
            showToast(`${categoryToEdit ? 'Cập nhật' : 'Tạo'} thể loại thành công`, ToastType.SUCCESS);
            dispatch(categoryToEdit ? resetUpdateCategory() : resetCreateCategory());
            load();
            handleClose();
        }
        if (isCreateCategoryFailed || isUpdateCategoryFailed) {
            showToast(`${categoryToEdit ? 'Cập nhật' : 'Tạo'} thể loại không thành công ${message}`, ToastType.ERROR);
            dispatch(categoryToEdit ? resetUpdateCategory() : resetCreateCategory());
            setIsSubmitting(false);
        }
    }, [isCreateCategorySuccess, isCreateCategoryFailed, isUpdateCategorySuccess, isUpdateCategoryFailed, dispatch, load, message, categoryToEdit, handleClose]);

    return (
        <Modal
            title={
                <span style={{ fontSize: 18, fontWeight: 600 }}>
                    {categoryToEdit ? 'Chỉnh sửa thể loại' : 'Tạo thể loại mới'}
                </span>
            }
            open={isModalOpen}
            onCancel={handleClose}
            footer={null}
            width={520}
            destroyOnHidden
            centered
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
                    <Form.Item
                        label={<><TagOutlined /> Tên thể loại</>}
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name?.message}
                        required
                        layout="vertical"
                        style={{ marginBottom: 0 }}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Nhập tên thể loại" size="large" />
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<><FileTextOutlined /> Mô tả</>}
                        validateStatus={errors.description ? 'error' : ''}
                        help={errors.description?.message}
                        required
                        layout="vertical"
                        style={{ marginBottom: 0 }}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextArea
                                    {...field}
                                    rows={4}
                                    placeholder="Nhập mô tả thể loại"
                                    showCount
                                    maxLength={500}
                                />
                            )}
                        />
                    </Form.Item>
                </div>

                <div style={{
                    display: 'flex', justifyContent: 'flex-end', gap: 8,
                    marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0',
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
                        {categoryToEdit ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};