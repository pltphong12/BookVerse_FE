import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { callUpdateOrderApi } from '../../services/api'
import { IBackendRes, IOrder } from '../../types/backend'

export interface IUpdateOrder {
    id: number
    receiverName: string
    receiverAddress: string
    receiverPhone: string
    receiverEmail: string
    status: string
    paymentStatus: string
}

interface IOrderState {
    isUpdateOrderSuccess: boolean
    isUpdateOrderFailed: boolean
    message: string
}

const initialState: IOrderState = {
    isUpdateOrderSuccess: false,
    isUpdateOrderFailed: false,
    message: ''
}

export const updateOrder = createAsyncThunk(
    'order/update',
    async (payload: IUpdateOrder) => {
        try {
            const response = await callUpdateOrderApi(
                payload.id,
                payload.receiverName,
                payload.receiverAddress,
                payload.receiverPhone,
                payload.receiverEmail,
                payload.status,
                payload.paymentStatus
            )
            return response.data as IBackendRes<IOrder>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetUpdateOrder: (state) => {
            state.isUpdateOrderSuccess = false
            state.isUpdateOrderFailed = false
        }
    },
    extraReducers: (builder) => {
        builder
            // Update order
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.isUpdateOrderSuccess = true
                state.isUpdateOrderFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.isUpdateOrderSuccess = false
                state.isUpdateOrderFailed = true
                state.message = action.error?.message || ""
            })
    }
})

export const { resetUpdateOrder } = orderSlice.actions

export default orderSlice.reducer
