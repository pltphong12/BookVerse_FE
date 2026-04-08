import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ICartState {
    sum: number
}

const initialState: ICartState = {
    sum: 0
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartSum: (state, action: PayloadAction<number>) => {
            state.sum = action.payload
        },
        resetCart: (state) => {
            state.sum = 0
        }
    }
})

export const { setCartSum, resetCart } = cartSlice.actions