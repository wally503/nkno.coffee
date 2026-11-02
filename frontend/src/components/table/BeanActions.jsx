import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function BeanActions({ row }) {
  const navigate = useNavigate();
  return (
    <Button
      size="small"
      variant="outlined"
      onClick={(event) => {
        event.stopPropagation();
        navigate(`/bean-stock/${row.short_id}`);
      }}
    >
      View
    </Button>
  );
}