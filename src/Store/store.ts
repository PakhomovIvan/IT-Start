import { configureStore } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { seminarsReducer } from './slice/seminarsSlice'
import spinnerSlice from './slice/spinnerSlice'
import toastSlice, { setToast } from './slice/toastSlice'

const store = configureStore({
  reducer: {
    seminars: seminarsReducer,
    toast: toastSlice,
    spinner: spinnerSlice,
  },
})

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      store.dispatch(setToast({ type: 'error', message: error.message }))
      throw new AxiosError(error.message)
    } else if (error instanceof Error) {
      store.dispatch(setToast({ type: 'error', message: error.stack }))
      throw new Error(error.stack)
    }
    throw error
  }
)

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
