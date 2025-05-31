import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'

function App() {

  return (
    <div className="app-container">
      <Outlet/>
    </div>
  )
}

export default App
