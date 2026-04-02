// src/components/DynamicDropdown.jsx
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

export default function FreeInputDropdownList({item, onChange , initialValues, mode="view"}) {
  const [values, setValues] = useState(initialValues?.length ? initialValues : ['']);

  React.useEffect(() => {
  if (initialValues?.length) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (index, newValue) => {
    const updated = [...values];
    updated[index] = newValue?.label ?? newValue;
    setValues(updated);
    onChange(updated);
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
    return item.options.filter(
      (option) => !selected.has(option.label) || values[index] === option.label
    );
  };

  return (
      <Grid container>
        <Grid size={{ xs: 12, sm: 10, md: 10 }} offset={{ sm: 1, md: 1 }}>
          <Grid container spacing={2} columns={12}>
            {mode === "view"
              ? viewMode(item, values)
              : values.map((val, index) => 
                  addEditMode(item, mode, val, index, handleChange, handleAdd, handleRemove, getAvailableOptions, values))}
          </Grid>
        </Grid>
      </Grid>
  );
}

function addEditMode(item, mode, val, index, handleChange, handleAdd, handleRemove, getAvailableOptions, values){
  return (
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
              placeholder={item.mainLabel}
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
  )
}

function viewMode(item, values) {
  return (
    <Grid key="flavor-view" item size={{ xs: 12, sm: 6, md: 6 }}>
      <TextField
        fullWidth
        label="Flavor Notes"
        value={values.filter(v => v).join(", ") || "-"}
        variant="standard"
        slotProps={{
          input: {
            readOnly: true,
            disableUnderline: true,
            tabIndex: -1,
            sx: { cursor: "default", caretColor: "transparent" }
          },
          inputLabel: { shrink: true, sx: { color: "text.secondary" } }
        }}
      />
    </Grid>
  )
}