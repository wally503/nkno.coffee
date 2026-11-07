// src/constants/config/brew/history/logConfig.js
import { ratingCustomIcons } from '../../../../components/RatingGridItem';
import TagCluster from '../../../../components/TagCluster'
import { EVENT_ACCENT, eventTintKey } from "../../../tableStyles"; 

// Maps BrewLog.style values to their route segment. cold_brew -> cold-brew
// (kebab in the URL, underscore in the model) is the one mismatch to remember.
export const STYLE_ROUTE_SEGMENT = {
  aeropress: 'aeropress',
  pourover: 'pourover',
  cold_brew: 'cold-brew',
  espresso: 'espresso',
  cupping: 'cupping',
  milk_drink: 'milk-drink',  // no route yet — mod kit pending
};

const TAG_SIZE = 0.87 // 1 = full size, 0.75 is about compact, 0.65 is about dense

const formatLogDate = (value) => value
  ? new Date(value).toLocaleString("en-CA", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).replace(",", "")
  : "-";

export const logChildCells = {
  date: (child) => formatLogDate(child.date),
  bean_name: (child) => child.summary,
  style_display: (child) => (
    <span style={{ color: EVENT_ACCENT[eventTintKey(child.event_type, "lot")] }}>
      ● {child.event_type_display}
    </span>
  ),
};

export const logTableSettings = { 
      width: "93%", 
      maxWidth: 1800, 
      cellPx: 2,
      cellPy: 2, 
  }
export const logColumns = [
  {
    id: "date",
    label: "Date",
    minWidth: 120,
    orderingField: "date",
    render: (value) => value
      ? new Date(value).toLocaleString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).replace(",", "")
      : "-",
  },
  {
    id: "bean_name",
    label: "Bean & Roaster",
    px: 0.3,
    minWidth: 180,
    orderingField: null, 
    render: (value, row) => (row.roaster_name && row.roaster_name !== '-'
      ? (
        <>
          <div>{value}</div>
          <div style={{ fontSize: "0.8em", opacity: 0.8 }}>{row.roaster_name}</div>
        </>
      ): value
    ),

  },
  {
    id: "style_display",
    label: "Brew Style / Bag Event",
    minWidth: 90,
    orderingField: null, 
    // Single-lot events also say which lot they were about, under the label.
    render: (value, row) => (row.style === "bag_event" && row.lot_label
      ? (
        <>
          <div>{value}</div>
          <div style={{ fontSize: "0.8em", opacity: 0.8 }}>{row.lot_label}</div>
        </>
      )
      : value),
  },
  // {
  //   id: "grinder_name",
  //   label: "Grinder",
  //   minWidth: 100,
  //   orderingField: null,
  // },
  {
    id: "grind_setting",
    label: "Setting & Grinder",
    minWidth: 70,
    orderingField: null,
    render: (value, row) => {
      if (row.style === "bag_event") {
        return <span style={{ opacity: 0.6 }}>{'-'}</span>;
      }
      return (
         <>
          <div>{value}</div>
          <div style={{ fontSize: "0.8em", opacity: 0.8 }}>{row.grinder_name}</div>
        </>
      );
    },
  },
  {
    id: "extraction_rating",
    label: "Rating",
    minWidth: 60,
    orderingField: "extraction_rating",
    render: (value, row) => {
      if (row.style === "bag_event") {
        return (
          <span style={{ opacity: 1, fontStyle: "italic" }}>
            {/* {row.event_type === "opened" ? "Opened" : "Finished"} */}
            {'-'}
          </span>
        );
      }
      return ratingCustomIcons[value]?.icon ?? <span style={{ opacity: 0.3 }}>{ratingCustomIcons[3].icon}</span>;
    },
  },
  {
    id: "tags",
    label: "Note Tags",
    minWidth: 200,
    render: (value, row) => {
      const tags = row.tags ?? [];
      if (row.style === "bag_event" || tags.length === 0) {
        return <span style={{ opacity: 0.6 }}>{'-'}</span>;
      }
      return <TagCluster tags={tags} density={TAG_SIZE} palette="table" />;
    },
  },
  {
    id: "pull_number",
    label: "Pull #",
    minWidth: 73,
    orderingField: "pull_number",
  },
  {
    id: "days_since_roast",
    label: "Days Since Roast",
    minWidth: 70,
    orderingField: null,
  },
  {
    id: "days_since_opened",
    label: "Days Since Opened",
    minWidth: 70,
    orderingField: null,
  },
];

export const logConfig = {
  tableSettings: logTableSettings,
  tableColumns: logColumns,
  childCells: logChildCells,
};