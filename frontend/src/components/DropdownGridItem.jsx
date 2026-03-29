import React from 'react';
import {
  Grid,
  FormControl,
  TextField,
  Autocomplete,
  FormHelperText,
  Box
} from '@mui/material';

export default function DropdownGridItem({ dropdown, onChange, value={value}, error }) {
  return (
    <Grid size={dropdown.size || { xs: 12 }}>
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
                  error={!!error}
                  helperText={error?.[0]}
                />
              )}
              onChange={(e, selectedOption) => onChange(dropdown.name, selectedOption?.value)}
            />
          </Box>
          {dropdown.required && (error ? null : <FormHelperText>Required</FormHelperText>)}
        </FormControl>
      </Grid>
  );
}