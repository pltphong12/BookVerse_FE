import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { callCreateRolesApi, callDeleteRolesApi, callUpdateRolesApi } from "../../services/api"
import { AxiosError } from "axios"
import { IBackendRes, IPermission, IRole } from "../../types/backend"

export interface ICreateRole{
    id?: number
    name: string
    description: string
    permissions: IPermission[]
}

interface IRoleState {
    isCreateRoleSuccess: boolean
    isCreateRoleFailed: boolean
    isUpdateRoleSuccess: boolean
    isUpdateRoleFailed: boolean
    isDeleteRoleSuccess: boolean
    isDeleteRoleFailed: boolean
    message: string
}

const initialState: IRoleState = {
    isCreateRoleSuccess: false,
    isCreateRoleFailed: false,
    isUpdateRoleSuccess: false,
    isUpdateRoleFailed: false,
    isDeleteRoleSuccess: false,
    isDeleteRoleFailed: false,
    message: ''
}

export const createRole = createAsyncThunk(
    'role/create',
    async (payload: ICreateRole) => {
        try {
            const response = await callCreateRolesApi(payload.name, payload.description, payload.permissions)
            return response.data as IBackendRes<IRole>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const updateRole = createAsyncThunk(
    'role/update',
    async ( payload : { id: number; data: ICreateRole }) => {
        try {
            const response = await callUpdateRolesApi(payload.id, payload.data.name, payload.data.description, payload.data.permissions)
            return response.data as IBackendRes<IRole>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const deleteRole = createAsyncThunk(
    'role/delete',
    async (payload: number) => {
        try {
            const response = await callDeleteRolesApi(payload)
            return response.data as IBackendRes<IRole>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        resetCreateRole: (state) => {
            state.isCreateRoleSuccess = false
            state.isCreateRoleFailed = false
        },
        resetUpdateRole: (state) => {
            state.isUpdateRoleSuccess = false
            state.isUpdateRoleFailed = false
        },
        resetDeleteRole: (state) => {
            state.isDeleteRoleSuccess = false
            state.isDeleteRoleFailed = false
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Role
            .addCase(createRole.fulfilled, (state, action) => {
                state.isCreateRoleSuccess = true
                state.isCreateRoleFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(createRole.rejected, (state, action) => {
                state.isCreateRoleSuccess = false
                state.isCreateRoleFailed = true
                state.message = action.error?.message || ""
            })
            // Update Role
            .addCase(updateRole.fulfilled, (state, action) => {
                state.isUpdateRoleSuccess = true
                state.isUpdateRoleFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.isUpdateRoleSuccess = false
                state.isUpdateRoleFailed = true
                state.message = action.error.message || ""
            })
            // Delete Role
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.isDeleteRoleSuccess = true
                state.isDeleteRoleFailed = false
                state.message = action.payload?.message || ""
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.isDeleteRoleSuccess = false
                state.isDeleteRoleFailed = true
                state.message = action.error?.message || ""
            })
    }
})

export const { resetCreateRole, resetUpdateRole, resetDeleteRole } = roleSlice.actions

export default roleSlice.reducer 