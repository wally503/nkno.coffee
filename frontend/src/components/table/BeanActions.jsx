// src/components/table/BeanActions.jsx
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { beansConfig } from "../../constants/config/coffeelog/beans/beansConfig";
import { ACTION_BUTTON_SX } from "../../constants/tableStyles";

export default function BeanActions({ row }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Button
      size="small"
      variant="outlined"
      sx={{
        ...ACTION_BUTTON_SX,
        color: "#f1e6d4",
        borderColor: "rgba(241, 230, 212, 0.5)",
        "&:hover": {
            backgroundColor: "rgba(241, 230, 212, 0.12)",
            borderColor: "rgba(241, 230, 212, 0.85)",
        },
    }}
      onClick={(event) => {
        event.stopPropagation();
        navigate(`${beansConfig.base}/view/${row.short_id}`, {
          state: { backRoute: location.pathname },
        });
      }}
    >
      View
    </Button>
  );
}