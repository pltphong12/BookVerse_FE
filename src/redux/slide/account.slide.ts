import { createSlice } from "@reduxjs/toolkit"

export interface IAccount {
    username: string;
    fullName: string;
    avatar: string;
    email: string;
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
        username: "",
        fullName: "",
        avatar: "",
        email: ""
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
            state.account.username= action.payload.username
            state.account.fullName = action.payload.fullName
            state.account.avatar = action.payload.avatar
            state.account.email = action.payload.email
        },
        resetAccount: (state) => {
            state.isAuthenticated = false
            state.isLoading = false
            state.isRefreshToken = false
            state.account.username = ""
            state.account.fullName = ""
            state.account.avatar = ""
            state.account.email = ""
        },
        setRefreshToken: (state) => {
            state.isRefreshToken = true
        }
    }
})

export const { setAccount, resetAccount, setRefreshToken } = accountSlice.actions