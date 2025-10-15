import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { callCreateBookApi, callDeleteBookApi, callUpdateBookApi } from '../../services/api'
import { IAuthorInBook, IBackendRes, IBook, ICategoryInBook, IPublisher, ISupplier } from '../../types/backend'

export interface ICreateBook {
    id: number
    title: string
    publisher: IPublisher
    supplier: ISupplier
    authors: IAuthorInBook[]
    category: ICategoryInBook
    price: number
    discount: number
    quantity: number
    publishYear: number
    weight: number
    dimensions: string
    numberOfPages: number
    coverFormat: string
    isbn: string
    description: string
    image: string
}

interface IBookState {
    isCreateBookSuccess: boolean,
    isCreateBookFailed: boolean,
    isDeleteBookSuccess: boolean,
    isDeleteBookFailed: boolean,
    isUpdateBookSuccess: boolean,
    isUpdateBookFailed: boolean,
    message: string,
}

const initialState: IBookState = {
    isCreateBookSuccess: false,
    isCreateBookFailed: false,
    isDeleteBookSuccess: false,
    isDeleteBookFailed: false,
    isUpdateBookSuccess: false,
    isUpdateBookFailed: false,
    message: "",
}

export const createBook = createAsyncThunk(
    'book/create',
    async (payload: ICreateBook) => {
        try {
            const response = await callCreateBookApi(payload.title, payload.publisher, payload.supplier, payload.authors, payload.category, payload.price, payload.discount, payload.quantity, payload.publishYear, payload.weight, payload.dimensions, payload.numberOfPages, payload.coverFormat, payload.image, payload.description)
            return response.data as IBackendRes<IBook>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const deleteBook = createAsyncThunk(
    'book/delete',
    async (payload: number) => {
        try {
            const response = await callDeleteBookApi(payload)
            return response.data as IBackendRes<IBook>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const updateBook = createAsyncThunk(
    'book/update',
    async (payload: { id: number, data: ICreateBook }) => {
        try {
            const response = await callUpdateBookApi(payload.id, payload.data.title, payload.data.publisher, payload.data.supplier, payload.data.authors, payload.data.category, payload.data.price, payload.data.discount, payload.data.quantity, payload.data.publishYear, payload.data.weight, payload.data.dimensions, payload.data.numberOfPages, payload.data.coverFormat, payload.data.image, payload.data.description)
            return response.data as IBackendRes<IBook>
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data
            }
        }
    }
)

export const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        resetCreateBook: (state) => {
            state.isCreateBookSuccess = false
            state.isCreateBookFailed = false
        },
        resetDeleteBook: (state) => {
            state.isDeleteBookSuccess = false
            state.isDeleteBookFailed = false
        },
        resetUpdateBook: (state) => {
            state.isUpdateBookSuccess = false
            state.isUpdateBookFailed = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createBook.fulfilled, (state, action) => {
            state.isCreateBookSuccess = true
            state.isCreateBookFailed = false
            state.message = action.payload?.message || ""
        })

        builder.addCase(createBook.rejected, (state, action) => {
            state.isCreateBookSuccess = false
            state.isCreateBookFailed = true
            state.message = action.error.message || ""
        })

        builder.addCase(deleteBook.fulfilled, (state, action) => {
            state.isDeleteBookSuccess = true
            state.isDeleteBookFailed = false
            state.message = action.payload?.message || ""
        })

        builder.addCase(deleteBook.rejected, (state, action) => {
            state.isDeleteBookSuccess = false
            state.isDeleteBookFailed = true
            state.message = action.error.message || ""
        })

        builder.addCase(updateBook.fulfilled, (state, action) => {
            state.isUpdateBookSuccess = true
            state.isUpdateBookFailed = false
            state.message = action.payload?.message || ""
        })

        builder.addCase(updateBook.rejected, (state, action) => {
            state.isUpdateBookSuccess = false
            state.isUpdateBookFailed = true
            state.message = action.error.message || ""
        })
    }
})

// Action creators are generated for each case reducer function
export const { resetCreateBook, resetDeleteBook, resetUpdateBook } = bookSlice.actions

export default bookSlice.reducer
