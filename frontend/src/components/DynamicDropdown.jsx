import React, { useState } from 'react';
import {
  Grid,
  Box,
  IconButton,
  TextField,
  Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const baseOptions = ['Option A', 'Option B', 'Option C', 'Option D'];

export default function FreeInputDropdownList({dropdownModel}) {
  const [values, setValues] = useState(['']);

  const handleChange = (index, newValue) => {
    const updated = [...values];
    updated[index] = newValue;
    setValues(updated);
  };

  const handleAdd = () => {
    setValues([...values, '']);
  };

  const handleRemove = (index) => {
    if (values.length > 1) {
      const updated = [...values];
      updated.splice(index, 1);
      setValues(updated);
    }
  };

  const getAvailableOptions = (index) => {
    const selected = new Set(values.filter((_, i) => i !== index));
    return baseOptions.filter(
      (option) => !selected.has(option) || values[index] === option
    );
  };

  return (
      <Grid container>
        <Grid item size={{ xs: 12, sm: 10, md: 10 }} offset={{ sm: 1, md: 1 }}>
          <Grid container spacing={2} columns={12}>
            {values.map((val, index) => (
              <Grid
                key={index}
                item
                size={{ xs: 12, sm: 6, md: 6 }}  // always 2 per row ≥ sm
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Autocomplete
                    fullWidth
                    freeSolo
                    value={val}
                    onChange={(_, newValue) => handleChange(index, newValue)}
                    onInputChange={(_, newInput) => handleChange(index, newInput)}
                    options={getAvailableOptions(index)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Flavor Note"
                        placeholder={dropdownModel.mainLabel}
                      />
                    )}
                  />
                  <IconButton
                    onClick={handleAdd}
                    size="small"
                    color="primary"
                    disabled={!val}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemove(index)}
                    size="small"
                    color="secondary"
                    disabled={values.length === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
  );
}