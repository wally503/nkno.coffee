import React from 'react';
import { Grid, FormControl, FormHelperText } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import TextFieldGridItem from './TextFieldGridItem';

export default function DateFieldGridItem({ item, onChange, value, mode, error }) {
  return (
    <>
      {mode === "view"
        ? viewMode(item, onChange, value, mode, error)
        : addEditMode(item, onChange, value, error)}
    </>
  );
}

function addEditMode(item, onChange, value, error) {
  return (
    <Grid size={item.size || { xs: 12 }}>
      <MobileDatePicker
        label={item.label || ""}
        value={value ? dayjs(value) : null}
        closeOnSelect
        onChange={(val) => onChange(item.name, val ? val.format('YYYY-MM-DD') : null)}
        slotProps={{
          textField: {
            fullWidth: true,
            required: item.required,
            error: !!error,
            helperText: error?.[0],
            sx: {
              "& fieldset": {
                borderColor: "rgba(180, 140, 100, 0.5)",
              },
            },
          },
        }}
        error={!!error}
        helperText={error?.[0]}
      />
      {item.required && (error ? null : <FormHelperText>Required</FormHelperText>)}
    </Grid>
  );
}

function viewMode(item, onChange, value, mode, error) {
  return <TextFieldGridItem
            item={item}
            value={value ? dayjs(value).format('MMM D, YYYY') : "-"}
            onChange={onChange}
            mode={mode}
            error={error} />
}