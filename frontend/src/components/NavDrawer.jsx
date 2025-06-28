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
import './NavDrawer.css'
import NavBarItem from './NavBarItem.jsx'
import { drawerWidth } from '../constants/layout';

export default function NavDrawer() {
  return (
    <Box sx={{ display: 'flex' }}>
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
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: "#2f2e2e" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <NavBarItem icon={<HomeIcon/>} route="/" label="Home" />
            <NavBarItem icon={<AddLocationAltIcon/>} route="/Locations" label="Locations" />
            <NavBarItem icon={<CoffeeIcon/>} route="/CoffeeLog" label="CoffeeLog" />
            <NavBarItem icon={<AssessmentIcon/>} route="LogHistory" label="LogHistory" />
          </List>    
        </Box>
      </Drawer>
    </Box>
  );
}