// src/components/PageLayout.jsx
import { Box } from "@mui/material";
export default function DefaultBodyLayout({ children }) {
    return (
        <>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                px: 4,
                py: 4,
                width: "100%",
            }}>
                {children}
            </Box>
        </>
    );
}