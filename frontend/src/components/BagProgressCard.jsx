// src/components/BagProgressCard.jsx

import { Grid, Box, Card, Typography, CardContent } from "@mui/material";
import BagProgressBar from "./BagProgressBar";

export default function BagProgressCard(){
    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 2,
                border: '1px solid rgba(180, 140, 100, 0.5)',
                borderRadius: 7,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2.5 }}>
                    <Typography variant="h5">
                        {"Bean Name"}
                    </Typography>
                    <Typography variant="h5">
                        {"-"}
                    </Typography>
                    <Typography variant="h5">
                        {"Roaster"}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                        {"Light Roast"}{" "}
                        {true && (
                            <Typography component="span" variant="body2" sx={{ color: 'text.disabled' }}>
                                {"(Decaf)"}
                            </Typography>
                        )}
                    </Typography>
                </Box>

                {/* Roasted On / Opened On row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, ml: 2, mr: 10 }}>
                    <Typography variant="h6">
                        Roasted On:
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        { "Date Date" } ({"#"} days ago)
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="h6">
                        Opened On:
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        { "Date Date" } ({"#"} days ago)
                    </Typography>
                </Box>

                {/* Grind row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', ml: 5, mr: 20 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                        <Typography variant="base1">
                            Espresso Grind:
                        </Typography>
                        <Typography variant="base1" color="text.secondary">
                            {"min"} - {"max"}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                        <Typography variant="base1">
                            Pourover Grind:
                        </Typography>
                        <Typography variant="base1" color="text.secondary">
                            {"min"} - {"max"}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                        <Typography variant="base1">
                            Aeropress Grind:
                        </Typography>
                        <Typography variant="base1" color="text.secondary">
                            {"min"} - {"max"}
                        </Typography>
                    </Box>
                </Box>

                {/* Progress bar row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2, mb: 2 }}>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <BagProgressBar />
                    </Box>
                    <Box sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                        <Typography variant="base1" color="text.secondary">
                            {"200"}/{"300"}g remaining
                        </Typography>
                        <br/>
                        <Typography variant="base1" color="text.secondary">
                            {"30"}% remaining
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>     
    )
}