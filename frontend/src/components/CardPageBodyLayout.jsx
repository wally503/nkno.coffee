// src/components/PageLayout.jsx
import { Box } from "@mui/material";
export default function CardPageBodyLayout({ children, showBack = false }) {
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
                {showBack && <BackCard />}
                {children}
            </Box>
        </>
    );
}

function BackCard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // strip trailing slash, drop last segment
  const parent = pathname.replace(/\/$/, '').split('/').slice(0, -1).join('/');

  return (
    <Card onClick={() => navigate(parent || '/')} sx={{ /* slim styling later */ }}>
      {'<'}
    </Card>
  );
}