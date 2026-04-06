// src/constants/forms/drinkFieldConfig.js

export const drinkFieldConfig = [
  {
    type: "dropdown",
    name: "roaster",
    label: "Roaster",
    required: true,
    size: { xs: 12, sm: 6, md: 6},
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
    type: "date",
    name: "drink_date",
    label: "Drink Date",
    required: true,
    size: { xs: 12, sm: 6, md: 6 },
    placeholder: "12",
  },
  {
    type: "rating",
    name: "rating",
    label: "Rating",
    size: { xs: 12, sm: 6, md: 6 },
  },
  {
    type: "long_text",
    name: "notes",
    label: "Notes",
    required: false,
    size: { xs: 12, sm: 12, md: 12 },
  }
];