import { Grid, FormControl, TextField, FormHelperText, Box } from "@mui/material";

export default function TextFieldGridItem({ item, onChange, value, mode, error }) {
  return (
    <Grid size={item.size || { xs: 12 }}>
      <FormControl fullWidth required={item.required} component="fieldset">
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
            variant={mode === "view" ? "standard" : "outlined"}
            label={item.label}
            required={mode === "view" ? false : item.required}
            placeholder={mode === "view" ? "-" : (item.placeholder || "")}
            onChange={(e) => onChange(item.name, e.target.value)}
            error={!!error}
            helperText={error?.[0]}
            value={value}
            slotProps={{
              input: {
                readOnly: mode === "view",
                disableUnderline: mode === "view",
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