// src/constants/config/brew/history/logConfig.js
import { ratingCustomIcons } from '../../../../components/RatingGridItem';

// Maps BrewLog.style values to their route segment. cold_brew -> cold-brew
// (kebab in the URL, underscore in the model) is the one mismatch to remember.
export const STYLE_ROUTE_SEGMENT = {
  aeropress: 'aeropress',
  pourover: 'pourover',
  cold_brew: 'cold-brew',
  espresso: 'espresso',      // no route yet — mod kit pending
  milk_drink: 'milk-drink',  // no route yet — mod kit pending
};

export const BAG_EVENT_ROW_SX = {
  backgroundColor: 'rgba(81, 81, 81, 0.43) !important',
  color: 'rgba(255, 252, 238, 0.97) !important',
  fontStyle: 'italic',
};

export const logColumns = [
  {
    id: "date",
    label: "Date",
    minWidth: 180,
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
    minWidth: 180,
    orderingField: null, // BrewLogViewSet.ordering_fields doesn't include bean__name yet
  },
  {
    id: "style_display",
    label: "Style",
    minWidth: 140,
    orderingField: null, // ordering_fields doesn't include style yet
  },
  {
    id: "extraction_rating",
    label: "Rating",
    minWidth: 90,
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
    id: "pull_number",
    label: "Pull #",
    minWidth: 100,
    orderingField: "pull_number",
  },
  // {
  //   id: "days_since_roast",
  //   label: "Days Since Roast",
  //   minWidth: 70,
  //   orderingField: null,
  // },
  {
    id: "days_since_opened",
    label: "Days Since Opened",
    minWidth: 70,
    orderingField: null,
  },
];