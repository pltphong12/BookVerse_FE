import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { callCreateCustomerApi, callDeleteCustomerApi, callUpdateCustomerApi } from '../../services/api'
import { IBackendRes, ICustomer } from '../../types/backend'

export interface ICreateCustomer {
    id: number
    identityCard: string
    password: string
    fullName: string
    email: string
    address: string
    phone: string
    avatar: string
    customerLevel: string
}

interface ICustomerState {
    isCreateCustomerSuccess: boolean,
    isCreateCustomerFailed: boolean,
    isDeleteCustomerSuccess: boolean,
    isDeleteCustomerFailed: boolean,
    isUpdateCustomerSuccess: boolean,
    isUpdateCustomerFailed: boolean,
    message: string,
}

const initialState: ICustomerState = {
    isCreateCustomerSuccess: false,
    isCreateCustomerFailed: false,
    isDeleteCustomerSuccess: false,
    isDeleteCustomerFailed: false,
    isUpdateCustomerSuccess: false,
    isUpdateCustomerFailed: false,
    message: "",
}

export const createCustomer = createAsyncThunk(
    'customer/create',
    async (payload: ICreateCustomer) => {
        try {
            const response = await callCreateCustomerApi(payload.identityCard, payload.password, payload.fullName, payload.email, payload.address, payload.phone, payload.avatar, payload.customerLevel)
            return response.data as IBackendRes<ICustomer>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const deleteCustomer = createAsyncThunk(
    'customer/delete',
    async (payload: number) => {
        try {
            const response = await callDeleteCustomerApi(payload)
            return response.data as IBackendRes<ICustomer>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const updateCustomer = createAsyncThunk(
    'customer/update',
    async (payload: { id: number, data: ICreateCustomer }) => {
        try {
            const response = await callUpdateCustomerApi(payload.id, payload.data.identityCard, payload.data.fullName, payload.data.email, payload.data.address, payload.data.phone, payload.data.avatar, payload.data.customerLevel)
            return response.data as IBackendRes<ICustomer>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        resetCreateCustomer: (state) => {
            state.isCreateCustomerSuccess = false
            state.isCreateCustomerFailed = false
        },
        resetDeleteCustomer: (state) => {
            state.isDeleteCustomerSuccess = false
            state.isDeleteCustomerFailed = false
        },
        resetUpdateCustomer: (state) => {
            state.isUpdateCustomerSuccess = false
            state.isUpdateCustomerFailed = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createCustomer.fulfilled, (state, action) => {
            state.isCreateCustomerSuccess = true
            state.isCreateCustomerFailed = false
            state.message = action.payload?.message || ""
        })

        builder.addCase(createCustomer.rejected, (state, action) => {
            state.isCreateCustomerSuccess = false
            state.isCreateCustomerFailed = true
            state.message = action.error.message || ""
        })

        builder.addCase(deleteCustomer.fulfilled, (state, action) => {
            state.isDeleteCustomerSuccess = true
            state.isDeleteCustomerFailed = false
            state.message = action.payload?.message || ""
        })

        builder.addCase(deleteCustomer.rejected, (state, action) => {
            state.isDeleteCustomerSuccess = false
            state.isDeleteCustomerFailed = true
            state.message = action.error.message || ""
        })

        builder.addCase(updateCustomer.fulfilled, (state, action) => {
            state.isUpdateCustomerSuccess = true
            state.isUpdateCustomerFailed = false
            state.message = action.payload?.message || ""
        })

        builder.addCase(updateCustomer.rejected, (state, action) => {
            state.isUpdateCustomerSuccess = false
            state.isUpdateCustomerFailed = true
            state.message = action.error.message || ""
        })
    }
})

export const { resetCreateCustomer, resetDeleteCustomer, resetUpdateCustomer } = customerSlice.actions

export default customerSlice.reducer
