import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { Seminars } from '../../Common/Models/seminars/Seminars'
import { SeminarsInitialState } from '../../Common/Models/seminars/SeminarsInitialState'
import store from '../store'
import { setToast } from './toastSlice'

const initialState: SeminarsInitialState = {
  seminars: [],
}

export const fetchSeminars = createAsyncThunk(
  'seminars/fetchSeminars',
  async (url: string) => {
    try {
      const res = await axios.get<Seminars>(url)
      return res.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        store.dispatch(setToast({ type: 'error', message: error.message }))
        throw new AxiosError(error.message)
      } else if (error instanceof Error) {
        store.dispatch(setToast({ type: 'error', message: error.stack }))
        throw new Error(error.stack)
      }
    }
  }
)

const seminarsSlice = createSlice({
  name: 'seminars',
  initialState,
  reducers: {
    deleteProduct: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        products: state.seminars.filter(
          (seminar) => seminar.id !== action.payload
        ),
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      fetchSeminars.fulfilled,
      (state: { seminars: Seminars[] }, action: PayloadAction<Seminars[]>) => {
        state.seminars = action.payload
      }
    )
  },
})

export const { reducer: seminarsReducer, actions: seminarsAction } =
  seminarsSlice

export const selectSeminars = (state: { seminars: { seminars: [] } }) =>
  state.seminars

export default seminarsSlice.reducer
