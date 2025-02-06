import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Seminars } from '../../Common/Models/seminars/Seminars'
import { SeminarsInitialState } from '../../Common/Models/seminars/SeminarsInitialState'

const initialState: SeminarsInitialState = {
  seminars: [],
}

export const fetchSeminars = createAsyncThunk(
  'seminars/fetchSeminars',
  async (url: string) => {
    const res = await axios.get<Seminars[]>(url)
    return res.data
  }
)

export const deleteSeminar = createAsyncThunk(
  'seminars/deleteSeminar',
  async (id: number) => {
    const url = `${import.meta.env.VITE_API_URL}/${id}`
    await axios.delete(url)
    return id
  }
)

const seminarsSlice = createSlice({
  name: 'seminars',
  initialState,
  reducers: {
    deleteSeminar: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        seminars: state.seminars.filter(
          (seminar) => seminar.id !== action.payload
        ),
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      fetchSeminars.fulfilled,
      (state, action: PayloadAction<Seminars[]>) => {
        state.seminars = action.payload
      }
    )
    builder.addCase(
      deleteSeminar.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.seminars = state.seminars.filter(
          (seminar) => seminar.id !== action.payload
        )
      }
    )
  },
})

export const { reducer: seminarsReducer, actions: seminarsAction } =
  seminarsSlice

export const selectSeminars = (state: { seminars: SeminarsInitialState }) =>
  state.seminars

export default seminarsSlice.reducer
