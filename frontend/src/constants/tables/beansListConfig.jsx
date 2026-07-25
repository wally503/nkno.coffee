import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box';

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
          <ShoppingBagIcon fontSize="small" sx={{ opacity: row.purchased ? 1 : 0.15 }} />
        </Tooltip>
        <Tooltip title={row.had_as_drink ? "Had as a drink" : "Never had as a drink"}>
          <LocalCafeIcon fontSize="small" sx={{ opacity: row.had_as_drink ? 1 : 0.15 }} />
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