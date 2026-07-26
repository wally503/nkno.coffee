import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box';
import CoffeeBean from '../../ass../../assets/icons/coffee-bean.svg?react';

const ICON_SIZE = 24;
const BEAN_COLOR = '#6f4e37';  
const CUP_COLOR  = '#a67c52';  

export const defaultBeansTableColumns = [
  { 
    id: "name", 
    label: "Bean Name", 
    minWidth: 220 
  },
  { 
    id: "roaster", 
    label: "Roaster", 
    minWidth: 120,
    orderingField: "roaster__name"
  },
  {
    id: "origin_country",
    label: "Roast Origin",
    minWidth: 110,
    orderingField: "origin_country__name"
  },
  {
    id: "roast_level",
    label: "Roast",
    minWidth: 110,
    orderingField: "roast_level"
  },
  {
    id: "washing_style",
    label: "Process",
    minWidth: 85,
  },
  {
    id: "elevation",
    label: "Elevation",
    minWidth: 120,
    orderingField: null
  },
  {
    id: "flavor_notes",
    label: "Flavor / Body Notes",
    minWidth: 200,
    orderingField: null
  },
  {
    id: "status_icons",
    label: "",
    minWidth: 70,
    render: (_, row) => (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title={row.purchased ? "Owned a bag" : "Never bought"}>
          <CoffeeBean style={{ width: ICON_SIZE, height: ICON_SIZE, color: BEAN_COLOR, opacity: row.purchased ? 1 : 0.15 }} />
        </Tooltip>
        <Tooltip title={row.had_as_drink ? "Had as a drink" : "Never had as a drink"}>
          <LocalCafeIcon sx={{ fontSize: ICON_SIZE, color: CUP_COLOR, opacity: row.had_as_drink ? 1 : 0.15 }} />
        </Tooltip>
      </Box>
    ),
  },
  {
    id: "date_added",
    label: "Date Added",
    minWidth: 130,
    orderingField: "date_added",
    render: (value) => value
      ? new Date(value).toLocaleDateString("en-CA")
      : "-",
  }
];