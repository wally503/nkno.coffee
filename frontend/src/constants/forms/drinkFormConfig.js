// src/constants/forms/drinkFieldConfig.js

export const drinkFieldConfig = [
  {
    type: "dropdown",
    name: "roaster_id",
    label: "Roaster",
    required: true,
    size: { xs: 12, sm: 6, md: 6},
    optionSource: "roasters",   // <-- key used to plug in options later
  },
  {
    type: "text",
    name: "drink_name",
    label: "Name Of Drink",
    required: true,
    size: { xs: 12, sm: 6, md: 6 },
    optionSource: "drinkName",
  },
  {
    type: "long_text",
    name: "notes",
    label: "Notes",
    required: false,
    size: { xs: 12, sm: 12, md: 12 },
    optionSource: "drinkNotes",
  },
  {
    type: "rating",
    name: "rating",
    label: "Rating",
    optionSource: "organicFlags",
  }
];