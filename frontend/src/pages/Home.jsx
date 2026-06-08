import { Grid, Box } from "@mui/material";

export default function HomePage() {
    return  (
        <>
            <div>
                <Grid sx={{ backgroundColor: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
                    <Box className="title-font" component="h1">
                        Home Page for nkno.coffee
                    </Box>
                    <Box color='#bc7516' className="title-font" component="h3">
                        ~Work in progress~
                    </Box>
                </Grid>
            </div>
        </>
    )
};