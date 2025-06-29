import { Box, Grid, FormControl, InputLabel, Autocomplete,
    TextField, FormHelperText, Select, MenuItem, Typography } from "@mui/material";
import * as React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';



const roasters = [ 
    {label:"Daybreak Coffee Roaster", value: 1}, 
    {label: "Perkatory Roaster", value: 2}, 
    {label: "Radial Coffee Company", value: 3},
];

const countryOfOrigin = [ 
    {label:"Kenya", value: 1}, 
    {label: "Papua New Guinea", value: 2}, 
    {label: "Etheopia", value: 3},
];


export default function AddBeansPage() {
    const [roaster, setRoaster] = React.useState('');
    const [country, setCountry] = React.useState('');

    const handleRoaster = (event) => {
        setRoaster(event.target.value);
    };

    const handleCountry = (event) => {
        setcountry(event.target.value);
    };

        
    const theme = useTheme();
    const matchesMd = useMediaQuery(theme.breakpoints.up('md'));

    console.log('matchesMd?', matchesMd);


    return  (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 69px)', px: 4, py: 4, width: '100%'}}>
                <Box sx={{ width: '100%', maxWidth: 1400 }}>
                    <Grid container spacing={3} columns={12}>
                        <Grid item size={{xs:12, sm:4, md:4}}>
                            <FormControl fullWidth required component="fieldset">
                                <Box sx={{ width: '100%'}}>
                                    <Autocomplete
                                    fullWidth
                                    options={roasters}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Roaster"
                                        required // still show required asterisk
                                        />
                                    )}
                                    />
                                </Box>
                                <FormHelperText>Required</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item size={{xs:12, sm:6, md:6}}>
                            <FormControl fullWidth required>
                                <TextField
                                    id="bean-name-input"
                                    label="Bean Name"
                                    type="BeanName"
                                    autoComplete="off"
                                    fullWidth
                                />
                                <FormHelperText>Required</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
};