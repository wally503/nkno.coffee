import { useState } from 'react'
import Box from '@mui/material/Box';
import { Toolbar } from '@mui/material';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { CoffeeLogCardSelect, HomePage, LocationsPage, LogHistoryPage } from './pages'
import { drawerWidth } from './constants/layout';
import { coffeelogOptions } from './routes/coffeeLogRoutes';
import CoffeeLogLayout from './pages/coffeelog/CoffeeLogLayout';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 0, ml: `${drawerWidth}px`,}}>
        <Toolbar/>
        <Routes>
          <Route path="/" element={ <HomePage />  } />
          <Route path="/Locations" element={ <LocationsPage />  } />
          <Route path="/CoffeeLog" element={ <CoffeeLogLayout />  }>
            <Route index element={<CoffeeLogCardSelect />} />
              {coffeelogOptions.map(({path, element}) => ( 
                <Route key={path} path={path} element={element} />
              ))}
          </Route>
          <Route path="/LogHistory" element={ <LogHistoryPage />  } />
        </Routes>
      </Box>
    </>
  )
}

export default App;
