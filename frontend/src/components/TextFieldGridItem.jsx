import { Grid, FormControl, TextField, FormHelperText, Box } from "@mui/material";

export default function TextFieldGridItem({ item }) {
  return (
    <Grid item size={item.size || { xs: 12 }}>
      <FormControl fullWidth required={item.required} component="fieldset">
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
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