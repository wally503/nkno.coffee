// src/constants/config/brew/history/logConfig.js
import { ratingCustomIcons } from '../../../../components/RatingGridItem';
import TagCluster from '../../../../components/TagCluster'

// Maps BrewLog.style values to their route segment. cold_brew -> cold-brew
// (kebab in the URL, underscore in the model) is the one mismatch to remember.
export const STYLE_ROUTE_SEGMENT = {
  aeropress: 'aeropress',
  pourover: 'pourover',
  cold_brew: 'cold-brew',
  espresso: 'espresso',      // no route yet — mod kit pending
  milk_drink: 'milk-drink',  // no route yet — mod kit pending
};

const TAG_SIZE = 0.87 // 1 = full size, 0.75 is about compact, 0.65 is about dense

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
    label: "Bean",
    px: 0.3,
    minWidth: 140,
    orderingField: null, // BrewLogViewSet.ordering_fields doesn't include bean__name yet
  },
  {
    id: "style_display",
    label: "Style",
    minWidth: 85,
    orderingField: null, // ordering_fields doesn't include style yet
  },
  {
    id: "grinder_name",
    label: "Grinder",
    minWidth: 100,
    orderingField: null, // ordering_fields doesn't include style yet
  },
  {
    id: "grind_setting",
    label: "Setting",
    minWidth: 70,
    orderingField: null, // ordering_fields doesn't include style yet
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
    label: "Tags",
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

export const logConfig = { tableSettings: logTableSettings, tableColumns: logColumns }