import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Seminar } from '../../Common/Models/seminars/Seminar'
import { SeminarsInitialState } from '../../Common/Models/seminars/SeminarsInitialState'

const initialState: SeminarsInitialState = {
  seminars: [],
}

export const fetchSeminars = createAsyncThunk(
  'seminars/fetchSeminars',
  async (url: string) => {
    const res = await axios.get<Seminar[]>(url)
    return res.data
  }
)

export const patchSeminar = createAsyncThunk(
  'seminars/patchSeminar',
  async ({ id, title, description, date, time, photo }: Seminar) => {
    const res = await axios.patch<Seminar>(
      `${import.meta.env.VITE_API_URL}/${id}`,
      {
        title,
        description,
        date,
        time,
        photo,
      }
    )
    return res.data
  }
)

export const deleteSeminar = createAsyncThunk(
  'seminars/deleteSeminar',
  async (id: number) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/${id}`)
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
      (state, action: PayloadAction<Seminar[]>) => {
        state.seminars = action.payload
      }
    )
    builder.addCase(
      patchSeminar.fulfilled,
      (state, action: PayloadAction<Seminar>) => {
        state.seminars = state.seminars.map((seminar) =>
          seminar.id === action.payload.id ? action.payload : seminar
        )
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
