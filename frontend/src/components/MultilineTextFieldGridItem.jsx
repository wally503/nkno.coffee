// src/components/MultilineTextFieldGridItem.jsx
import { Grid, FormControl, TextField, FormHelperText, Box } from "@mui/material";

export default function MultilineTextFieldGridItem({ item }) {
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
          />
        </Box>
        {item.required && <FormHelperText>Required</FormHelperText>}
      </FormControl>
    </Grid>
  );
}