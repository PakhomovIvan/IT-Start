import moment from 'moment'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CalendarEvent } from '../../Shared/calendar/CalendarIvent'
import { patchSeminar } from '../../Store/slice/seminarsSlice'
import { hideSpinner, showSpinner } from '../../Store/slice/spinnerSlice'
import { setToast } from '../../Store/slice/toastSlice'
import { AppDispatch } from '../../Store/store'
import { SeminarEditFormProps } from '../Models/seminars/SeminarEditFormProps'
import { SeminarEditFromValues } from '../Models/seminars/SeminarEditFromValues'
import './SeminarEditForm.scss'

const SeminarEditForm = ({
  seminar,
  setVisibleModal,
}: SeminarEditFormProps) => {
  const dispatch: AppDispatch = useDispatch()
  const [formValues, setFormValues] = useState<SeminarEditFromValues>({
    title: '',
    description: '',
    date: null,
    time: null,
    photo: '',
  })

  useEffect(() => {
    if (seminar) {
      let time: Date | null = null

      if (seminar.time) {
        const [hours, minutes] = seminar.time.toString().split(':').map(Number)
        const now = new Date()
        time = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes
        )
      }

      const parsedDate =
        typeof seminar.date === 'string'
          ? moment(seminar.date, 'DD.MM.YYYY').toDate()
          : seminar.date instanceof Date
          ? new Date(seminar.date)
          : null

      setFormValues({
        title: seminar.title,
        description: seminar.description,
        date: parsedDate,
        time: time,

        photo: seminar.photo,
      })
    }
  }, [seminar])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }))
  }

  const handleDateChange = (e: CalendarEvent) => {
    console.log(e)
    setFormValues((prevValues) => ({
      ...prevValues,
      date: e.value as Date | null,
    }))
  }

  const handleTimeChange = (e: CalendarEvent) => {
    console.log(e)
    setFormValues((prevValues) => ({
      ...prevValues,
      time: e.value as Date | null,
    }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    dispatch(showSpinner())
    if (seminar) {
      const formatDate = formValues.date
        ? moment(formValues.date).format('DD.MM.YYYY')
        : ''

      const formatTime = formValues.time
        ? moment(formValues.time).format('HH:mm')
        : ''

      dispatch(
        patchSeminar({
          id: seminar.id,
          title: formValues.title,
          description: formValues.description,
          date: formatDate,
          time: formatTime,
          photo: formValues.photo,
        })
      )
        .then(() => setVisibleModal(false))
        .then(() =>
          dispatch(
            setToast({
              type: 'success',
              message: 'Запись отредактирована',
            })
          )
        )
        .finally(() => dispatch(hideSpinner()))
    }
  }

  return (
    <form className="form-wrapper">
      <div className="edit-form">
        <div className="input-text">
          <FloatLabel>
            <InputText
              id="title"
              value={formValues.title}
              onChange={handleChange}
              required
            />
            <label form="title">Название</label>
          </FloatLabel>
          <FloatLabel id="description">
            <InputText
              id="description"
              value={formValues.description}
              onChange={handleChange}
              required
            />
            <label form="description">Описание</label>
          </FloatLabel>
        </div>
        <div className="input-date">
          <FloatLabel id="date">
            <Calendar
              id="date"
              value={formValues.date}
              onChange={handleDateChange}
              placeholder="Выберите дату"
              dateFormat="dd.mm.yy"
              icon={() => <i className="pi pi-calendar" />}
              showIcon
              required
            />
            <label form="date">Дата</label>
          </FloatLabel>
          <FloatLabel id="time">
            <Calendar
              id="time"
              value={formValues.time}
              onChange={handleTimeChange}
              placeholder="Установите время"
              timeOnly
              hourFormat="24"
              showIcon
              icon={() => <i className="pi pi-clock" />}
              required
            />
            <label form="time">Время</label>
          </FloatLabel>
        </div>
        <div className="input-photo">
          <div className="p-inputgroup flex-1">
            <FloatLabel id="photo">
              <InputText
                id="photo"
                value={formValues.photo}
                onChange={handleChange}
                required
              />
              <label form="photo">Логотип</label>
              <span className="p-inputgroup-addon">URL</span>
            </FloatLabel>
          </div>
        </div>
      </div>
      <img
        className="preview-photo"
        src={formValues.photo}
        alt="Не удалось загрузить изображение"
      />
      <Button id="submit" label="Сохранить" onClick={handleSubmit} />
    </form>
  )
}

export default SeminarEditForm
