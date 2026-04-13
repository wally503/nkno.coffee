import React, { useEffect, useState } from 'react';
import { Grid, FormControl, TextField, Autocomplete, FormHelperText, Box } from '@mui/material';
import TextFieldGridItem from './TextFieldGridItem';
import { getRegionsForCountry } from '../api/roasterApi';

export default function DropdownGridItem({ dropdown, onChange, value, mode, dependsOn, dependsOnFieldValue, error }) {
  const [options, setOptions] = useState(dropdown.options?.length ? dropdown.options : []);

  useEffect(() => {
    console.log('see dependson: ' +dependsOn + '. dep val: ' + dependsOnFieldValue);
    if(!dependsOn) return;
    // filter

    if(!dependsOnFieldValue) {
      setOptions([]);
      return;
    }
    const countryId = dependsOnFieldValue;
    console.log('countryid in region: ' + countryId);
    const load = async () => {
      const newOptions = await getRegionsForCountry(countryId).then(r => r.data.map(r => ({ label: r.name, value: r.id })));
      console.log('new options: ' + newOptions);
      setOptions(newOptions);
    };
    load();
  }, [dependsOnFieldValue]); 

  return (
    <>
      { mode === "view" 
        ? viewMode(dropdown, onChange, value, mode, options, error)
        : addEditMode(dropdown, onChange, value, mode, options, error) } 
    </>
  );
}

function addEditMode(dropdown, onChange, value, mode, options, error){
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
              options={options}
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
              value={options?.find(o => o.value === value) ?? null}
            />
        </Box>
        {dropdown.required && (error ? null : <FormHelperText>Required</FormHelperText>)}
      </FormControl>
    </Grid>
  )
}

function viewMode(dropdown, onChange, value, mode, options, error){
  return <TextFieldGridItem 
            item={dropdown} 
            value={options?.find(o => o.value === value)?.label ?? "-"} 
            onChange={onChange} 
            mode={mode} 
            error={error} />
}