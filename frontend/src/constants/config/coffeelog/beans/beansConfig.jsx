// src/constants/forms/beansConfig.jsx
import { COFFEELOG_BASE } from './_base';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box';
import CoffeeBean from '../../../../assets/icons/coffee-bean.svg?react';

const ICON_SIZE = 24;
const BEAN_COLOR = '#6f4e37';  
const CUP_COLOR  = '#a67c52';
 
export const beansConfig = {
  key: 'bean',
  label: 'Bean',
  labelPlural: 'Beans',
  base: `${COFFEELOG_BASE}/beans`,
  uriPath: 'beans/',
  
  columns:  [
    { 
      id: "name", 
      label: "Bean Name", 
      minWidth: 180 
    },
    {
      id: "status_icons",
      label: "",
      minWidth: 70,
      render: (_, row) => ( 
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={row.purchased ? "Owned a bag" : "Never bought"}>
            <CoffeeBean style={{ minWidth: ICON_SIZE, maxWidth: ICON_SIZE, height: ICON_SIZE, color: BEAN_COLOR, opacity: row.purchased ? 1 : 0.15 }} />
          </Tooltip>
          <Tooltip title={row.had_as_drink ? "Had as a drink" : "Never had as a drink"}>
            <LocalCafeIcon sx={{ minWidth: ICON_SIZE, maxWidth: ICON_SIZE, height: ICON_SIZE, fontSize: ICON_SIZE, color: CUP_COLOR, opacity: row.had_as_drink ? 1 : 0.08 }} />
          </Tooltip>
        </Box>
      ),
    },
    { 
      id: "roaster", 
      label: "Roaster", 
      minWidth: 150,
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
      minWidth: 180,
      orderingField: null
    },
    {
      id: "date_added",
      label: "Date Added",
      minWidth: 110,
      orderingField: "date_added",
      render: (value) => value
        ? new Date(value).toLocaleDateString("en-CA")
        : "-",
    }
  ],
  fields: [
    {
      type: "text",
      name: "name",
      label: "Beans Name",
      required: true,
      size: { xs: 12 },
      placeholder: "Name of Beans",
    },
    {
      type: "dropdown",
      name: "roaster",
      label: "Roaster",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      optionSource: "roasters", 
    },
    {
      type: "dropdown",
      name: "origin_country",
      label: "Country of Origin",
      required: false,
      size: { xs: 12, sm: 4, md: 4 },
      optionSource: "countries",
    },

    {
      type: "dropdown",
      name: "caff_or_decaf",
      label: "Caffeinated or Decaffeinated",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      optionSource: "caffeineFlags",
    },
    {
      type: "dropdown",
      name: "organic_or_not",
      label: "Organic or Not",
      required: false,
      size: { xs: 12, sm: 3, md: 3 },
      optionSource: "organicFlags",
    },
    {
      type: "dropdown",
      name: "washing_style",
      label: "Process",
      required: false,
      size: { xs: 12, sm: 3, md: 3 },
      optionSource: "processTypes",
    },
        {
      type: "text",
      name: "min_elevation",
      label: "Minimum Elevation (in MASL)",
      required: false,
      size: { xs: 12, sm: 3, md: 3 },
      placeholder: "1800",
    },
    {
      type: "text",
      name: "max_elevation",
      label: "Maximum Elevation (in MASL)",
      required: false,
      size: { xs: 12, sm: 3, md: 3 },
      placeholder: "1800",
    },
    {
      type: "date",
      name: "roast_date",
      label: "Roast Date",
      required: false,
      size: { xs: 12, sm: 3, md: 3 },
      placeholder: "12",
    },
    {
      type: "date",
      name: "purchase_date",
      label: "Purchase Date",
      required: false,
      size: { xs: 12, sm: 3, md: 3 },
      placeholder: "12",
    },
    {
      type: "text_numeric",
      name: "bag_weight",
      label: "Bag Weight (g)",
      required: false,
      size: { xs: 12, sm: 3, md: 3 },
      placeholder: "12",
    },
    {
      type: "dropdown",
      name: "roast_level",
      label: "Roast Level",
      required: false,
      size: { xs: 12, sm: 3, md: 3 },
      optionSource: "roastLevels",
    },
    {
      type: "spacer",
      size: { xs: 0, sm: 6, md: 6 },
      gridSx: { mt: -2 },  
      color: "rgba(180, 140, 100, 0.0)",
    },
    {
      type: "long_text",
      name: "comments",
      label: "Comments on Beans",
      required: false,
      size: { xs: 12, sm: 12, md: 12 },
      placeholder: "Personal notes about the beans",
    },
    {
      type: "divider",
    },
    {
      type: "dynamic_dropdown",
      name: "flavor_notes",
      label: "Flavor / Body Notes",
      required: false,
      optionSource: "notes"
      // size: { xs: 12, sm: 4, md: 4 },
      // placeholder: "",
    },  
  ],
};

export const BEANS_STATIC_OPTIONS = {
  roastLevels: [
    { label: "Light", value: "light" },
    { label: "Light-Medium", value: "light_medium" },
    { label: "Medium", value: "medium" },
    { label: "Medium-Dark", value: "medium_dark" },
    { label: "Dark", value: "dark" },
  ],
  organicFlags: [
    { label: "Organic", value: 'organic' },
    { label: "Non-organic", value: 'not_organic' },
  ],
processTypes: [
    { label: "Washed", value: "washed" },
    { label: "Natural", value: "natural" },
    { label: "Anaerobic Natural", value: "anaerobic_natural" },
    { label: "Anaerobic Washed", value: "anaerobic_washed" },
    { label: "Honey", value: "honey" },
    { label: "Washed & Natural", value: "washed_natural" },
  ],
  caffeineFlags: [
    { label: "Caffeinated", value: 'caffeinated' },
    { label: "Decaffeinated", value: 'decaffeinated' },
  ],
};

