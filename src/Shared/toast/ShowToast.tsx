import { Toast } from 'primereact/toast'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearToast, selectToastMessage } from '../../Store/slice/toastSlice'
import { AppDispatch, RootState } from '../../Store/store'
import { ToastParams } from './ToastParams'

const ShowToast: React.FC = () => {
  const toast = useRef<Toast>(null)
  const toastMessage = useSelector<RootState, ToastParams>(selectToastMessage)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (toastMessage.type) {
      toast.current!.show({
        severity: toastMessage.type,
        summary:
          toastMessage.type?.charAt(0).toUpperCase() +
          toastMessage.type.slice(1),
        detail: toastMessage.message,
        life: 3000,
      })
      dispatch(clearToast())
    }
  }, [dispatch, toastMessage])

  return <Toast ref={toast} />
}

export default ShowToast
