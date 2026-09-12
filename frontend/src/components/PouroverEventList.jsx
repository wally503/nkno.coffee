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
        <Grid container spacing={0} columns={12}>
          {mode === "view"
            ? viewMode(events, totalPoured)
            : events.map((event, index) =>
                addEditMode(event, index, handleChange, handleAdd, handleRemove, events, error?.[index]))}
        </Grid>
        {mode !== "view" && (
          <Box sx={{ mt: 0, fontSize: "0.85rem", color: "text.secondary" }}>
            Total poured: {totalPoured}ml
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

function addEditMode(event, index, handleChange, handleAdd, handleRemove, events, rowError) {

  function fromSeconds(totalSeconds) {
    if (totalSeconds == null) return null;
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
  }

  const startSeconds = toSeconds(event.pour_time);
  const durationSeconds = toSeconds(event.pour_duration);
  const endSeconds = startSeconds != null && durationSeconds != null
    ? startSeconds + durationSeconds
    : null;
  const rate = durationSeconds && event.pour_amount
    ? (Number(event.pour_amount) / durationSeconds).toFixed(1)
    : null;

  const rangeLabel = startSeconds != null && endSeconds != null
    ? `${event.pour_time} – ${fromSeconds(endSeconds)}${rate ? ` (${rate}g/s)` : ''}`
    : null;

  return (
    <Grid key={index} size={{ xs: 12 }} sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <TextField
          label="Pour Time"
          placeholder="0:30"
          value={event.pour_time}
          onChange={(e) => handleChange(index, 'pour_time', e.target.value)}
          onBlur={(e) => handleChange(index, 'pour_time', normalizePourTime(e.target.value))}
          error={!!rowError?.pour_time}
          helperText={rowError?.pour_time?.[0]}
          sx={{ width: 180 }}
        />
        <TextField
          label="Pour Duration"
          placeholder="0:30"
          value={event.pour_duration}
          onChange={(e) => handleChange(index, 'pour_duration', e.target.value)}
          onBlur={(e) => handleChange(index, 'pour_duration', normalizePourTime(e.target.value))}
          error={!!rowError?.pour_duration}
          helperText={rowError?.pour_duration?.[0]}
          sx={{ width: 180 }}
        />
        <TextField
          label="Amount (g)"
          type="number"
          value={event.pour_amount}
          onChange={(e) => handleChange(index, 'pour_amount', e.target.value)}
          error={!!rowError?.pour_amount}
          helperText={rowError?.pour_amount?.[0]}
          sx={{ width: 280 }}
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
        <IconButton 
          onClick={handleAdd} 
          size="small" 
          color="primary" 
          disabled={!event.pour_time || !event.pour_amount || !event.pour_style}
          sx={{ mt: 1.16 }}
        >
          <AddIcon />
        </IconButton>
        <IconButton 
          onClick={() => handleRemove(index)} 
          size="small" 
          color="secondary" 
          disabled={events.length === 1}
          sx={{ mt: 1.16 }}
        >
          <RemoveIcon />
        </IconButton>
      </Box>
      {rangeLabel && (
        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", pl: 0.5, mt: -2 }}>
          {rangeLabel}
        </Typography>
      )}
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

function toSeconds(duration) {
  if (!duration) return null;
  const parts = duration.split(':').map(Number);
  if (parts.some(Number.isNaN)) return null;

  const [h, m, s] = parts.length === 3 ? parts : [0, ...parts];
  return h * 3600 + m * 60 + s;
}

function viewMode(events, totalPoured) {
  const styleLabel = (value) =>
    POUROVER_STATIC_OPTIONS.pour_style.find((opt) => opt.value === value)?.label || value;

  const columnSx = { width: 90 };

  return (
    <Grid key="pourover-view" size={{ xs: 12, sm: 12, md: 12 }} sx={{ maxWidth: 580 }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Pour Events (total: {totalPoured}g)
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 0.5,
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          fontSize: "0.75rem",
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5
        }}
      >
        <Box sx={columnSx}>Time</Box>
        <Box sx={columnSx}>Weight</Box>
        <Box sx={columnSx}>Duration</Box>
        <Box sx={columnSx}>Rate</Box>
        <Box sx={{ flex: 1, textAlign: "right" }}>Style</Box>
      </Box>
      {events
        .filter(e => e.pour_time && e.pour_amount)
        .map((e, index) => {
          const seconds = toSeconds(e.pour_duration);
          const rate = seconds ? (Number(e.pour_amount) / seconds).toFixed(1) : null;
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 0.5,
                borderBottom: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <Box sx={columnSx}>{e.pour_time}</Box>
              <Box sx={columnSx}>{e.pour_amount}g</Box>
              <Box sx={columnSx}>{e.pour_duration}</Box>
              <Box sx={columnSx}>{rate ? ` (${rate}g/s)` : ''}</Box>
              <Box sx={{ flex: 1, textAlign: "right" }}>{styleLabel(e.pour_style)}</Box>
            </Box>
          );
        })}
    </Grid>
  );
}