import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { callCreatePermissionApi, callDeletePermissionApi, callUpdatePermissionApi } from '../../services/api'
import { IBackendRes, IPermission } from '../../types/backend'

export interface ICreatePermission{
    id?: number
    name: string
    apiPath: string 
    method: string
}

interface IPermissionState {
    isCreatePermissionSuccess: boolean
    isCreatePermissionFailed: boolean
    isUpdatePermissionSuccess: boolean
    isUpdatePermissionFailed: boolean
    isDeletePermissionSuccess: boolean
    isDeletePermissionFailed: boolean
    message: string
}

const initialState: IPermissionState = {
    isCreatePermissionSuccess: false,
    isCreatePermissionFailed: false,
    isUpdatePermissionSuccess: false,
    isUpdatePermissionFailed: false,
    isDeletePermissionSuccess: false,
    isDeletePermissionFailed: false,
    message: ''
}

export const createPermission = createAsyncThunk(
    'permission/create',
    async (payload: ICreatePermission) => {
        try {
            const response = await callCreatePermissionApi(payload.name, payload.apiPath, payload.method)
            return response.data as IBackendRes<IPermission>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const updatePermission = createAsyncThunk(
    'permission/update',
    async ( payload : { id: number; data: ICreatePermission }) => {
        try {
            const response = await callUpdatePermissionApi(payload.id, payload.data.name, payload.data.apiPath, payload.data.method)
            return response.data as IBackendRes<IPermission>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const deletePermission = createAsyncThunk(
    'permission/delete',
    async (payload: number) => {
        try {
            const response = await callDeletePermissionApi(payload)
            return response.data as IBackendRes<IPermission>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        resetCreatePermission: (state) => {
            state.isCreatePermissionSuccess = false
            state.isCreatePermissionFailed = false
        },
        resetUpdatePermission: (state) => {
            state.isUpdatePermissionSuccess = false
            state.isUpdatePermissionFailed = false
        },
        resetDeletePermission: (state) => {
            state.isDeletePermissionSuccess = false
            state.isDeletePermissionFailed = false
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Permission
            .addCase(createPermission.fulfilled, (state, action) => {
                state.isCreatePermissionSuccess = true
                state.isCreatePermissionFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(createPermission.rejected, (state, action) => {
                state.isCreatePermissionSuccess = false
                state.isCreatePermissionFailed = true
                state.message = action.error?.message || ""
            })
            // Update Permission
            .addCase(updatePermission.fulfilled, (state, action) => {
                state.isUpdatePermissionSuccess = true
                state.isUpdatePermissionFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(updatePermission.rejected, (state, action) => {
                state.isUpdatePermissionSuccess = false
                state.isUpdatePermissionFailed = true
                state.message = action.error.message || ""
            })
            // Delete Permission
            .addCase(deletePermission.fulfilled, (state, action) => {
                state.isDeletePermissionSuccess = true
                state.isDeletePermissionFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(deletePermission.rejected, (state, action) => {
                state.isDeletePermissionSuccess = false
                state.isDeletePermissionFailed = true
                state.message = action.error?.message || ""
            })
    }
})

export const { resetCreatePermission, resetUpdatePermission, resetDeletePermission } = permissionSlice.actions

export default permissionSlice.reducer 