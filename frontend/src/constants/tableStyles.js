// src/constants/tableStyles.js

// RGB triplets, so the same tint can be used at different opacities.
const EVENT_TINTS = {
  opened:      "47, 102, 11",    // your existing green
  finished:    "102, 17, 11",    // your existing red
  frozen:      "56, 82, 111",    // matches the frozen blue on the stock bar
  thawed:      "57, 106, 117",   // matches the thawed teal
  transferred: "166, 124, 82",   // the app's brown
  merged:      "110, 84, 140",   // muted purple
};

export const eventRowSx = (kind, granularity) => {
  const tint = EVENT_TINTS[kind] ?? "120, 120, 120";
  return {
    backgroundColor: `rgba(${tint}, 0.22) !important`,
    color: "rgba(255, 252, 238, 0.97) !important",
    fontStyle: "italic",
    // Group (bulk) rows get a left accent bar so they read as the parent.
    ...(granularity === "bulk" ? { boxShadow: `inset 4px 0 0 rgba(${tint}, 0.9)` } : {}),
  };
};

export const BAG_EVENT_ROW_SX_OPEN = eventRowSx("opened");
export const BAG_EVENT_ROW_SX_CLOSE = eventRowSx("finished");

// Solid versions for text/dots inside the expanded child rows.
export const EVENT_ACCENT = {
  opened: "#7fb069",
  finished: "#d46a5f",
  frozen: "#6f93bd",
  thawed: "#6fb5c4",
  transferred: "#c9a27a",
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