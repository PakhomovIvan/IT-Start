import moment from 'moment'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { FloatLabel } from 'primereact/floatlabel'
import { Image } from 'primereact/image'
import { InputText } from 'primereact/inputtext'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { CalendarEvent } from '../../Shared/calendar/CalendarIvent'
import { checkingEmptyDataInput } from '../../Shared/forms/checkingEmptyDataInput'
import { fetchSeminars, patchSeminar } from '../../Store/slice/seminarsSlice'
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
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SeminarEditFromValues>({
    defaultValues: {
      title: '',
      description: '',
      date: null,
      time: null,
      photo: '',
    },
    mode: 'onBlur',
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

      setValue('title', seminar.title)
      setValue('description', seminar.description)
      setValue('date', parsedDate)
      setValue('time', time)
      setValue('photo', seminar.photo)
    }
  }, [seminar, setValue])

  const photoUrl = watch('photo')

  const handleDateChange = (e: CalendarEvent) => {
    setValue('date', e.value as Date | null)
  }

  const handleTimeChange = (e: CalendarEvent) => {
    setValue('time', e.value as Date | null)
  }

  const onSubmit: SubmitHandler<SeminarEditFromValues> = (data) => {
    dispatch(showSpinner())
    if (seminar) {
      const formatDate = data.date ? moment(data.date).format('DD.MM.YYYY') : ''
      const formatTime = data.time ? moment(data.time).format('HH:mm') : ''

      dispatch(
        patchSeminar({
          id: seminar.id,
          title: data.title,
          description: data.description,
          date: formatDate,
          time: formatTime,
          photo: data.photo,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchSeminars(import.meta.env.VITE_API_URL))
          setVisibleModal(false)
          dispatch(
            setToast({
              type: 'success',
              message: 'Запись отредактирована',
            })
          )
        })
        .catch(() =>
          dispatch(
            setToast({
              type: 'error',
              message: 'Ошибка редактирования записи',
            })
          )
        )
        .finally(() => dispatch(hideSpinner()))
    }
  }

  const getFormErrorMessage = (name: keyof SeminarEditFromValues) => {
    return errors[name] && <small>{errors[name].message}</small>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-wrapper">
      <div className="edit-form">
        <div className="input-text">
          <div className="form-input">
            <Controller
              control={control}
              name="title"
              rules={{
                required: 'Обязательно для заполнения',
                validate: (value) => checkingEmptyDataInput(value),
                maxLength: {
                  value: 60,
                  message: 'Допустимое количество символов - 60',
                },
                pattern: {
                  value: /^[a-zA-Zа-яА-ЯёЁ\s-]+$/,
                  message: 'Недопустимый формат названия',
                },
              }}
              render={({ field }) => (
                <FloatLabel>
                  <InputText
                    id={field.name}
                    {...field}
                    placeholder="Введите..."
                    autoComplete="off"
                  />
                  <label form={field.name}>
                    Название<span>*</span>
                  </label>
                </FloatLabel>
              )}
            />
            {getFormErrorMessage('title')}
          </div>
          <div className="form-input">
            <Controller
              control={control}
              name="description"
              rules={{
                required: 'Обязательно для заполнения',
                validate: (value) => checkingEmptyDataInput(value),
                maxLength: {
                  value: 80,
                  message: 'Допустимое количество символов - 80',
                },
                pattern: {
                  value: /^[a-zA-Zа-яА-ЯёЁ\s-]+$/,
                  message: 'Недопустимый формат описания',
                },
              }}
              render={({ field }) => (
                <FloatLabel id={field.name}>
                  <InputText
                    id={field.name}
                    {...field}
                    placeholder="Введите..."
                    autoComplete="off"
                  />
                  <label form={field.name}>
                    Описание<span>*</span>
                  </label>
                </FloatLabel>
              )}
            />
            {getFormErrorMessage('description')}
          </div>
        </div>
        <div className="input-date">
          <div className="form-input">
            <Controller
              control={control}
              name="date"
              rules={{
                required: 'Обязательно для заполнения',
              }}
              render={({ field }) => (
                <FloatLabel id={field.name}>
                  <Calendar
                    id={field.name}
                    {...field}
                    value={field.value}
                    placeholder="Выберите..."
                    onChange={handleDateChange}
                    dateFormat="dd.mm.yy"
                    icon={() => <i className="pi pi-calendar" />}
                    showIcon
                  />
                  <label form={field.name}>
                    Дата<span>*</span>
                  </label>
                </FloatLabel>
              )}
            />
          </div>
          <div className="form-input">
            <Controller
              control={control}
              name="time"
              rules={{
                required: 'Обязательно для заполнения',
              }}
              render={({ field }) => (
                <FloatLabel id={field.name}>
                  <Calendar
                    id={field.name}
                    {...field}
                    value={field.value}
                    onChange={handleTimeChange}
                    placeholder="Выберите..."
                    timeOnly
                    hourFormat="24"
                    showIcon
                    icon={() => <i className="pi pi-clock" />}
                  />
                  <label form={field.name}>
                    Время<span>*</span>
                  </label>
                </FloatLabel>
              )}
            />
          </div>
        </div>
        <div className="input-photo">
          <div className="p-inputgroup flex-1">
            <Controller
              control={control}
              name="photo"
              render={({ field }) => (
                <FloatLabel id={field.name}>
                  <InputText
                    id={field.name}
                    {...field}
                    value={field.value}
                    autoComplete="off"
                  />
                  <label form={field.name}>Логотип</label>
                  <span className="p-inputgroup-addon">URL</span>
                </FloatLabel>
              )}
            />
          </div>
        </div>
      </div>
      <Image
        src={photoUrl ? photoUrl : '/image/no-image.png'}
        onError={({ currentTarget }) =>
          currentTarget instanceof HTMLImageElement
            ? (currentTarget.src = '/image/no-image.png')
            : ''
        }
        alt="seminar-image"
        width="230"
        preview
      />
      <Button id="submit" label="Сохранить" />
    </form>
  )
}

export default SeminarEditForm
