import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Seminars } from '../../Common/Models/seminars/Seminars'
import { fetchSeminars, selectSeminars } from '../../Store/slice/seminarsSlice'
import { hideSpinner, showSpinner } from '../../Store/slice/spinnerSlice'
import { AppDispatch } from '../../Store/store'
import './SeminarsListPage.scss'

const SeminarsListPage = () => {
  const dispatch: AppDispatch = useDispatch()
  const seminars = useSelector(selectSeminars)

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
      />
    )
  }

  const tableActionBody = () => {
    return (
      <div className="actions">
        <Button
          type="button"
          icon="pi pi-pen-to-square"
          severity="success"
          rounded
        ></Button>
        <Button
          type="button"
          icon="pi pi-trash"
          severity="danger"
          rounded
        ></Button>
      </div>
    )
  }

  return (
    <div className="wrapper">
      <h1>Расписание семинаров</h1>
      {!!seminars.seminars.length && (
        <DataTable
          value={seminars.seminars}
          emptyMessage="Список семинаров пуст"
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
