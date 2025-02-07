import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { patchSeminar } from '../../Store/slice/seminarsSlice'
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

      setFormValues({
        title: seminar.title,
        description: seminar.description,
        date: new Date(seminar.date),
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

  const handleDateChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      date: e.value || null,
    }))
  }

  const handleTimeChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      time: e.value || null,
    }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (seminar) {
      const formatDate = formValues.date
        ? formValues.date.toLocaleDateString('ru-RU')
        : ''
      const formatTime = formValues.time
        ? formValues.time.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })
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
      ).then(() => setVisibleModal(false))
    }
  }

  return (
    <form className="form-wrapper">
      <div className="edit-form">
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
        <FloatLabel id="date">
          <Calendar
            id="date"
            value={formValues.date}
            onChange={handleDateChange}
            dateFormat="dd.mm.yy"
            required
          />
          <label form="date">Дата</label>
        </FloatLabel>
        <FloatLabel id="time">
          <Calendar
            id="time"
            value={formValues.time}
            onChange={handleTimeChange}
            timeOnly
            hourFormat="24"
            required
          />
          <label form="time">Время</label>
        </FloatLabel>
      </div>
      <FloatLabel id="photo">
        <InputText
          id="photo"
          value={formValues.photo}
          onChange={handleChange}
          required
        />
        <label form="photo">URL Логотипа</label>
      </FloatLabel>
      <img
        className="preview-photo"
        src={formValues.photo}
        alt="Не удалось загрузить изображение"
      />
      <Button label="Сохранить" onClick={handleSubmit} />
    </form>
  )
}

export default SeminarEditForm
