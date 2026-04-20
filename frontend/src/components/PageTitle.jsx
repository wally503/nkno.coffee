import { Grid, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PageHeaderTitle({ title, hasBackButton, backRoute }) {
  const navigate = useNavigate();
  
  return (
    <>
      <Box sx={{ width: "100%", maxWidth: 1400, my: "15px" }}>
        <Grid container spacing={3} columns={12} sx={{alignItems:"center"}}>
          <Grid size={{ xs: 4 }}>   
            {hasBackButton && (
              <Button variant="contained" onClick={() => navigate(backRoute)} >
                ← Back
              </Button>
            )} 
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%", maxWidth: 1400, mb: "15px" }}>
        <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center", }} size={{ xs: 4 }}>
          <Typography variant="h5">
            {title}
          </Typography>
        </Grid>
        <Grid size={{ xs: 4 }}></Grid>
      
    </Box>
    </>
  );
}
