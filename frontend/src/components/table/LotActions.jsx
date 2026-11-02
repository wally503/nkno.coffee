import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { thawLot, freezeLot, openLot } from "../../api/lotActionsApi";
import { useNavigate } from "react-router-dom";

// What each state allows. Edit labels or add entries here and nowhere else.
const ACTIONS = {
  sealed: [
    { label: "Open", run: openLot },
    { label: "Freeze", run: freezeLot },
    { label: "Transfer…", go: "transfer" },
  ],
  frozen: [
    { label: "Thaw", run: thawLot },
  ],
  thawed: [
    { label: "Open", run: openLot },
    { label: "Transfer…", go: "transfer" },
    { label: "Merge…", go: "merge", needsPartner: true },
  ],
  open: [
    { label: "Transfer…", go: "transfer" },
    { label: "Merge…", go: "merge", needsPartner: true },
  ],
};

export default function LotActions({ lot, onChange }) {
  const navigate = useNavigate();
  const [anchor, setAnchor] = React.useState(null);
  const [error, setError] = React.useState("");
  const items = ACTIONS[lot.state] ?? [];

  if (items.length === 0) return null;

  const runAction = async (run) => {
    setAnchor(null);
    const result = await run(lot.id);
    if (!result.ok) {
      setError(result.errors.join(" "));
      return;
    }
    setError("");
    onChange?.();
  };

  return (
    <div>
      <Button
        size="small"
        variant="text"
        endIcon={<ArrowDropDownIcon />}
        sx={{
        minWidth: 0, px: 1, py: 0, fontSize: "0.8rem", textTransform: "none",
        color: "#d0b79ee2",
        border: "1px solid rgba(166, 124, 82, 0.55)",
        borderRadius: "4px",
        "&:hover": {
            backgroundColor: "rgba(166, 124, 82, 0.18)",
            borderColor: "rgba(166, 124, 82, 0.9)",
        },
        }}
        onClick={(event) => { event.stopPropagation(); setAnchor(event.currentTarget); }}
      >
        Actions
      </Button>
        <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{
            paper: {
            sx: {
                backgroundColor: "#2a211b",
                border: "1px solid rgba(166, 124, 82, 0.4)",
                backgroundImage: "none",
            },
            },
        }}
        >
        {items.map((item) => (
            <MenuItem
            key={item.label}
            onClick={() => {
                if (item.go) {
                setAnchor(null);
                navigate(`/bean-stock/${lot.bean_short_id}/rearrange?source=${lot.id}&mode=${item.go}`);
                return;
                }
                runAction(item.run);
            }}
            >
            {item.label}
            </MenuItem>
        ))}
        </Menu>
      {error && (
        <div style={{ fontSize: "0.75rem", color: "#c97a6a", marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
}