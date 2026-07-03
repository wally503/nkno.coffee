import { Grid, Box, Card, Typography, CardContent } from "@mui/material";
import CardPageBodyLayout from "../components/CardPageBodyLayout";
import { getDailyBean, getLatestBean } from "../api/beansApi";
import * as React from "react";

export default function HomePage() {
    const [dailyBean, setDailyBean] = React.useState({});
    const [latestBean, setLatestBean] = React.useState({});

    React.useEffect(() => {
        const load = async () => {
            const [daily, latest] = await Promise.all([
                getDailyBean(),
                getLatestBean()
            ]);
            console.log(daily.data);
            console.log(latest.data);


            setDailyBean(daily.data);
            setLatestBean(latest.data);
        };
        load().catch(console.error);
    },[]);

    return  (
        <>
            <CardPageBodyLayout>
                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', width: '100%' }}>
                    <Card id={latestBean['id']} sx={{
                            border: '1px solid rgba(180, 140, 100, 0.5)',
                            transition: '0.2s',
                            height: 'fit-content', 
                            width: '70%',
                            py: 20                         
                        }}> 
                        <Typography variant="h4" sx={{ py:3, textAlign:'Center'}}>
                            Latest Bean
                        </Typography>
                        <CardContent sx={{ textAlign:'Center', justifyContent: 'center'}}>
                            <Typography variant="h5">{latestBean['name']}</Typography>
                            <Typography variant="body2">{latestBean['roaster__name']}</Typography>
                            <Typography variant="body2">{latestBean['origin_country__name']}</Typography>
                        </CardContent>
                    </Card>            
                    <Card id={dailyBean['id']} sx={{
                            border: '1px solid rgba(180, 140, 100, 0.5)',
                            transition: '0.2s',
                            height: 'fit-content', 
                            width: '70%',
                            py: 20                         
                        }}> 
                        <Typography variant="h4" sx={{ py:3, textAlign:'Center'}}>
                            Bean of the Day
                        </Typography>
                        <CardContent sx={{ textAlign:'Center', justifyContent: 'center'}}>
                            <Typography variant="h5">{dailyBean['name']}</Typography>
                            <Typography variant="body2">{dailyBean['roaster__name']}</Typography>
                            <Typography variant="body2">{dailyBean['origin_country__name']}</Typography>
                        </CardContent>
                    </Card> 
                </Box>
            </CardPageBodyLayout>
        </>
    )
};