// src/constants/forms/beansFormConfig.js

export const beansFieldConfig = [
  {
    type: "text",
    name: "bean_name",
    label: "Beans Name",
    required: true,
    size: { xs: 12 },
    placeholder: "Name of Beans",
  },
  {
    type: "dropdown",
    name: "roaster_id",
    label: "Roaster",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "roasters",   // <-- key used to plug in options later
  },
  {
    type: "dropdown",
    name: "country_id",
    label: "Country of Origin",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "countries",
  },
  {
    type: "dropdown",
    name: "roast_level",
    label: "Roast Level",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "roastLevels",
  },
  {
    type: "dropdown",
    name: "is_organic",
    label: "Organic",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "organicFlags",
  },
  {
    type: "dropdown",
    name: "process",
    label: "Washed/Natural",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "processTypes",
  },
  {
    type: "dropdown",
    name: "is_caffeinated",
    label: "Caffeinated or Decaffeinated",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "caffeineFlags",
  },
  {
    type: "date",
    name: "roast_date",
    label: "Roast Date",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    placeholder: "12",
  },
  {
    type: "text",
    name: "elevation_min",
    label: "Minimum Elevation (in MASL)",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    placeholder: "1800",
  },
  {
    type: "text",
    name: "elevation_max",
    label: "Maximum Elevation (in MASL)",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    placeholder: "3000",
  },  
  {
    type: "divider",
  },
];


export const flavorNoteModel = {
  mainLabel: "Add Flavor Note",
  options: [
    { label: "Chocolate", value: "chocolate" },
    { label: "Citrus", value: "citrus" },
    { label: "Berry", value: "berry" },
    { label: "Caramel", value: "caramel" },
    { label: "Floral", value: "floral" },
  ],
};