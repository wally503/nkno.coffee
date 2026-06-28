// src/Layout.jsx
import { Toolbar, Box } from '@mui/material'
import NavDrawer from './components/NavDrawer'
import { Outlet, useLocation } from 'react-router-dom'
import { drawerWidth } from './constants/layout'
import AuthProvider from './context/AuthContext'
import './App.css';



export default function Layout() {
    const location = useLocation();
    return (
        <>
            <AuthProvider>
                <Toolbar />
                <NavDrawer />
                <Box component="main" sx={{ flexGrow: 1, p: 0, ml: `${drawerWidth}px` }}>
                    <div className="page-fade" key={location.pathname}>
                        <Outlet />
                    </div>
                </Box>
            </AuthProvider>
        </>
    )
}