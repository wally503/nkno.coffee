import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import HomeIcon from '@mui/icons-material/Home';
import CoffeeIcon from '@mui/icons-material/Coffee';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import './NavDrawer.css'
import NavBarItem from './NavBarItem.jsx'
import { drawerWidth } from '../constants/layout';
import { logout } from '../api/authApi.js';
import { useNavigate, Navigate } from 'react-router-dom';
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { Divider } from '@mui/material';

export default function NavDrawer() {
  const navigate = useNavigate();
  const { usernameContext } = useContext(AuthContext)

  async function Logout(){
    console.log('calling logout func')
    await logout();
    navigate('/login');
  }

  async function UserSettings(){
    0
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100% - 64px)' }}>
      <CssBaseline />
      <AppBar className="title-appbar-style" position="fixed" sx={{ backgroundColor: '#512929', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar className='title-container-align'>
          <div className="title-font" component="h1">
            nkno.coffee
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            alignSelf: 'flex-start',
            width: drawerWidth, 
            boxSizing: 'border-box', 
            backgroundColor: "#2f2e2e",
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'space-between'
          },
        }}
      >
        <Toolbar />
        {/* top bar  */}
        <Box sx={{ }}>
          <List>
            <NavBarItem icon={<HomeIcon/>} route="/" label="Home" />
            <NavBarItem icon={<AddLocationAltIcon/>} route="/maps" label="Maps" />
            <NavBarItem icon={<CoffeeIcon/>} route="/coffeeLog" label="Coffee Log" />
            <NavBarItem icon={<AssessmentIcon/>} route="/logHistory" label="Log History" />
          </List>    
        </Box>
        {/* bottom bar */}
        <Box sx={{ mt: 'auto' }}>
          <List>
            <NavBarItem icon={<LogoutIcon/>} onClick={Logout} label="Logout" />
            {/* user bar */}
            <Divider  />
            <ListItem sx={{ pl: 1.7, pr: 1, pb: 0.3  }} key={usernameContext}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                <AccountCircleIcon sx={{ color: '#64b5f6' }} />
                <ListItemText primary={usernameContext} sx={{ flex: 1, ml: 0.6, color: '#aea8a8' }} />
                <IconButton onClick={UserSettings} size="small">
                  <SettingsIcon sx={{ color: '#9e9e9e' }} />
                </IconButton>
              </Box>
            </ListItem>
          </List>    
        </Box>
      </Drawer>
    </Box>
  );
}