import { useState } from "react";
import dayjs from "dayjs";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const HEADER_BROWN = "#2a211b";
const BORDER_BROWN = "rgba(166, 124, 82, 0.4)";

export default function LotDateDialog({
  open,
  title,
  label,
  error,
  minDateTime,
  minReason,
  reasons,
  onConfirm,
  onClose,
}) {
  const [when, setWhen] = useState(dayjs());
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const needsReason = Array.isArray(reasons);
  const valid = when && when.isValid();

  const handleConfirm = async () => {
    if (!valid) return;
    setBusy(true);
    try {
      await onConfirm(when.toISOString(), reason);
    } finally {
      setBusy(false);
    }
  };

  const helperText = minDateTime
    ? `Can't be before it was ${String(minReason).toLowerCase()} on ${dayjs(minDateTime).format("MMM D, YYYY HH:mm")}`
    : undefined;
  console.log("reasons prop:", reasons)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            width: 360,
            border: `1px solid ${BORDER_BROWN}`,
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: HEADER_BROWN,
          color: "#f1e6d4",
          borderBottom: `1px solid ${BORDER_BROWN}`,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {needsReason && (
          <TextField
            select
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {reasons.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        <DateTimePicker
          open={pickerOpen}
          onOpen={() => setPickerOpen(true)}
          onClose={() => setPickerOpen(false)}
          ampm={false}
          format="MM/DD/YYYY HH:mm"
          label={label}
          value={when}
          disableFuture
          minDateTime={minDateTime ? dayjs(minDateTime) : undefined}
          onChange={(val) => setWhen(val)}
          slotProps={{
            textField: {
              fullWidth: true,
              onClick: () => setPickerOpen(true),
              helperText,
              sx: {
                mt: 2,
                cursor: "pointer",
                "& fieldset": { borderColor: "rgba(180, 140, 100, 0.5)" },
              },
            },
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={busy || !valid || (needsReason && !reason)}
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}