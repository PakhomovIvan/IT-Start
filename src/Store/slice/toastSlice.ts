import { createSlice } from '@reduxjs/toolkit'
import { ToastParams } from '../../Shared/toast/ToastParams'

const initialState: ToastParams = {
  type: undefined,
  message: undefined,
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToast: (_state, action) => {
      return action.payload
    },

    clearToast: () => {
      return initialState
    },
  },
})

export const { setToast, clearToast } = toastSlice.actions

export const selectToastMessage = (state: { toast: ToastParams }) => state.toast

export default toastSlice.reducer
