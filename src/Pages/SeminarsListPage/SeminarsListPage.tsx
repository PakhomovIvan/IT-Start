import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { DataTable } from 'primereact/datatable'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Seminars } from '../../Common/Models/seminars/Seminars'
import {
  deleteSeminar,
  fetchSeminars,
  selectSeminars,
} from '../../Store/slice/seminarsSlice'
import { hideSpinner, showSpinner } from '../../Store/slice/spinnerSlice'
import { setToast } from '../../Store/slice/toastSlice'
import { AppDispatch } from '../../Store/store'
import './SeminarsListPage.scss'

const SeminarsListPage = () => {
  const dispatch: AppDispatch = useDispatch()
  const seminars = useSelector(selectSeminars)
  const confirmPopupRef = useRef(null)

  useEffect(() => {
    dispatch(showSpinner())
    dispatch(fetchSeminars(import.meta.env.VITE_API_URL)).finally(() =>
      dispatch(hideSpinner())
    )
  }, [dispatch])

  const tableImageBody = (seminars: Seminars) => {
    return (
      <img
        src={`${seminars.photo}`}
        alt={seminars.title}
        className="photo"
        title={seminars.title}
        width={50}
      />
    )
  }

  const accept = (id: number) => {
    dispatch(showSpinner())
    dispatch(deleteSeminar(id))
      .then(() =>
        dispatch(
          setToast({ type: 'success', message: 'Запись семинара удалена!' })
        )
      )
      .finally(() => dispatch(hideSpinner()))
  }

  const reject = () => {
    dispatch(setToast({ type: 'info', message: 'Вы отменили удаление записи' }))
  }

  const showPopap = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    confirmPopup({
      target: event.currentTarget,
      message: <span>Вы действительно хотите удалить запись?</span>,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      acceptLabel: 'Да',
      rejectIcon: 'pi pi-times',
      rejectLabel: 'Нет',
      accept: () => accept(id),
      reject: reject,
    })
  }

  const tableActionBody = (rowData: Seminars) => {
    return (
      <div className="actions">
        <Button
          type="button"
          icon="pi pi-pen-to-square"
          severity="success"
          aria-label="Редактировать запись"
          rounded
        ></Button>
        <Button
          type="button"
          icon="pi pi-trash"
          severity="danger"
          onClick={(e) => showPopap(e, rowData.id)}
          aria-label="Удалить запись"
          rounded
        ></Button>
      </div>
    )
  }

  return (
    <div className="wrapper">
      <h1>Расписание семинаров</h1>
      <ConfirmPopup ref={confirmPopupRef} />
      {seminars && (
        <DataTable
          value={seminars.seminars}
          emptyMessage="Список семинаров пуст"
          scrollable
          scrollHeight="80vh"
        >
          <Column field="id" header="ID"></Column>
          <Column header="Фото" body={tableImageBody}></Column>
          <Column field="title" header="Название"></Column>
          <Column field="description" header="Описание"></Column>
          <Column field="date" header="Дата"></Column>
          <Column field="time" header="Время"></Column>
          <Column header="Действия" body={tableActionBody}></Column>
        </DataTable>
      )}
    </div>
  )
}

export default SeminarsListPage
