import { useNavigate } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const NavBarItem = ({ icon, label, route }) => {
  const navigate = useNavigate();

  return (
    <ListItem key={label} disablePadding>
      <ListItemButton onClick={() => navigate(route)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavBarItem;