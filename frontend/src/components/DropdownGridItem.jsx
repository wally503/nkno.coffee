import React, { useEffect, useState } from 'react';
import { Grid, FormControl, TextField, Autocomplete, FormHelperText, Box } from '@mui/material';
import TextFieldGridItem from './TextFieldGridItem';
import { getRegionsForCountry } from '../api/roasterApi';
import { requiredNudgeStyling } from "../constants/gridStyles";

export default function DropdownGridItem({ dropdown, onChange, value, mode, dependsOn, dependsOnFieldValue, error, helperText }) {
  const [options, setOptions] = useState(dropdown.options?.length ? dropdown.options : []);

  useEffect(() => {
    // console.log('see dependson: ' +dependsOn + '. dep val: ' + dependsOnFieldValue);
    if(!dependsOn) return;
    // filter

    if(!dependsOnFieldValue) {
      setOptions([]);
      return;
    }
    const countryId = dependsOnFieldValue;
    console.log('countryid in region: ' + countryId);
    const load = async () => {
      const newOptions = await getRegionsForCountry(countryId).then(r => r.data.results.map(r => ({ label: r.name, value: r.id })));
      console.log(newOptions)
      // console.log('new options: ' + newOptions);
      setOptions(newOptions);
    };  
    load();
  }, [dependsOnFieldValue]); 

  // watches for form-controlled field polling (eg. selecting a roaster polls for its beans)
  useEffect(() => {
    if (!dependsOn) {
      setOptions(dropdown.options?.length ? dropdown.options : []);
    }
  }, [dropdown.options]);

  return (
    <>
      { mode === "view" 
        ? viewMode(dropdown, onChange, value, mode, options, error)
        : addEditMode(dropdown, onChange, value, mode, options, error, helperText) } 
    </>
  );
}

function addEditMode(dropdown, onChange, value, mode, options, error, helperText){
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
              autoHighlight
              autoSelect
              disabled={dropdown.editDisable && mode === "edit"}
              options={options}
              groupBy={dropdown.groupBy ? (option) => option.group : undefined}
              // grouped options read "Bean – Vessel" once selected (and when typing to filter),
              // but the list rows stay vessel-only since the group heading already names the bean
              getOptionLabel={(option) => (dropdown.groupBy && option.group ? `${option.group} – ${option.label}` : option.label)}
              renderOption={dropdown.groupBy ? (props, option) => {
                const { key, ...rest } = props;
                return (
                  <li key={key} {...rest} style={{ ...rest.style, paddingLeft: 36 }}>
                    <span style={{ color: "rgba(180, 140, 100, 0.9)", marginRight: 8 }}></span>
                    {option.label}
                  </li>
                );
              } : undefined}
              slotProps={{
                paper: {
                  sx: {
                    border: "1px solid rgba(180, 140, 100, 0.5)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                  },
                },
                listbox: {
                  sx: {
                    "& .MuiAutocomplete-groupLabel": {
                      color: "rgba(180, 140, 100, 0.9)",
                      fontWeight: 600,
                    },
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={dropdown.label}
                  required={dropdown.required}
                  error={!!error}
                  helperText={error?.[0] ?? helperText}
                />
              )}
              sx={mode !== "view" && !dropdown.disableNudge ? requiredNudgeStyling(dropdown, mode, value, error) : {}}
              onChange={(e, selectedOption) => {
                console.log('selectedOption:', selectedOption);
                onChange(dropdown.name, selectedOption?.value);
              }}
              value={options?.find(o => o.value === value) ?? null}
            />
        </Box>
        {dropdown.required && !error && !helperText && <FormHelperText>Required</FormHelperText>}
      </FormControl>
    </Grid>
  )
}

function viewMode(dropdown, onChange, value, mode, options, error){
  const selected = options?.find(o => o.value === value);
  // grouped options (the lot picker) read "Bean – Vessel" when shown as plain text
  const shown = selected ? (dropdown.groupBy && selected.group ? `${selected.group} – ${selected.label}` : selected.label) : "-";
  return <TextFieldGridItem 
            item={dropdown} 
            value={shown} 
            onChange={onChange} 
            mode={mode} 
            error={error} />
}