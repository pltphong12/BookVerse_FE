import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { callCreateUserApi, callDeleteUserApi, callUpdateUserApi } from '../../services/api'
import { IBackendRes, IUser } from '../../types/backend'

export interface ICreateUser {
  username: string
  password: string
  fullName: string
  address: string
  phone: string
  role: {
    id: number
  }
  avatar: string
}

interface IUserState {
  isCreateUserSuccess: boolean,
  isCreateUserFailed: boolean,
  isDeleteUserSuccess: boolean,
  isDeleteUserFailed: boolean,
  isUpdateUserSuccess: boolean,
  isUpdateUserFailed: boolean,
  message: string,
}

const initialState: IUserState = {
  isCreateUserSuccess: false,
  isCreateUserFailed: false,
  isDeleteUserSuccess: false,
  isDeleteUserFailed: false,
  isUpdateUserSuccess: false,
  isUpdateUserFailed: false,
  message: "",
}


export const createUser = createAsyncThunk(
  'user/create',
  async (payload: ICreateUser) => {
    try {
      const response = await callCreateUserApi(
        payload.username, 
        payload.password, 
        payload.fullName, 
        payload.address, 
        payload.phone, 
        payload.role.id,
        payload.avatar
      )
      return response.data as IBackendRes<IUser>
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data
      }
    }
  }
)

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (payload: number) => {
    try {
      const response = await callDeleteUserApi(payload)
      return response.data as IBackendRes<IUser>
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data
      }
    }
  }
)

export const updateUser = createAsyncThunk(
  'user/update',
  async (payload: { id: number, data: ICreateUser }) => {
    try {
      const response = await callUpdateUserApi(
        payload.id,
        payload.data.username,
        payload.data.password,
        payload.data.fullName,
        payload.data.address,
        payload.data.phone,
        payload.data.role.id,
        payload.data.avatar
      )
      return response.data as IBackendRes<IUser>
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data
      }
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetCreateUser: (state) => {
      state.isCreateUserSuccess = false
      state.isCreateUserFailed = false
    },
    resetDeleteUser: (state) => {
      state.isDeleteUserSuccess = false
      state.isDeleteUserFailed = false
    },
    resetUpdateUser: (state) => {
      state.isUpdateUserSuccess = false
      state.isUpdateUserFailed = false
    }
  },
  extraReducers: (builder) => {

    builder.addCase(createUser.fulfilled, (state, action) => {
      state.isCreateUserSuccess = true
      state.isCreateUserFailed = false
      state.message = action.payload?.message || ""
    })

    builder.addCase(createUser.rejected, (state, action) => {
      state.isCreateUserSuccess = false
      state.isCreateUserFailed = true
      state.message = action.error.message || ""
    })

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isDeleteUserSuccess = true
      state.isDeleteUserFailed = false
      state.message = action.payload?.message || ""
    })

    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isDeleteUserSuccess = false
      state.isDeleteUserFailed = true
      state.message = action.error.message || ""
    })

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isUpdateUserSuccess = true
      state.isUpdateUserFailed = false
      state.message = action.payload?.message || ""
    })

    builder.addCase(updateUser.rejected, (state, action) => {
      state.isUpdateUserSuccess = false
      state.isUpdateUserFailed = true
      state.message = action.error.message || ""
    })
  }
})

// Action creators are generated for each case reducer function
export const { resetCreateUser, resetDeleteUser, resetUpdateUser } = userSlice.actions

export default userSlice.reducer