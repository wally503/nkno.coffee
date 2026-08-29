import { useState, useEffect } from "react";
import { Grid, FormControl, TextField, FormHelperText, Box } from "@mui/material";

function appendDigit(currentDigits, key) {
  if (/^\d$/.test(key)) {
    return (currentDigits + key).slice(-4);
  }
  if (key === "Backspace") {
    return currentDigits.slice(0, -1);
  }
  return currentDigits;
}

function digitsToDisplay(digits) {
  if (!digits) return "";
  const padded = digits.padStart(3, '0');
  const seconds = padded.slice(-2);
  const minutes = padded.slice(0, -2) || '0';
  return `${minutes}:${seconds}`;
}

export default function TextFieldGridItem({ item, onChange, value, mode, error, inputStyle }) {
  const [durationDigits, setDurationDigits] = useState("");

  useEffect(() => {
    if (inputStyle === "duration") {
      setDurationDigits(value ? value.replace(/\D/g, '') : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputStyle]); // only re-sync on mount/mode change, not every keystroke

  const handleChange = (e) => {
    const raw = e.target.value;

    if (inputStyle === "numeric") {
      if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
        onChange(item.name, raw);
      }
      return;
    }

    if (inputStyle === "duration") {
      // real changes for this field come through handleKeyDown; ignore stray onChange
      return;
    }

    onChange(item.name, raw);
  };

  const handleKeyDown = (e) => {
    if (inputStyle !== "duration") return;

    // let non-character keys (Tab, arrows, Enter, etc) behave normally
    if (e.key.length > 1 && e.key !== "Backspace") return;
    if (e.key.length === 1 && !/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const newDigits = appendDigit(durationDigits, e.key);
    setDurationDigits(newDigits);
    onChange(item.name, digitsToDisplay(newDigits));
  };

  return (
    <Grid size={item.size || { xs: 12 }}>
      <FormControl fullWidth required={item.required} component="fieldset">
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
            multiline
            variant={mode === "view" ? "standard" : "outlined"}
            label={item.label}
            required={mode === "view" ? false : item.required}
            placeholder={mode === "view" ? "-" : (item.placeholder || "")}
            onChange={handleChange}
            onKeyDown={inputStyle === "duration" ? handleKeyDown : undefined}
            error={!!error}
            helperText={error?.[0]}
            value={value}
            slotProps={{
              input: {
                ... (mode === "view" && { disableUnderline: true }),
                readOnly: mode === "view",
                inputMode: inputStyle === "numeric" ? "decimal" : "text",
                tabIndex: mode === "view" ? -1 : 0,
                sx: mode === "view" ? { cursor: "default", caretColor: "transparent" } : {}
              },
              inputLabel: mode === "view" ? { shrink: true, sx: { color: "text.secondary" } } : {},
            }}
          />
        </Box>
        {mode !== "view" && item.required && (error ? null : <FormHelperText>Required</FormHelperText>)}
      </FormControl>
    </Grid>
  );
}