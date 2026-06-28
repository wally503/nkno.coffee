import { Grid, Card, CardActionArea, CardContent, Container, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coffeelogOptionsRow1, coffeelogOptionsRow2 } from '../../routes/coffeeLogRoutes';
import CardPageBodyLayout from '../../components/CardPageBodyLayout';

export default function CoffeeLogSelect(){
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate();
    const coffeelogOptionRows = [coffeelogOptionsRow1, coffeelogOptionsRow2];

    const LogTypeCard = ({option}) => {
        return (
            <Card sx={{
                    border: '1px solid rgba(180, 140, 100, 0.5)',
                    transition: '0.2s',
                    height: 320, 
                    width: 340,
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
      <CardPageBodyLayout>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', maxWidth: 1200 }}>
          {[...coffeelogOptionsRow1, ...coffeelogOptionsRow2].map((option) => (
            <LogTypeCard key={option.id} option={option} />
          ))}
        </Box>
      </CardPageBodyLayout>
    </>

);
}