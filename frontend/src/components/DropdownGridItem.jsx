import React from 'react';
import {
  Grid,
  FormControl,
  TextField,
  Autocomplete,
  FormHelperText,
  Box
} from '@mui/material';

export default function DropdownGridItem({ dropdown }) {
  return (
    <Grid item size={dropdown.size || { xs: 12 }}>
        <FormControl
          fullWidth
          required={dropdown.required}
          component="fieldset"
        >
          <Box sx={{ width: '100%' }}>
            <Autocomplete
              fullWidth
              options={dropdown.options}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={dropdown.label}
                  required={dropdown.required}
                />
              )}
            />
          </Box>
          {dropdown.required && (
            <FormHelperText>Required</FormHelperText>
          )}
        </FormControl>
      </Grid>
  );
}