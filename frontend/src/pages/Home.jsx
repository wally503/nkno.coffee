import { Grid, Box, Card, Typography, CardContent } from "@mui/material";
import CardPageBodyLayout from "../components/CardPageBodyLayout";

export default function HomePage() {
    return  (
        <>
            <CardPageBodyLayout>
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', width: '100%' }}>
                    <Card sx={{
                            border: '1px solid rgba(180, 140, 100, 0.5)',
                            transition: '0.2s',
                            height: 'fit-content', 
                            width: '90%',
                            py: 30                         
                        }}> 
                        <Typography variant="h4" sx={{ py:4, textAlign:'Center'}}>
                            Latest Bean
                        </Typography>
                        <CardContent sx={{ textAlign:'Center', justifyContent: 'center'}}>
                            <Typography variant="h5">Bean Name</Typography>
                            <Typography variant="body2">Roaster Name</Typography>
                            <Typography variant="body2">Country</Typography>
                        </CardContent>
                    </Card>            
                    <Card sx={{
                            border: '1px solid rgba(180, 140, 100, 0.5)',
                            transition: '0.2s',
                            height: 'fit-content', 
                            width: '90%',
                            py: 30                         
                        }}> 
                        <Typography variant="h4" sx={{ py:4, textAlign:'Center'}}>
                            Bean of the Day
                        </Typography>
                        <CardContent sx={{ textAlign:'Center', justifyContent: 'center'}}>
                            <Typography variant="h5">Bean Name</Typography>
                            <Typography variant="body2">Roaster Name</Typography>
                            <Typography variant="body2">Country</Typography>
                        </CardContent>
                    </Card> 
                </Box>
            </CardPageBodyLayout>
        </>
    )
};