import React from 'react';
import {
  Grid,
  FormControl,
  FormHelperText,
  Box
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';

export default function DateFieldGridItem({ item, onChange, value={value} }) {
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
            required: item.isRequired,
            sx: {
              "& fieldset": {
                borderColor: "rgba(180, 140, 100, 0.5)",
              },
            },
          },
        }}
      />

      {item.isRequired && (
        <FormHelperText>Required</FormHelperText>
      )}
    </Grid>
  );
}