// src/components/MultilineTextFieldGridItem.jsx
import { Grid, FormControl, TextField, FormHelperText, Box } from "@mui/material";

export default function MultilineTextFieldGridItem({ item,  onChange, value={value}, error }) {
  return (
    <Grid size={item.size || { xs: 12 }}>
      <FormControl fullWidth required={item.required} component="fieldset">
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            label={item.label}
            required={item.required}
            placeholder={item.placeholder || ""}
            onChange={(e) => onChange(item.name, e.target.value)}
            error={!!error}
            helperText={error?.[0]}
          />
        </Box>
        {item.required && (error ? null : <FormHelperText>Required</FormHelperText>)}
      </FormControl>
    </Grid>
  );
}