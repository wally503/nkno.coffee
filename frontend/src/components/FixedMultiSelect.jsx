// src/components/FixedMultiSelect.jsx
import React, { useState } from 'react';
import { Grid, Box, IconButton, TextField, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const sameId = (a, b) => String(a) === String(b);

export default function FixedMultiSelectInput({ item, onChange, initialValues, mode, dependsOn, error }) {
  const [values, setValues] = useState(initialValues?.length ? initialValues : ['']);

  React.useEffect(() => {
    if (initialValues?.length) {
      setValues(initialValues);
    }
  }, [initialValues]);

  // Report only real picks upward (no empty placeholder boxes).
  const report = (updated) => onChange(updated.filter((v) => v !== ''));

  const handleChange = (index, newValue) => {
    const updated = [...values];
    updated[index] = newValue ? newValue.value : '';
    setValues(updated);
    report(updated);
  };

  const handleAdd = () => {
    setValues([...values, '']);
  };

  const handleRemove = (index) => {
    if (values.length > 1) {
      const updated = [...values];
      updated.splice(index, 1);
      setValues(updated);
      report(updated);
    }
  };

  const getAvailableOptions = (index) => {
    const picked = values.filter((_, i) => i !== index);
    return item.options.filter(
      (option) => !picked.some((p) => sameId(p, option.value))
    );
  };

  return (
    <Grid
      size={{ xs: item.size?.xs ?? 12, sm: item.size?.sm ?? 10, md: item.size?.md ?? 10 }}
      offset={{ sm: item.grid_offset ?? 1, md: item.grid_offset ?? 1 }}
    >
      <Grid container spacing={2} columns={12}>
        {mode === "view"
          ? viewMode(item, values)
          : values.map((val, index) =>
              addEditMode(item, val, index, handleChange, handleAdd, handleRemove, getAvailableOptions, values))}
      </Grid>
    </Grid>
  );
}

function addEditMode(item, val, index, handleChange, handleAdd, handleRemove, getAvailableOptions, values) {
  const selectedOption = item.options.find((o) => sameId(o.value, val)) ?? null;

  return (
    <Grid key={index} size={{ xs: item.ddl_size?.sm ?? 12, sm: item.ddl_size?.sm ?? 6, md: item.ddl_size?.md ?? 6 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Autocomplete
          fullWidth
          autoHighlight
          value={selectedOption}
          onChange={(_, newValue) => handleChange(index, newValue)}
          options={getAvailableOptions(index)}
          getOptionLabel={(o) => o.label ?? ''}
          isOptionEqualToValue={(o, v) => sameId(o.value, v.value)}
          renderInput={(params) => (
            <TextField {...params} label={item.label} placeholder={item.mainLabel} />
          )}
        />
        <IconButton onClick={handleAdd} size="small" color="primary" disabled={!val}>
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
  );
}

function viewMode(item, values) {
  const labels = values
    .filter((v) => v !== '')
    .map((v) => item.options.find((o) => sameId(o.value, v))?.label ?? v);

  return (
    <Grid key="fixed-multi-view" size={{ xs: 12, sm: 12, md: 12 }}>
      <TextField
        fullWidth
        multiline
        label={item.label}
        value={labels.join(", ") || "-"}
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
  );
}