export const checkingEmptyDataInput = (value: string) => {
  return !value.trim() ? 'Поле не может состоять только из пробелов' : true
}
