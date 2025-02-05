import { configureStore } from '@reduxjs/toolkit'
import toastSlice from './slice/toastSlice'
import spinnerSlice from './slice/spinnerSlice'

const store = configureStore({
  reducer: {
    toast: toastSlice,
    spinner: spinnerSlice,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
