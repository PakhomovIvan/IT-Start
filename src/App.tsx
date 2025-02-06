import SeminarsListPage from './Pages/SeminarsListPage/SeminarsListPage'
import Spinner from './Shared/spinner/Spinner'
import ShowToast from './Shared/toast/ShowToast'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import 'primereact/resources/primereact.css'
import 'primeicons/primeicons.css'
import './App.css'

function App() {
  return (
    <>
      <SeminarsListPage />
      <ShowToast />
      <Spinner />
    </>
  )
}

export default App
