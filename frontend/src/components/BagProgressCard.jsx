// src/components/BagProgressCard.jsx

import { Box, Typography, Divider } from "@mui/material";
import BagProgressBar from "./BagProgressBar";

export default function BagProgressCard({beanData}){
    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.75,
                p: 1.5,
                border: '1px solid rgba(180, 140, 100, 0.5)',
                borderRadius: 7,
            }}>
                {/* Bean / Roaster / Roast Type  row */}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: -.4 }}>
                    <Typography variant="homeCardBeanName">
                        {beanData.bean_name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>{beanData.roaster_name}</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="homeCardFieldValue">
                        {beanData.roast_level_display ? `${beanData.roast_level_display} Roast` : "Unknown Roast"}
                        {beanData.is_decaf && (
                            <Typography component="span" variant="body2" sx={{ color: 'text.disabled', ml: 0.5 }}>
                                (Decaf)
                            </Typography>
                        )}
                    </Typography>
                </Box>

                {/* Origin / Flavor Notes row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, ml: 0, mr: 0, my: -1, mb: 0}}>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.disabled', fontStyle: 'italic' }}
                    >
                        {beanData.origin_country_name ?? "Blend or Country Not Mentioned"}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.disabled', fontStyle: 'italic' }}
                    >
                        {beanData.flavor_notes?.length ? beanData.flavor_notes.join(', ') : "N/A"}
                    </Typography>
                </Box>

                <Divider sx={{ width: '98%', mx: 'auto', opacity: 0.3, my: 0 }} />

                {/* Roasted On / Opened On row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1, mr: 1, mb: -1 }}>
                    <Typography variant="homeCardFieldLabel">
                        Roasted:
                    </Typography>
                    <Typography variant="homeCardFieldValue">
                        { beanData.roasted_on ?? "N/A" }{ beanData.roasted_days_ago != null ? ` (${beanData.roasted_days_ago} days ago)` : "" }    
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="homeCardFieldLabel">
                        Opened:
                    </Typography>
                    <Typography variant="homeCardFieldValue">
                        { beanData.opened_on ?? "Not Yet Opened" }{ beanData.opened_days_ago != null ? ` (${beanData.opened_days_ago} days ago)` : "" }
                    </Typography>
                </Box>

                {/* If we dont have open data, we're gonna trim the rest until it is */}

                { beanData.opened_on && (
                    <>
                        {/* Grind row */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', ml: 1, mr: 1, my: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography variant="homeCardFieldLabel">
                                    Espresso Grind(s):
                                </Typography>
                                <Typography variant="homeCardFieldValue">
                                    {beanData.espresso_grind}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography variant="homeCardFieldLabel">
                                    Pourover Grind(s):
                                </Typography>
                                <Typography variant="homeCardFieldValue">
                                    {beanData.pourover_grind}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography variant="homeCardFieldLabel">
                                    Aeropress Grind(s):
                                </Typography>
                                <Typography variant="homeCardFieldValue">
                                    {beanData.aeropress_grind}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ width: '98%', mx: 'auto', opacity: 0.3, my: 0 }} />

                        {/* Progress bar row */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1, mb: 0}}>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <BagProgressBar progValue={ beanData.percent_remaining } />
                            </Box>
                            <Box sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                                <Typography variant="base1" sx={{ color: 'text.disabled', fontStyle: 'italic'}}>
                                    { beanData.remaining_weight } / { beanData.total_weight }g remaining
                                </Typography>
                                <br/>
                                <Typography variant="base1" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                                    { (beanData.percent_remaining).toFixed(1)  }% remaining
                                </Typography>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </>     
    )
}