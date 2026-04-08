import { createSlice } from "@reduxjs/toolkit"

export interface IAccount {
    fullName: string;
    avatar: string;
    email: string;
    role: string;
}

interface IAccountState {
    isAuthenticated: boolean
    isLoading: boolean
    isRefreshToken: boolean
    account: IAccount
}

const initialState: IAccountState = {
    isAuthenticated: false,
    isLoading: false,
    isRefreshToken: false,
    account: {
        fullName: "",
        avatar: "",
        email: "",
        role: ""
    }
}

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccount: (state, action) => {
            state.isAuthenticated = true
            state.isLoading = false
            state.isRefreshToken = true
            state.account.fullName = action.payload.fullName
            state.account.avatar = action.payload.avatar
            state.account.email = action.payload.email
            state.account.role = action.payload.role
        },
        resetAccount: (state) => {
            state.isAuthenticated = false
            state.isLoading = false
            state.isRefreshToken = false
            state.account.fullName = ""
            state.account.avatar = ""
            state.account.email = ""
            state.account.role = ""
        },
        setRefreshToken: (state) => {
            state.isRefreshToken = true
        }
    }
})

export const { setAccount, resetAccount, setRefreshToken } = accountSlice.actions