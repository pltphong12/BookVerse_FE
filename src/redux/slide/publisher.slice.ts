import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { callCreatePublisherApi, callDeletePublisherApi, callUpdatePublisherApi } from '../../services/api'
import { IBackendRes, IPublisher } from '../../types/backend'

export interface ICreatePublisher {
    id: number
    name: string
    address: string
    phone: string
    email: string
    description: string
    image: string
}

interface IPublisherState {
    isCreatePublisherSuccess: boolean
    isCreatePublisherFailed: boolean
    isUpdatePublisherSuccess: boolean
    isUpdatePublisherFailed: boolean
    isDeletePublisherSuccess: boolean
    isDeletePublisherFailed: boolean
    message: string
}

const initialState: IPublisherState = {
    isCreatePublisherSuccess: false,
    isCreatePublisherFailed: false,
    isUpdatePublisherSuccess: false,
    isUpdatePublisherFailed: false,
    isDeletePublisherSuccess: false,
    isDeletePublisherFailed: false,
    message: ''
}

export const createPublisher = createAsyncThunk(
    'publisher/create',
    async (payload: ICreatePublisher) => {
        try {
            const response = await callCreatePublisherApi(payload.name, payload.address, payload.phone, payload.email,payload.description, payload.image)
            return response.data as IBackendRes<IPublisher>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const updatePublisher = createAsyncThunk(
    'publisher/update',
    async ( payload : { id: number; data: ICreatePublisher }) => {
        try {
            const response = await callUpdatePublisherApi(payload.id, payload.data.name, payload.data.address, payload.data.phone, payload.data.email,payload.data.description, payload.data.image)
            return response.data as IBackendRes<IPublisher>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const deletePublisher = createAsyncThunk(
    'publisher/delete',
    async (payload: number) => {
        try {
            const response = await callDeletePublisherApi(payload)
            return response.data as IBackendRes<IPublisher>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const publisherSlice = createSlice({
    name: 'publisher',
    initialState,
    reducers: {
        resetCreatePublisher: (state) => {
            state.isCreatePublisherSuccess = false
            state.isCreatePublisherFailed = false
        },
        resetUpdatePublisher: (state) => {
            state.isUpdatePublisherSuccess = false
            state.isUpdatePublisherFailed = false
        },
        resetDeletePublisher: (state) => {
            state.isDeletePublisherSuccess = false
            state.isDeletePublisherFailed = false
        }
    },
    extraReducers: (builder) => {
        builder
            // Create publisher
            .addCase(createPublisher.fulfilled, (state, action) => {
                state.isCreatePublisherSuccess = true
                state.isCreatePublisherFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(createPublisher.rejected, (state, action) => {
                state.isCreatePublisherSuccess = false
                state.isCreatePublisherFailed = true
                state.message = action.error?.message || ""
            })
            // Update publisher
            .addCase(updatePublisher.fulfilled, (state, action) => {
                state.isUpdatePublisherSuccess = true
                state.isUpdatePublisherFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(updatePublisher.rejected, (state, action) => {
                state.isUpdatePublisherSuccess = false
                state.isUpdatePublisherFailed = true
                state.message = action.error.message || ""
            })
            // Delete publisher
            .addCase(deletePublisher.fulfilled, (state, action) => {
                state.isDeletePublisherSuccess = true
                state.isDeletePublisherFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(deletePublisher.rejected, (state, action) => {
                state.isDeletePublisherSuccess = false
                state.isDeletePublisherFailed = true
                state.message = action.error?.message || ""
            })
    }
})

export const { resetCreatePublisher, resetUpdatePublisher, resetDeletePublisher } = publisherSlice.actions

export default publisherSlice.reducer 