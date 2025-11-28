// src/constants/forms/beansFormConfig.js

export const beansFieldConfig = [
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
    label: "Washed or Not",
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
    type: "text",
    name: "bean_name",
    label: "Beans Name",
    required: true,
    size: { xs: 12 },
    placeholder: "Name of Beans",
  },
];