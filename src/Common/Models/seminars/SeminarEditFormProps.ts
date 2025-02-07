import { Seminar } from './Seminar'

export interface SeminarEditFormProps {
  seminar: Seminar | null
  setVisibleModal: (visible: boolean) => void
}
