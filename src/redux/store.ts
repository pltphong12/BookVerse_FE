import { configureStore } from '@reduxjs/toolkit'
import { counterSlice } from './slide/counter.slice'
import { userSlice } from './slide/user.slice'
import { breadcrumbsSlice } from './slide/breadcrumbs.slice'
import { bookSlice } from './slide/book.slice'
import { authorSlice } from './slide/author.slice'
import { publisherSlice } from './slide/publisher.slice'
import { categorySlice } from './slide/categogy.slide'
import { permissionSlice } from './slide/permission.slice'
import { roleSlice } from './slide/role.slide'


export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    user: userSlice.reducer,
    breadcrumbs: breadcrumbsSlice.reducer,
    book: bookSlice.reducer,
    author: authorSlice.reducer,
    publisher: publisherSlice.reducer,
    category: categorySlice.reducer,
    permission: permissionSlice.reducer,
    role: roleSlice.reducer
  }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store