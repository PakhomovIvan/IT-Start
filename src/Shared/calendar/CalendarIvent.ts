import { CalendarProps } from 'primereact/calendar'

export type CalendarEvent = Parameters<
  NonNullable<CalendarProps['onChange']>
>[0]
