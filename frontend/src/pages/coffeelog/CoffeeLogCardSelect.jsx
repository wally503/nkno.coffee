import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
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
            <Grid container spacing={4} alignItems="stretch">
                { coffeelogOptions.map((option) => (
                    <Grid item xs={12} sm={6} md={12} key={option.id}>
                        <LogTypeCard option={option} /> 
                    </Grid>
                ))}
            </Grid>
        </>
    )
}