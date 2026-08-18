// src/components/HoffmannEventList.jsx
import React, { useState } from 'react';
import {
  Grid,
  Box,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Row shape: { rotation_time: "0:30", rotation_count: 3 }
// rotation_time stored as a plain "m:ss" string in form state;
// converted to/from DurationField-compatible value at submit time.
const EMPTY_EVENT = { rotation_time: '', rotation_count: '' };

export default function HoffmannEventList({ item, onChange, initialValues, mode, error }) {
  const [events, setEvents] = useState(initialValues?.length ? initialValues : [EMPTY_EVENT]);

  React.useEffect(() => {
    if (initialValues?.length) {
      setEvents(initialValues);
    }
  }, [initialValues]);

  const handleChange = (index, field, newValue) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: newValue };
    setEvents(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    setEvents([...events, { ...EMPTY_EVENT }]);
  };

  const handleRemove = (index) => {
    if (events.length > 1) {
      const updated = [...events];
      updated.splice(index, 1);
      setEvents(updated);
      onChange(updated);
    }
  };

  return (
    <Grid container>
      <Grid size={{ xs: 12, sm: 10, md: 10 }} offset={{ sm: 1, md: 1 }}>
        {item?.label && (
          <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
            {item.label}
          </Typography>
        )}
        <Grid container spacing={1.5} columns={12}>
          {mode === "view"
            ? viewMode(events)
            : events.map((event, index) =>
                addEditMode(event, index, handleChange, handleAdd, handleRemove, events))}
        </Grid>
      </Grid>
    </Grid>
  );
}

function addEditMode(event, index, handleChange, handleAdd, handleRemove, events) {
  return (
    <Grid key={index} size={{ xs: 12 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          label="Time"
          placeholder="0:30"
          value={event.rotation_time}
          onChange={(e) => handleChange(index, 'rotation_time', e.target.value)}
          sx={{ width: 200 }}
        />
        <TextField
          label="Rotations"
          type="number"
          value={event.rotation_count}
          onChange={(e) => handleChange(index, 'rotation_count', e.target.value)}
          sx={{ width: 200 }}
        />
        <IconButton
          onClick={handleAdd}
          size="small"
          color="primary"
          disabled={!event.rotation_time || !event.rotation_count}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          onClick={() => handleRemove(index)}
          size="small"
          color="secondary"
          disabled={events.length === 1}
        >
          <RemoveIcon />
        </IconButton>
      </Box>
    </Grid>
  );
}

function viewMode(events) {
  const summary = events
    .filter(e => e.rotation_time && e.rotation_count)
    .map(e => `${e.rotation_time} × ${e.rotation_count}`)
    .join(", ");

  return (
    <Grid key="hoffmann-view" size={{ xs: 12, sm: 12, md: 12 }}>
      <TextField
        fullWidth
        multiline
        label="Hoffmann Events"
        value={summary || "-"}
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