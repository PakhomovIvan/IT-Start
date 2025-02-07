import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SeminarEditForm from '../../Common/Components/SeminarEditForm'
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
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [selectedSeminar, setSelectedSeminar] = useState<Seminars | null>(null)

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
          setToast({ type: 'success', message: 'Запись семинара удалена' })
        )
      )
      .finally(() => dispatch(hideSpinner()))
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
    })
  }

  const openEditModal = (seminar: Seminars) => {
    setSelectedSeminar(seminar)
    setVisibleModal(true)
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
          onClick={() => openEditModal(rowData)}
        ></Button>
        <Button
          type="button"
          icon="pi pi-trash"
          severity="danger"
          aria-label="Удалить запись"
          rounded
          onClick={(e) => showPopap(e, rowData.id)}
        ></Button>
      </div>
    )
  }

  return (
    <div className="wrapper">
      <h1>Расписание семинаров</h1>
      <ConfirmPopup ref={confirmPopupRef} />
      {seminars && (
        <>
          <DataTable
            value={seminars.seminars}
            emptyMessage="Список семинаров пуст"
            scrollable
            scrollHeight="80vh"
          >
            <Column field="id" header="ID"></Column>
            <Column body={tableImageBody}></Column>
            <Column field="title" header="Название"></Column>
            <Column field="description" header="Описание"></Column>
            <Column field="date" header="Дата"></Column>
            <Column field="time" header="Время"></Column>
            <Column body={tableActionBody}></Column>
          </DataTable>
          <Dialog
            header="Редактирование семинара"
            visible={visibleModal}
            blockScroll
            modal
            style={{ width: '50vw', textAlign: 'center' }}
            onHide={() => {
              if (!visibleModal) return
              setVisibleModal(false)
            }}
          >
            <div className="m-2">
              <SeminarEditForm
                seminar={selectedSeminar}
                setVisibleModal={setVisibleModal}
              />
            </div>
          </Dialog>
        </>
      )}
    </div>
  )
}

export default SeminarsListPage
