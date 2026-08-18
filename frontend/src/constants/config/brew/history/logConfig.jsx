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

export const logColumns = [
  {
    id: "date",
    label: "Date",
    minWidth: 100,
    orderingField: "date",
    render: (value) => value ? new Date(value).toLocaleDateString("en-CA") : "-",
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
    render: (value) =>
      ratingCustomIcons[value]?.icon ?? <span style={{ opacity: 0.3 }}>{ratingCustomIcons[3].icon}</span>,
  },
  {
    id: "pull_number",
    label: "Pull #",
    minWidth: 70,
    orderingField: "pull_number",
  },
];