import { Toolbar, Box } from '@mui/material'
import NavDrawer from './components/NavDrawer'
import { Outlet } from 'react-router-dom'
import { drawerWidth } from './constants/layout'

export default function Layout() {
    return (
        <>
            <Toolbar />
            <NavDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 0, ml: `${drawerWidth}px`,}}>
            <Outlet />
            </Box>
        </>
    )
}