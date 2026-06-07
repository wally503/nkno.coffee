import { Grid, FormControl, TextField, FormHelperText, Box, Button } from "@mui/material";
import { login } from "./api/authApi";
import * as React from "react";
import { useNavigate, Navigate } from 'react-router-dom'

export default function LoginPage() {
    const [username, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    return (
        <Grid>
            <FormControl required={true} component="fieldset">
                <Box sx={{ width: "100%" }}>
                <TextField
                    fullWidth
                    label={"Username"}
                    required={true}
                    helperText={"Username"}
                    onChange={ (e) => setUserName(e.target.value) }
                    // error={!!error}
                    value={username}
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
                    onChange={ (e) => setPassword(e.target.value) }
                    // error={!!error}
                    value={password}
                />
                </Box>
                <FormHelperText>Required</FormHelperText>
            </FormControl>
            <Box sx={{ width: "100%", maxWidth: 1400, mt: 5 }}>
                <Grid container spacing={3} columns={12} my={3}>
                    <Grid size={ {xs: 2 }}>
                        <Button variant="contained" onClick={LogIntoApp}>Log In</Button>

                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )

    async function LogIntoApp() {
        console.log(username, password);
        await login(username, password)
        // console.log('authstate post call: ', authState)
        navigate('/')
    }
}

