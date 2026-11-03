import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { ACTION_BUTTON_SX } from "../../constants/tableStyles";
import Alert from "@mui/material/Alert";
import LotDateDialog from "./LotDateDialog";
import { thawLot, freezeLot, openLot, closeLot, fetchCloseReasons } from "../../api/lotActionsApi";

// What each state allows. Edit labels or add entries here and nowhere else.
const TRANSFER_MERGE = { label: "Transfer / Merge…", go: "rearrange" };
const CLOSE = {
  label: "Close", kind: "close",
  dialog: { title: "Close Lot", label: "Closed on", needsReason: true },
  run: (lot, date, reason) => closeLot(lot.id, date, reason),
};
const ACTIONS = {
  sealed: [
    { label: "Open", kind: "open", dialog: { title: "Open Lot",   label: "Opened On" },  run: (lot, date) => openLot(lot.id, date)},
    { label: "Freeze", kind: "freeze", dialog: { title: "Freeze Lot", label: "Frozen On" },  run: (lot, date) => freezeLot(lot.id, date) },
    TRANSFER_MERGE,
    CLOSE,
  ],
  frozen: [
    { label: "Thaw", kind: "thaw", dialog: { title: "Thaw Lot", label: "Thawed On" }, run: (lot, date) => thawLot(lot.id, date) },
    CLOSE,
  ],
  thawed: [
    { label: "Open", kind: "open", dialog: { title: "Open Lot", label: "Opened On" }, run: (lot, date) => openLot(lot.id, date) },
    TRANSFER_MERGE,
    CLOSE,
  ],
  open: [TRANSFER_MERGE, CLOSE],
};

export default function LotActions({ lot, onChange }) {
  const navigate = useNavigate();   
  
  const [anchor, setAnchor] = React.useState(null);
  const [error, setError] = React.useState("");
  const [pending, setPending] = useState(null); 
  const [dialogError, setDialogError] = useState("");
  const [reasons, setReasons] = useState([]);

  const items = ACTIONS[lot.state] ?? [];
  const limit = pending ? lot.earliest?.[pending.kind] : null;

  useEffect(() => {
    if (pending?.dialog.needsReason && reasons.length === 0) {
      fetchCloseReasons().then((result) => {
        if (result.ok) setReasons(result.data);
      });
    }
  }, [pending]);

  if (items.length === 0) return null;

  const handleItem = async (item) => {
    setAnchor(null);
    if (item.dialog) { setPending(item); return; }
    if (item.go) {
      navigate(`/bean-stock/${lot.bean_short_id}/rearrange?source=${lot.id}`);
      return;
    }
    const result = await item.run(lot);        // Thaw
    if (!result.ok) {
      setError(result.errors.join(" "));
      return;
    }
    setError("");
    onChange?.();
  };

  console.log("onChange:", onChange);
  // console.log("earliest:", lot.earliest, "kind:", pending?.kind, "limit:", limit);
  return (
    <div>
      <Button
        size="small"
        variant="text"
        endIcon={<ArrowDropDownIcon />}
        sx={{
            ...ACTION_BUTTON_SX,
            color: "#c9a27a",
            border: "1px solid rgba(166, 124, 82, 0.55)",
            borderRadius: "4px",
            "&:hover": {
                backgroundColor: "rgba(166, 124, 82, 0.18)",
                borderColor: "rgba(166, 124, 82, 0.9)",
            },
            ml: 2
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
          <MenuItem key={item.label} onClick={() => handleItem(item)}>
            {item.label}
          </MenuItem>
        ))}
        </Menu>
    {pending && (
        <LotDateDialog
            open
            title={pending.dialog.title}
            label={pending.dialog.label}
            minDateTime={limit?.at ?? null}
            minReason={limit?.reason ?? ""}
            reasons={pending.dialog.needsReason ? reasons : null}
            onConfirm={async (date, reason) => {
              const result = await pending.run(lot, date, reason);
                if (!result.ok) {
                    setDialogError(result.errors.join(" "));
                    return;               // stay open so the message is readable
                }
                setDialogError("");
                setPending(null);
                onChange?.();
            }}
            onClose={() => { setPending(null); setDialogError(""); }}
            error={dialogError}
        />
        )}
      {error && (
        <div style={{ fontSize: "0.75rem", color: "#c97a6a", marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
}