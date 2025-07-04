import { Box, Grid, FormControl, InputLabel, Autocomplete,
    TextField, FormHelperText, Select, MenuItem, Typography, IconButton } from "@mui/material";
import * as React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import DynamicDropdownList from "../../components/DynamicDropdown";
import DropdownGridItem from "../../components/DropdownGridItem";
import TextFieldGridItem from "../../components/TextFieldGridItem";

// const roasters = [ 
//     {label:"Daybreak Coffee Roaster", value: 1}, 
//     {label: "Perkatory Roaster", value: 2}, 
//     {label: "Radial Coffee Company", value: 3},
// ];

// const countryOfOrigin = [ 
//     {label:"Kenya", value: 1}, 
//     {label: "Papua New Guinea", value: 2}, 
//     {label: "Etheopia", value: 3},
// ];

// const roastLevel = [ 
//     {label:"Light", value: 1}, 
//     {label: "Light-Medium", value: 2}, 
//     {label: "Medium", value: 3},
//     {label: "Medium-Dark", value: 4},
//     {label: "Dark", value: 5},
// ];

// const organicNonorganic = [ 
//     {label: "Organic", value: 1}, 
//     {label: "Non-organic", value: 2}, 
// ];

// const washedNatural = [ 
//     {label:"Washed", value: 1}, 
//     {label: "Natural", value: 2}, 
// ];

const dropdownValues = [
  {
    type: "dropdown",
    label: "Roaster",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    options: [
      { label: "Daybreak Coffee Roaster", value: 1 },
      { label: "Perkatory Roaster", value: 2 },
      { label: "Radial Coffee Company", value: 3 }
    ]
  },
  {
    type: "dropdown",
    label: "Country of Origin",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    options: [
      { label: "Kenya", value: 1 },
      { label: "Papua New Guinea", value: 2 },
      { label: "Etheopia", value: 3 }
    ]
  },
  {
    type: "dropdown",
    label: "Roast Level",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    options: [
      { label: "Light", value: 1 },
      { label: "Light-Medium", value: 2 },
      { label: "Medium", value: 3 },
      { label: "Medium-Dark", value: 4 },
      { label: "Dark", value: 5 }
    ]
  },
  {
    type: "dropdown",
    label: "Organic",
    required: false,
    size: { xs: 12, sm: 6, md: 6 },
    options: [
      { label: "Organic", value: 1 },
      { label: "Non-organic", value: 2 }
    ]
  },
  {
    type: "dropdown",
    label: "Washed or Not",
    required: false,
    size: { xs: 12, sm: 6, md: 6 },
    options: [
      { label: "Washed", value: 1 },
      { label: "Natural", value: 2 }
    ]
  },
  {
    type: "text",
    label: "Beans Name",
    required: true,
    size: { xs: 12 },
    placeholder: "Name of Beans"
  }
];

export const dynamicDropdownModel = {
  mainLabel: "Add Flavor Note",
  options: [
    { label: "Chocolate", value: "chocolate" },
    { label: "Citrus", value: "citrus" },
    { label: "Berry", value: "berry" },
    { label: "Caramel", value: "caramel" },
    { label: "Floral", value: "floral" },
  ],
};



export default function AddBeansPage() {
    return  (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 69px)', px: 4, py: 4, width: '100%'}}>
                <h2>Add Beans</h2>
                <Box sx={{ width: '100%', maxWidth: 1400 }}>
                    <Grid container spacing={3} columns={12}>
                        {dropdownValues.map((dropd, index) => (
                            dropd.type === "text" ? (
                                <TextFieldGridItem key={dropd.label} item={dropd} />
                            ) : (
                                <DropdownGridItem key={dropd.label} dropdown={dropd} />
                            )
                        ))}
                            
                        <Grid item size={{ xs: 12, sm: 10, md: 10 }} offset={{ sm: 1, md: 1 }}>
                            <DynamicDropdownList dropdownModel={dynamicDropdownModel} />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
};