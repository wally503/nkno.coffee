import { Grid, Box, Card, Typography, CardContent, Tabs, Tab, Pagination } from "@mui/material";
import CardPageBodyLayout from "../components/CardPageBodyLayout";
import { getDailyBean, getLatestBean, getCurrentOpenBeans } from "../api/beansApi";
import BagProgressCard from "../components/BagProgressCard";
import * as React from "react";

import PageTitle from "../components/PageTitle";

export default function HomePage() {
    const [dailyBean, setDailyBean] = React.useState({});
    const [latestBean, setLatestBean] = React.useState({});
    const [openBeans, setOpenBeans] = React.useState([]);

    const PAGE_SIZES = { open: 3, sealed: 5 };

    const [tab, setTab] = React.useState("open");
    const [page, setPage] = React.useState(1);

    const visible = openBeans.filter(
        (b) => (b.opened_on ? "open" : "sealed") === tab
    );
    const pageSize = PAGE_SIZES[tab];
    const pageCount = Math.ceil(visible.length / pageSize);
    const pageItems = visible.slice((page - 1) * pageSize, page * pageSize);

    const handleTabChange = (_, newTab) => {
        setTab(newTab);
        setPage(1);
    };

    React.useEffect(() => {
        const load = async () => {
            const [daily, latest, currentOpen] = await Promise.all([
                getDailyBean(),
                getLatestBean(),
                getCurrentOpenBeans()
            ]);
            // console.log(daily.data);
            // console.log(latest.data);
            console.log('open bean results:', currentOpen.results);  // <-- here, after the data actually exists
            console.log('open bean response:', currentOpen);
            setDailyBean(daily.data);
            setLatestBean(latest.data);
            setOpenBeans(currentOpen.results);            
        };
        load().catch(console.error);

    },[]);

    return (
        <>
            <CardPageBodyLayout sx={{ justifyContent: 'top' }}>
                <PageTitle title={" Home"} marginBottom={2} marginTop={-4}/>
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    maxWidth: 1600,
                    mx: 'auto',
                    width: '100%',
                    alignItems: 'flex-start',
                    mt: -1,
                    mb: -2.5
                }}>
                    {/* Side panel */}
                    <Box sx={{
                        flex: '0 0 30%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        p: 2,
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 8,
                        height: 'calc(100vh - 170px)',
                    }}>
                        {/* Density Calendar — placeholder for now, needs a brew-count-per-day endpoint */}
                        <Box sx={{ flex: 1, minHeight: 0, border: '1px solid rgba(180, 140, 100, 0.5)', borderRadius: 2, p: 2 }}>
                            <Typography variant="h6">Brew Density</Typography>
                            <Typography variant="body2" color="text.secondary">Coming soon</Typography>
                        </Box>

                        {/* Undecided — empty allocated slot */}
                        <Box sx={{ flex: 1, minHeight: 0, border: '1px dashed rgba(180, 140, 100, 0.3)', borderRadius: 2, p: 2 }} />

                        {/* Today's Bean */}
                        <Box sx={{ flex: 1, minHeight: 0, border: '1px solid rgba(180, 140, 100, 0.5)', borderRadius: 2, p: 2 }}>
                            <Typography variant="h6">Today's Bean</Typography>
                            <Typography variant="body1">{dailyBean?.name ?? "—"}</Typography>
                            <Typography variant="body2" color="text.secondary">{dailyBean?.roaster__name ?? ""}</Typography>
                        </Box>
                    </Box>

                    {/* Cards */}
                    <Box sx={{
                        flex: '1 1 70%',
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',      // easy to delete by accident
                        gap: 3,
                        p: 2,
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 8,
                        height: 'calc(100vh - 170px)',
                    }}>
                        <Tabs sx={{ flexShrink: 0, minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0 } }}value={tab} onChange={handleTabChange}>
                            <Tab value="open" label="Open" />
                            <Tab value="sealed" label="Sealed" />
                        </Tabs>

                        <Box sx={{
                            flex: 1,
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start', 
                            gap: 1.6, 
                            overflow: 'hidden',
                        }}>
                            {pageItems.map((row) => (
                                <BagProgressCard key={row.short_id} beanData={row} />
                            ))}
                        </Box>
                        <Pagination
                            sx={{ mt: 'auto', alignSelf: 'center' }}
                            count={pageCount}
                            page={page}
                            onChange={(_, p) => setPage(p)}
                        />
                    </Box>
                </Box>
            </CardPageBodyLayout>
        </>
    )
};