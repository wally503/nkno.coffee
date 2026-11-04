// src/components/CloseLotPrompt.jsx
//
// Shown right after a new brew is saved when the lot it drew from is nearly empty.
// `prompt` is the server's close_prompt ({ lot_id, label, remaining }) plus the brew's
// `date`, which is the default close time. Renders nothing when there's no prompt.
// Closing uses the same lot-close endpoint as Bean Stock, with "Finished" preselected.
import { useEffect, useState } from "react";
import { closeLot, fetchCloseReasons } from "../api/lotActionsApi";
import LotDateDialog from "./table/LotDateDialog";

export default function CloseLotPrompt({ prompt, onDone }) {
  const [reasons, setReasons] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!prompt || reasons !== null) return;
    fetchCloseReasons().then((result) => setReasons(result.ok ? result.data : []));
  }, [prompt, reasons]);

  // wait for the reasons so the dialog mounts with "Finished" already selected
  if (!prompt || reasons === null) return null;

  const done = () => { setError(""); onDone(); };
  const finished = reasons.find((r) => r.name === "Finished");

  return (
    <LotDateDialog
      open
      title="Close this lot?"
      label="Closed on"
      message={`${prompt.label} has ${prompt.remaining} g left. Close it now?`}
      confirmLabel="Close lot"
      cancelLabel="Not yet"
      reasons={reasons}
      initialReason={finished?.id}
      initialWhen={prompt.date}
      error={error}
      onClose={done}
      onConfirm={async (when, reason) => {
        const result = await closeLot(prompt.lot_id, when, reason);
        if (!result.ok) { setError(result.errors.join(" ")); return; }
        done();
      }}
    />
  );
}
