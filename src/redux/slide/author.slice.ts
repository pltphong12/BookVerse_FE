import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { callCreateAuthorApi, callDeleteAuthorApi, callUpdateAuthorApi } from '../../services/api'
import { IAuthor, IBackendRes } from '../../types/backend'

export interface ICreateAuthor {
    id: number
    name: string
    nationality: string
    birthday: string
    avatar: string
}

interface IAuthorState {
    isCreateAuthorSuccess: boolean,
    isCreateAuthorFailed: boolean,
    isDeleteAuthorSuccess: boolean,
    isDeleteAuthorFailed: boolean,
    isUpdateAuthorSuccess: boolean,
    isUpdateAuthorFailed: boolean,
    message: string,
}

const initialState: IAuthorState = {
    isCreateAuthorSuccess: false,
    isCreateAuthorFailed: false,
    isDeleteAuthorSuccess: false,
    isDeleteAuthorFailed: false,
    isUpdateAuthorSuccess: false,
    isUpdateAuthorFailed: false,
    message: "",
}

export const createAuthor = createAsyncThunk(
    'author/create',
    async (payload: ICreateAuthor) => {
        try {
            const response = await callCreateAuthorApi(payload.name, payload.nationality, payload.birthday, payload.avatar)
            return response.data as IBackendRes<IAuthor>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const deleteAuthor = createAsyncThunk(
    'author/delete',
    async (payload: number) => {
        try {
            const response = await callDeleteAuthorApi(payload)
            return response.data as IBackendRes<IAuthor>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const updateAuthor = createAsyncThunk(
    'author/update',
    async (payload: { id: number, data: ICreateAuthor }) => {
        try {
            const response = await callUpdateAuthorApi(payload.id, payload.data.name, payload.data.nationality, payload.data.birthday, payload.data.avatar)
            return response.data as IBackendRes<IAuthor>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const authorSlice = createSlice({
    name: 'author',
    initialState,
    reducers: {
        resetCreateAuthor: (state) => {
            state.isCreateAuthorSuccess = false
            state.isCreateAuthorFailed = false
        },
        resetDeleteAuthor: (state) => {
            state.isDeleteAuthorSuccess = false
            state.isDeleteAuthorFailed = false
        },
        resetUpdateAuthor: (state) => {
            state.isUpdateAuthorSuccess = false
            state.isUpdateAuthorFailed = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createAuthor.fulfilled, (state, action) => {
            state.isCreateAuthorSuccess = true
            state.isCreateAuthorFailed = false
            state.message = action.payload?.message || ""
        })

        builder.addCase(createAuthor.rejected, (state, action) => {
            state.isCreateAuthorSuccess = false
            state.isCreateAuthorFailed = true
            state.message = action.error.message || ""
        })

        builder.addCase(deleteAuthor.fulfilled, (state, action) => {
            state.isDeleteAuthorSuccess = true
            state.isDeleteAuthorFailed = false
            state.message = action.payload?.message || ""
        })

        builder.addCase(deleteAuthor.rejected, (state, action) => {
            state.isDeleteAuthorSuccess = false
            state.isDeleteAuthorFailed = true
            state.message = action.error.message || ""
        })

        builder.addCase(updateAuthor.fulfilled, (state, action) => {
            state.isUpdateAuthorSuccess = true
            state.isUpdateAuthorFailed = false
            state.message = action.payload?.message || ""
        })

        builder.addCase(updateAuthor.rejected, (state, action) => {
            state.isUpdateAuthorSuccess = false
            state.isUpdateAuthorFailed = true
            state.message = action.error.message || ""
        })
    }
})

export const { resetCreateAuthor, resetDeleteAuthor, resetUpdateAuthor } = authorSlice.actions

export default authorSlice.reducer
