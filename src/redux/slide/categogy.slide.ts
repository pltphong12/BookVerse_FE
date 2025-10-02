import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { callCreateCategoryApi, callDeleteCategoryApi, callUpdateCategoryApi } from '../../services/api'
import { IBackendRes, ICategory } from '../../types/backend'

export interface ICreateCategory{
    id: number
    name: string
    description: string
}

interface ICategoryState {
    isCreateCategorySuccess: boolean
    isCreateCategoryFailed: boolean
    isUpdateCategorySuccess: boolean
    isUpdateCategoryFailed: boolean
    isDeleteCategorySuccess: boolean
    isDeleteCategoryFailed: boolean
    message: string
}

const initialState: ICategoryState = {
    isCreateCategorySuccess: false,
    isCreateCategoryFailed: false,
    isUpdateCategorySuccess: false,
    isUpdateCategoryFailed: false,
    isDeleteCategorySuccess: false,
    isDeleteCategoryFailed: false,
    message: ''
}

export const createCategory = createAsyncThunk(
    'category/create',
    async (payload: ICreateCategory) => {
        try {
            const response = await callCreateCategoryApi(payload.name, payload.description)
            return response.data as IBackendRes<ICategory>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const updateCategory = createAsyncThunk(
    'category/update',
    async ( payload : { id: number; data: ICreateCategory }) => {
        try {
            const response = await callUpdateCategoryApi(payload.id, payload.data.name,payload.data.description)
            return response.data as IBackendRes<ICategory>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'category/delete',
    async (payload: number) => {
        try {
            const response = await callDeleteCategoryApi(payload)
            return response.data as IBackendRes<ICategory>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        resetCreateCategory: (state) => {
            state.isCreateCategorySuccess = false
            state.isCreateCategoryFailed = false
        },
        resetUpdateCategory: (state) => {
            state.isUpdateCategorySuccess = false
            state.isUpdateCategoryFailed = false
        },
        resetDeleteCategory: (state) => {
            state.isDeleteCategorySuccess = false
            state.isDeleteCategoryFailed = false
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Category
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isCreateCategorySuccess = true
                state.isCreateCategoryFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isCreateCategorySuccess = false
                state.isCreateCategoryFailed = true
                state.message = action.error?.message || ""
            })
            // Update Category
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isUpdateCategorySuccess = true
                state.isUpdateCategoryFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.isUpdateCategorySuccess = false
                state.isUpdateCategoryFailed = true
                state.message = action.error.message || ""
            })
            // Delete Category
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isDeleteCategorySuccess = true
                state.isDeleteCategoryFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isDeleteCategorySuccess = false
                state.isDeleteCategoryFailed = true
                state.message = action.error?.message || ""
            })
    }
})

export const { resetCreateCategory, resetUpdateCategory, resetDeleteCategory } = categorySlice.actions

export default categorySlice.reducer 