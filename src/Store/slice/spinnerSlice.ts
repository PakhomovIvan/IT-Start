import { createSlice } from '@reduxjs/toolkit'
import { SpinnerParams } from '../../Shared/spinner/SpinnerParams'

const initialState: SpinnerParams = {
  isActive: false,
}

const spinnerSlice = createSlice({
  name: 'spinner',
  initialState,
  reducers: {
    showSpinner: (state) => {
      state.isActive = true
    },

    hideSpinner: () => {
      return initialState
    },
  },
})

export const { showSpinner, hideSpinner } = spinnerSlice.actions

export const selectSpinner = (state: { spinner: SpinnerParams }) =>
  state.spinner

export default spinnerSlice.reducer
