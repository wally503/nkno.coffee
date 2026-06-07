import { Grid, FormControl, TextField, FormHelperText, Box } from "@mui/material";

export default function LoginPage() {
    return (
        <Grid>
            <FormControl required={true} component="fieldset">
                <Box sx={{ width: "100%" }}>
                <TextField
                    fullWidth
                    label={"Username"}
                    required={true}
                    helperText={"Username"}
                    // error={!!error}
                    // value={value}
                />
                </Box>
                <FormHelperText>Required</FormHelperText>
            </FormControl>
            <FormControl required={true} component="fieldset">
                <Box sx={{ width: "100%" }}>
                <TextField
                    fullWidth
                    label={"Password"}
                    required={true}
                    helperText={"Password"}
                    // error={!!error}
                    // value={value}
                />
                </Box>
                <FormHelperText>Required</FormHelperText>
            </FormControl>
        </Grid>
    )
}