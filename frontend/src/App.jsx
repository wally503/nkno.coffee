// src/App.jsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { CoffeeLogCardSelect, HomePage, MapsPage, LogHistoryPage } from './pages'
import { coffeelogOptions } from './routes/coffeeLogRoutes';
import CoffeeLogLayout from './pages/coffeelog/CoffeeLogLayout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LoginPage from './Login';
import Layout from './Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/error" element={<ErrorPage />} /> */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={ <HomePage />  } />
            <Route path="/maps" element={ <MapsPage />  } />
            <Route path="/coffeeLog" element={ <CoffeeLogLayout />  }>
              <Route index element={<CoffeeLogCardSelect />} />
                {coffeelogOptions.map(({path, element}) => ( 
                  <Route key={path} path={path} element={element} />
                ))}
            </Route>
            <Route path="/logHistory" element={ <LogHistoryPage />  } />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;
