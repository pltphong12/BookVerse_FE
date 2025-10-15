import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { callCreateSupplierApi, callDeleteSupplierApi, callUpdateSupplierApi } from '../../services/api'
import { IBackendRes, ISupplier } from '../../types/backend'

export interface ICreateSupplier {
    id: number
    name: string
    address: string
    phone: string
    email: string
    description: string
    image: string
}

interface ISupplierState {
    isCreateSupplierSuccess: boolean
    isCreateSupplierFailed: boolean
    isUpdateSupplierSuccess: boolean
    isUpdateSupplierFailed: boolean
    isDeleteSupplierSuccess: boolean
    isDeleteSupplierFailed: boolean
    message: string
}

const initialState: ISupplierState = {
    isCreateSupplierSuccess: false,
    isCreateSupplierFailed: false,
    isUpdateSupplierSuccess: false,
    isUpdateSupplierFailed: false,
    isDeleteSupplierSuccess: false,
    isDeleteSupplierFailed: false,
    message: ''
}

export const createSupplier = createAsyncThunk(
    'supplier/create',
    async (payload: ICreateSupplier) => {
        try {
            const response = await callCreateSupplierApi(payload.name, payload.address, payload.phone, payload.email,payload.description, payload.image)
            return response.data as IBackendRes<ISupplier>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const updateSupplier = createAsyncThunk(
    'supplier/update',
    async ( payload : { id: number; data: ICreateSupplier }) => {
        try {
            const response = await callUpdateSupplierApi(payload.id, payload.data.name, payload.data.address, payload.data.phone, payload.data.email,payload.data.description, payload.data.image)
            return response.data as IBackendRes<ISupplier>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const deleteSupplier = createAsyncThunk(
    'supplier/delete',
    async (payload: number) => {
        try {
            const response = await callDeleteSupplierApi(payload)
            return response.data as IBackendRes<ISupplier>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        resetCreateSupplier: (state) => {
            state.isCreateSupplierSuccess = false
            state.isCreateSupplierFailed = false
        },
        resetUpdateSupplier: (state) => {
            state.isUpdateSupplierSuccess = false
            state.isUpdateSupplierFailed = false
        },
        resetDeleteSupplier: (state) => {
            state.isDeleteSupplierSuccess = false
            state.isDeleteSupplierFailed = false
        }
    },
    extraReducers: (builder) => {
        builder
            // Create publisher
            .addCase(createSupplier.fulfilled, (state, action) => {
                state.isCreateSupplierSuccess = true
                state.isCreateSupplierFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(createSupplier.rejected, (state, action) => {
                state.isCreateSupplierSuccess = false
                state.isCreateSupplierFailed = true
                state.message = action.error?.message || ""
            })
            // Update publisher
            .addCase(updateSupplier.fulfilled, (state, action) => {
                state.isUpdateSupplierSuccess = true
                state.isUpdateSupplierFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(updateSupplier.rejected, (state, action) => {
                state.isUpdateSupplierSuccess = false
                state.isUpdateSupplierFailed = true
                state.message = action.error.message || ""
            })
            // Delete publisher
            .addCase(deleteSupplier.fulfilled, (state, action) => {
                state.isDeleteSupplierSuccess = true
                state.isDeleteSupplierFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(deleteSupplier.rejected, (state, action) => {
                state.isDeleteSupplierSuccess = false
                state.isDeleteSupplierFailed = true
                state.message = action.error?.message || ""
            })
    }
})

export const { resetCreateSupplier, resetUpdateSupplier, resetDeleteSupplier } = supplierSlice.actions

export default supplierSlice.reducer 