import { Seminars } from './Seminars'

export interface SeminarEditFormProps {
  seminar: Seminars | null
  setVisibleModal: (visible: boolean) => void
}
