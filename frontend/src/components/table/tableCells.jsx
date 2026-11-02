import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ratingCustomIcons } from "../RatingGridItem";
import BeanActions from "./BeanActions";

const STATE_COLORS = {
  frozen: "#324a68",
  thawed: "#335f69",
  open: "#486634",
  sealed: "#5c554b",
};

export function TextCell({ value }) {
  return value ?? "-";
}

export function NumberCell({ value, column }) {
  if (value === null || value === undefined) return "-";
  return column.format ? column.format(value) : value;
}

export function DateCell({ value }) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-CA");
}

export function DateTimeCell({ value }) {
  if (!value) return "-";
  return new Date(value)
    .toLocaleString("en-CA", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    })
    .replace(",", "");
}

export function RatingCell({ value }) {
  return (
    ratingCustomIcons[value]?.icon ??
    <span style={{ opacity: 0.3 }}>{ratingCustomIcons[3].icon}</span>
  );
}

export function ExpanderCell({ ctx }) {
  return (
    <IconButton
      size="small"
      onClick={(event) => {
        event.stopPropagation();   // don't trigger the row's navigate
        ctx.toggle();
      }}
    >
      {ctx.open
        ? <KeyboardArrowDownIcon fontSize="small" />
        : <KeyboardArrowRightIcon fontSize="small" />}
    </IconButton>
  );
}

// value = the bean's lots: [{ id, state, vessel_label, stored_weight, remaining_weight }]
export function StateBarCell({ value, height = 16 }) {
  const lots = value ?? [];
  let totalStored = 0;
  for (const lot of lots) {
    totalStored += Number(lot.stored_weight);
  }
  if (totalStored === 0) return "-";

  return (
    <Box
      sx={{
        display: "flex",
        gap: "2px",
        width: "100%",
        height,
        borderRadius: `${height / 2}px`,
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.55)",
      }}
    >
      {lots.map((lot) => {
        const stored = Number(lot.stored_weight);
        const remaining = Number(lot.remaining_weight);
        const fillPct = stored > 0 ? Math.min(100, (remaining / stored) * 100) : 0;
        const color = STATE_COLORS[lot.state] ?? STATE_COLORS.sealed;
        return (
          <Tooltip
            key={lot.id}
            title={`${lot.vessel_label} · ${titleCase(lot.state)} · ${remaining}g / ${stored}g`}
          >
            <Box
              sx={{
                flexGrow: stored,
                flexBasis: 0,
                height: "100%",
                backgroundColor: "#3a3a3a",
              }}
            >
              <Box sx={{ width: `${fillPct}%`, height: "100%", backgroundColor: color }} />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}

const CELLS = {
  text: TextCell,
  number: NumberCell,
  date: DateCell,
  datetime: DateTimeCell,
  rating: RatingCell,
  expander: ExpanderCell,
  stateBar: StateBarCell,
  actions: BeanActions,
};

export function cellFor(type) {
  return CELLS[type] ?? TextCell;
}

export const titleCase = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;