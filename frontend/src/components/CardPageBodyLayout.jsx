// src/components/PageLayout.jsx
import { Box } from "@mui/material";
export default function CardPageBodyLayout({ children }) {
    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                px: 4,
                py: 4,
                width: "100%",
                height: 'calc(100vh - 69px)',
            }}>
                {children}
            </Box>
        </>
    );
}