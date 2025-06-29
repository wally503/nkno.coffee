import { Grid, Card, CardActionArea, CardContent, Container, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coffeelogOptions } from '../../routes/coffeeLogRoutes';

export default function CoffeeLogSelect(){
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();

    const LogTypeCard = ({option}) => {
        return (
            <Card sx={{
                    border: '1px solid #ccc',
                    transition: '0.2s',
                    height: 320, 
                    width: 275,
                    display: 'flex'
            }}>
                <CardActionArea onClick={() => navigate(option.path)} sx={{cursor:'pointer'}} >
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {option.title}
                        </Typography>
                        <Typography variant="body" color="text.secondary">
                            {option.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        )
    }

    return (
        <>
            <Box sx={{ display: 'flex',justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 69px)', px: 4, py: 4, width: '100%'}}>
                <Grid container spacing={3} justifyContent="center">
                    { coffeelogOptions.map((option) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={option.id}>
                            <LogTypeCard option={option} /> 
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    )
}