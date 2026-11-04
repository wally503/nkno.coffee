// src/components/LotCorrectionGridItem.jsx
//
// Optional "the lot's recorded weight is off" correction, shown under the lot picker.
// Collapsed to a small link by default so it never gets in the way. Add mode only,
// and only once a lot is chosen. Filling it sets the lot's remaining weight to this
// number before the brew's dose is taken (the server logs it as an ADJUSTED event).
import { useState } from "react";
import { Grid, Link, TextField } from "@mui/material";

export default function LotCorrectionGridItem({ item, value, onChange, mode, hasLot }) {
  const [expanded, setExpanded] = useState(false);

  if (mode !== "add" || !hasLot) return null;

  const showField = expanded || (value !== undefined && value !== null && value !== "");

  return (
    <Grid size={item.size || { xs: 12 }}>
      {showField ? (
        <>
          <TextField
            fullWidth
            type="number"
            label="Actual weight left in the lot before this brew (g)"
            value={value ?? ""}
            onChange={(e) => onChange(item.name, e.target.value)}
            helperText="Leave empty to keep the recorded weight. A correction is logged."
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
          <Link
            component="button"
            type="button"
            underline="hover"
            variant="body2"
            sx={{ mt: 0.5 }}
            onClick={() => { onChange(item.name, ""); setExpanded(false); }}
          >
            Never mind
          </Link>
        </>
      ) : (
        <Link component="button" type="button" underline="hover" variant="body2" onClick={() => setExpanded(true)}>
          Lot weight off?
        </Link>
      )}
    </Grid>
  );
}
