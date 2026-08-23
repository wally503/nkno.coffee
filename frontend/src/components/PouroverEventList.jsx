// src/components/PouroverEventList.jsx
import React, { useState } from 'react';
import {
  Grid,
  Box,
  IconButton,
  TextField,
  MenuItem,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { POUROVER_STATIC_OPTIONS } from '../constants/config/brew/pourover/pouroverConfig';

// Row shape: { pour_time: "0:30", pour_amount: 60, pour_style: "center" }
const EMPTY_EVENT = { pour_time: '', pour_amount: '', pour_style: '' };

export default function PouroverEventList({ item, onChange, initialValues, mode, error }) {
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

  const totalPoured = events
    .filter(e => e.pour_amount)
    .reduce((sum, e) => sum + Number(e.pour_amount || 0), 0);

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
            ? viewMode(events, totalPoured)
            : events.map((event, index) =>
                addEditMode(event, index, handleChange, handleAdd, handleRemove, events, error?.[index]))}
        </Grid>
        {mode !== "view" && (
          <Box sx={{ mt: 1, fontSize: "0.85rem", color: "text.secondary" }}>
            Total poured: {totalPoured}ml
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

function addEditMode(event, index, handleChange, handleAdd, handleRemove, events, rowError) {
  return (
    <Grid key={index} size={{ xs: 12 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, minHeight: 96 }}>
        <TextField
          label="Time"
          placeholder="0:30"
          value={event.pour_time}
          onChange={(e) => handleChange(index, 'pour_time', e.target.value)}
          onBlur={(e) => handleChange(index, 'pour_time', normalizePourTime(e.target.value))}
          error={!!rowError?.pour_time}
          helperText={rowError?.pour_time?.[0] ?? " "}
          sx={{ width: 200 }}
        />
        <TextField
          label="Amount (ml)"
          type="number"
          value={event.pour_amount}
          onChange={(e) => handleChange(index, 'pour_amount', e.target.value)}
          error={!!rowError?.pour_amount}
          helperText={rowError?.pour_amount?.[0] ?? " "}
          sx={{ width: 220 }}
        />
        <TextField
          select
          label="Pour Style"
          value={event.pour_style}
          onChange={(e) => handleChange(index, 'pour_style', e.target.value)}
          error={!!rowError?.pour_style}
          helperText={rowError?.pour_style ? "Required" : " "}
          sx={{ width: 250 }}
        >
          {POUROVER_STATIC_OPTIONS.pour_style.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <IconButton onClick={handleAdd} size="small" color="primary" disabled={!event.pour_time || !event.pour_amount || !event.pour_style}>
          <AddIcon />
        </IconButton>
        <IconButton onClick={() => handleRemove(index)} size="small" color="secondary" disabled={events.length === 1}>
          <RemoveIcon />
        </IconButton>
      </Box>
    </Grid>
  );
}

// Cleans up whatever the user typed into a "m:ss" shape Django's DurationField
// will accept.
function normalizePourTime(value) {
  if (!value) return value;

  const digits = value.replace(/\D/g, '');
  if (!digits) return value;

  const seconds = digits.slice(-2).padStart(2, '0');
  const minutes = digits.slice(0, -2) || '0';

  return `${minutes}:${seconds}`;
}

function viewMode(events, totalPoured) {
  const styleLabel = (value) =>
    POUROVER_STATIC_OPTIONS.pour_style.find((opt) => opt.value === value)?.label || value;

  const summary = events
    .filter(e => e.pour_time && e.pour_amount)
    .map(e => `${e.pour_time} – ${e.pour_amount}ml (${styleLabel(e.pour_style)})`)
    .join(", ");

  return (
    <Grid key="pourover-view" size={{ xs: 12, sm: 12, md: 12 }}>
      <TextField
        fullWidth
        multiline
        label={`Pour Events (total: ${totalPoured}ml)`}
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