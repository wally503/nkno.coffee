// src/constants/forms/drinksConfig.jsx
import { COFFEELOG_BASE } from './_base';

export const drinksConfig = {
  key: 'drink',
  label: 'Drink',
  labelPlural: 'Drinks',
  base: `${COFFEELOG_BASE}/drinks`,
  uriPath: 'drinks/',

  columns: [
    { 
      id: "drink", 
      label: "Drink Name", 
      minWidth: 150 
    },
    { 
      id: "roaster", 
      label: "Cafe / Roaster", 
      minWidth: 150 
    },
    { 
      id: "venue", 
      label: "Venue Cafe", 
      minWidth: 150 
    },
    {
      id: "bean",
      label: "Bean",
      minWidth: 85,
    },
    {
      id: "rating",
      label: "Rating",
      minWidth: 120,
    },
    {
      id: "drink_date",
      label: "Date Purchased",
      minWidth: 85,
      orderingField: "drink_date",
      render: (value) => value
        ? new Date(value).toLocaleDateString("en-CA")
        : "-",
    }
  ],
  fields:  [
    {
      type: "dropdown",
      name: "roaster",
      label: "Cafe / Roaster",
      required: true,
      size: { xs: 12, sm: 6, md: 6},
      optionSource: "roasters", 
    },
    {
      type: "dropdown",
      name: "venue",
      label: "Venue (if hosted elsewhere)",
      required: false,
      size: { xs: 12, sm: 6, md: 6 },
      optionSource: "roasters",
    },
    {
      type: "text",
      name: "drink",
      label: "Name Of Drink",
      required: true,
      size: { xs: 12, sm: 6, md: 6 }
    },
    {
      type: "dropdown",
      name: "bean",
      label: "Bean",
      required: false,
      size: { xs: 12, sm: 6, md: 6 },
      placeholder: "12",
      optionSource: "beans"
    },
    {
      type: "date",
      name: "drink_date",
      label: "Drink Date",
      required: true,
      size: { xs: 12, sm: 6, md: 6 },
      placeholder: "12",
    },
    {
      type: "long_text",
      name: "notes",
      label: "Notes / Comments",
      required: false,
      size: { xs: 12, sm: 12, md: 12 },
    },
    {
      type: "rating",
      name: "rating",
      label: "Rating",
      size: { xs: 12, sm: 4, md: 4 },
    },
  ],
};