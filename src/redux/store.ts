import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './slide/user.slice'
import { breadcrumbsSlice } from './slide/breadcrumbs.slice'
import { bookSlice } from './slide/book.slice'
import { authorSlice } from './slide/author.slice'
import { publisherSlice } from './slide/publisher.slice'
import { categorySlice } from './slide/category.slide'
import { permissionSlice } from './slide/permission.slice'
import { roleSlice } from './slide/role.slide'
import { accountSlice } from './slide/account.slide'
import { supplierSlice } from './slide/supplier.slide'
import { customerSlice } from './slide/customer.slide'
import { cartSlice } from './slide/cart.slice'
import { orderSlice } from './slide/order.slide'


export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    user: userSlice.reducer,
    breadcrumbs: breadcrumbsSlice.reducer,
    book: bookSlice.reducer,
    author: authorSlice.reducer,
    publisher: publisherSlice.reducer,
    category: categorySlice.reducer,
    permission: permissionSlice.reducer,
    role: roleSlice.reducer,
    supplier: supplierSlice.reducer,
    customer: customerSlice.reducer,
    cart: cartSlice.reducer,
    order: orderSlice.reducer
  }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store