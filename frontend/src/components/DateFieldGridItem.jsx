import React from 'react';
import {
  Grid,
  FormControl,
  FormHelperText,
  Box
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';

export default function DateFieldGridItem({ item }) {
  return (
    <Grid size={item.size || { xs: 12 }}>
      <MobileDatePicker
        label={item.label || ""}
        value={null}
        onChange={() => {}}
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