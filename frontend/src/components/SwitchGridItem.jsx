// src/components/SwitchGridItem.jsx
import { Grid, FormControl, FormControlLabel, FormHelperText, Switch } from "@mui/material";

export default function SwitchGridItem({ item, onChange, value, mode, error }) {
  const hasError = Boolean(error);

  return (
    <Grid size={item.size || { xs: 12 }}>
      <FormControl error={hasError}>
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(value)}
              onChange={(e) => onChange(item.name, e.target.checked)}
              disabled={mode === "view"}
            />
          }
          label={`${item.label}${item.required ? " *" : ""}`}
        />
        {mode !== "view" && item.required && (
          hasError
            ? <FormHelperText error>{Array.isArray(error) ? error[0] : error}</FormHelperText>
            : null
        )}
      </FormControl>
    </Grid>
  );
}