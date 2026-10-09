// src/components/CloseBagDialog.jsx
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from "@mui/material";

// datetime-local wants "YYYY-MM-DDTHH:mm" in LOCAL time
const toLocalInput = (d) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export default function CloseBagDialog({ open, onClose, onConfirm }) {
  const [when, setWhen] = useState(toLocalInput(new Date()));
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    try {
      // new Date("YYYY-MM-DDTHH:mm") is parsed as local; toISOString sends UTC
      const closeDate = when != "" ? new Date(when).toISOString() : "";
      if (import.meta.env.DEV) {
        console.log("close date is: ", closeDate)
      }
      const res = await onConfirm(closeDate);
      onClose();
    } catch (err) {
      setError(typeof err === "string" ? err : JSON.stringify(err));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Close bag</DialogTitle>
      <DialogContent>
        <TextField type="datetime-local" value={when} sx={{ mt: 1 }}
          onChange={(e) => setWhen(e.target.value)} />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm}>Close bag</Button>
      </DialogActions>
    </Dialog>
  );
}