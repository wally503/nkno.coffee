import { Box, Grid, FormControl, InputLabel, 
    TextField, FormHelperText, Select, MenuItem, Typography } from "@mui/material";
import * as React from 'react';



export default function AddBeansPage() {
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };




    return  (
        <>
            <Box>
                <Grid container spacing={3} alignItems="stretch">
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl required sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-required-label">Roaster</InputLabel>
                                <Select
                                labelId="demo-simple-select-required-label"
                                id="demo-simple-select-required"
                                value={age}
                                label="Age *"
                                onChange={handleChange}
                                >
                                    <MenuItem value="">
                                        {/* <em>None</em> */}
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            <FormHelperText>Required</FormHelperText>
                        </FormControl>
                        <TextField
                            id="bean-name-input"
                            label="Bean Name"
                            type="BeanName"
                            autoComplete="current-password"
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
};