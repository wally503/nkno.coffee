import React from 'react';
import { Grid, FormControl, TextField, Autocomplete, FormHelperText, Box } from '@mui/material';
import TextFieldGridItem from './TextFieldGridItem';

export default function DropdownGridItem({ dropdown, onChange, value, mode="view", error }) {
  return (
    <>
      { mode === "view" 
        ? viewMode(dropdown, onChange, value, mode, error)
        : addEditMode(dropdown, onChange, value, mode, error) } 
    </>
  );
}

function addEditMode(dropdown, onChange, value, mode, error){
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
              value={dropdown.options.find(o => o.value === value) ?? null}
            />
        </Box>
        {dropdown.required && (error ? null : <FormHelperText>Required</FormHelperText>)}
      </FormControl>
    </Grid>
  )
}

function viewMode(dropdown, onChange, value, mode, error){
  return <TextFieldGridItem 
            item={dropdown} 
            value={dropdown.options.find(o => o.value === value)?.label ?? "-"} 
            onChange={onChange} 
            mode={mode} 
            error={error} />
}