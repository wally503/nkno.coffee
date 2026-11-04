// src/components/LotShortfallDialog.jsx
//
// Shown when a brew needs more than the chosen lot holds. Offers to split the brew:
// the chosen lot is drained and closed (as "Finished") and the rest comes from another
// lot of the same bean. `shortfall` is the server's { remaining, needed }; `candidates`
// are the other drawable lots of the bean; `onConfirm(lotId)` resubmits the brew with
// that lot as the second lot. Renders nothing when there's no shortfall.
import { useState } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography,
} from "@mui/material";

const HEADER_BROWN = "#2a211b";
const BORDER_BROWN = "rgba(166, 124, 82, 0.4)";

export default function LotShortfallDialog({ shortfall, candidates = [], onConfirm, onClose }) {
  const [lotId, setLotId] = useState("");
  if (!shortfall) return null;

  const remaining = Number(shortfall.remaining);
  const needed = Number(shortfall.needed);
  const rest = (needed - remaining).toFixed(2);
  const canSplit = remaining > 0 && candidates.length > 0;

  const close = () => { setLotId(""); onClose(); };

  return (
    <Dialog
      open
      onClose={close}
      maxWidth="xs"
      slotProps={{ paper: { sx: { width: 400, border: `1px solid ${BORDER_BROWN}`, backgroundImage: "none" } } }}
    >
      <DialogTitle sx={{ backgroundColor: HEADER_BROWN, color: "#f1e6d4", borderBottom: `1px solid ${BORDER_BROWN}` }}>
        Not enough in this lot
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ mt: 2 }}>
          That lot has {remaining.toFixed(2)} g, but this brew needs {needed.toFixed(2)} g.
        </Typography>
        {canSplit ? (
          <>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Use all {remaining.toFixed(2)} g from it (the lot will be closed as Finished) and take the
              other {rest} g from:
            </Typography>
            <TextField
              select
              fullWidth
              label="Other lot"
              value={lotId}
              onChange={(e) => setLotId(e.target.value)}
              sx={{ mt: 2 }}
            >
              {candidates.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label} · {c.remaining.toFixed(2)} g left
                </MenuItem>
              ))}
            </TextField>
          </>
        ) : (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {remaining <= 0
              ? 'That lot is empty. Use "Lot weight off?" to correct its weight, or brew from another lot.'
              : 'There is no other open lot for this bean. Use "Lot weight off?" to correct the weight, or open another lot first.'}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={close}>{canSplit ? "Cancel" : "Got it"}</Button>
        {canSplit && (
          <Button variant="contained" disabled={lotId === ""} onClick={() => { const id = lotId; setLotId(""); onConfirm(id); }}>
            Split brew
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
