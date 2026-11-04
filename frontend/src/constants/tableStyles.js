// src/constants/tableStyles.js

// RGB triplets, so the same tint can be used at different opacities.
const EVENT_TINTS = {
  opened:      "47, 102, 11",    // green
  finished:    "102, 17, 11",    // red: a whole bag finished
  closed:      "176, 112, 48",   // amber: one lot closed (its own colour, like thawed has)
  frozen:      "56, 82, 111",    // matches the frozen blue on the stock bar
  thawed:      "57, 106, 117",   // matches the thawed teal
  adjusted:    "150, 132, 56",   // muted gold: a lot's weight was corrected
  transferred: "166, 124, 82",   // the app's brown
  merged:      "110, 84, 140",   // muted purple
};

// A lot close and a bag finish are both the "finished" event kind but get different
// colours: tint by (kind, level). `level` is "lot" or "bag", from the log row.
export const eventTintKey = (kind, level) =>
  (level === "lot" && kind === "finished" ? "closed" : kind);

export const eventRowSx = (kind, granularity, level) => {
  const tint = EVENT_TINTS[eventTintKey(kind, level)] ?? "120, 120, 120";
  return {
    backgroundColor: `rgba(${tint}, 0.27) !important`,
    color: "rgba(255, 252, 238, 0.97) !important",
    fontStyle: "italic",
    // Group (bulk) rows get a left accent bar so they read as the parent.
    ...(granularity === "bulk" ? { boxShadow: `inset 4px 0 0 rgba(${tint}, 0.9)` } : {}),
  };
};

// Old two-colour constants. Nothing in the patched files uses them any more;
// delete once `grep -rn BAG_EVENT_ROW_SX src` shows no imports.
export const BAG_EVENT_ROW_SX_OPEN = eventRowSx("opened");
export const BAG_EVENT_ROW_SX_CLOSE = eventRowSx("finished");

// Solid versions for text/dots inside the expanded child rows.
export const EVENT_ACCENT = {
  opened: "#7fb069",
  finished: "#d46a5f",
  closed: "#b0772c",
  frozen: "#6f93bd",
  thawed: "#6fb5c4",
  adjusted: "#c9b458",
  transferred: "#9f77be",
  merged: "#a58bc7",
};

export const ACTION_BUTTON_SX = {
  width: 84,
  minWidth: 84,
  height: 24,
  py: 0,
  px: 1,
  fontSize: "0.75rem",
  lineHeight: 1,
  textTransform: "none",
  "& .MuiButton-endIcon": { ml: 0 },
};