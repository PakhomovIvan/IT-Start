import { configureStore } from '@reduxjs/toolkit'
import { seminarsReducer } from './slice/seminarsSlice'
import spinnerSlice from './slice/spinnerSlice'
import toastSlice from './slice/toastSlice'

const store = configureStore({
  reducer: {
    seminars: seminarsReducer,
    toast: toastSlice,
    spinner: spinnerSlice,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
