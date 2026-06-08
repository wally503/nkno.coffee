import { Grid, FormControl, TextField, FormHelperText, Box, Button } from "@mui/material";
import { login } from "./api/authApi";
import * as React from "react";
import { useNavigate, Navigate } from 'react-router-dom'

export default function LoginPage() {
    const [username, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = React.useState({});

    return (
        <>

            <Grid sx={{ backgroundColor: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
                <Box className="title-font" component="h1">
                    nkno.coffee
                </Box>
                <FormControl required={true} component="fieldset" sx={{ mb: 1 }}>
                    <Box sx={{ width: "100%" }}>
                    <TextField
                        fullWidth
                        label={"Username"}
                        required={true}
                        onChange={ (e) => setUserName(e.target.value) }
                        error={!!errors.username}
                        value={username}
                    />
                    </Box>
                    <FormHelperText error>{errors.username || ' '}</FormHelperText>
                </FormControl>
                <FormControl required={true} component="fieldset" sx={{ mb: 1 }}>
                    <Box sx={{ width: "100%" }}>
                    <TextField
                        fullWidth
                        label={"Password"}
                        required={true}
                        onChange={ (e) => setPassword(e.target.value) }
                        error={!!errors.password}
                        value={password}
                        type="password"
                    />
                    </Box>
                    <FormHelperText error>{errors.password || ' '}</FormHelperText>
                </FormControl>
                <Grid sx={{ display: 'flex', gap: 2 }}>                      
                    <Button sx={{ minWidth: 120 }} variant="contained" onClick={LogIntoApp}>Log In</Button>
                    <Button sx={{ minWidth: 120 }} variant="contained" onClick={Register}>Register</Button>
                </Grid>
            </Grid>
        </>
    )

    async function LogIntoApp() {
        if (!username) setErrors(prev => ({ ...prev, username: 'Username is required' }))
        if (!password) setErrors(prev => ({ ...prev, password: 'Password is required' }))
        await login(username, password)
        navigate('/')
    }

    async function Register() {
        return 0
    }
}

