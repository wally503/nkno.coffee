// src/constants/forms/beansFormConfig.js

export const beansFieldConfig = [
  {
    type: "text",
    name: "name",
    label: "Beans Name",
    required: true,
    size: { xs: 12 },
    placeholder: "Name of Beans",
  },
  {
    type: "dropdown",
    name: "roaster",
    label: "Roaster",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "roasters", 
  },
  {
    type: "dropdown",
    name: "origin_country",
    label: "Country of Origin",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "countries",
  },
  {
    type: "dropdown",
    name: "roast_level",
    label: "Roast Level",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "roastLevels",
  },
  {
    type: "dropdown",
    name: "caff_or_decaf",
    label: "Caffeinated or Decaffeinated",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "caffeineFlags",
  },
  {
    type: "dropdown",
    name: "organic_or_not",
    label: "Organic or Not",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "organicFlags",
  },
  {
    type: "dropdown",
    name: "washing_style",
    label: "Process",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "processTypes",
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
    name: "min_elevation",
    label: "Minimum Elevation (in MASL)",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    placeholder: "1800",
  },
  {
    type: "long_text",
    name: "comments",
    label: "Comments on Bean",
    required: false,
    size: { xs: 12, sm: 12, md: 12 },
    placeholder: "Personal notes about the beans",
  },
  {
    type: "divider",
  },
  {
    type: "dynamic_dropdown",
    name: "flavor_notes",
    label: "Flavor Notes",
    required: false,
    optionSource: "notes"
    // size: { xs: 12, sm: 4, md: 4 },
    // placeholder: "",
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

export const BEANFORM_STATIC_OPTIONS = {
  roastLevels: [
    { label: "Light", value: "light" },
    { label: "Light-Medium", value: "light_medium" },
    { label: "Medium", value: "medium" },
    { label: "Medium-Dark", value: "medium_dark" },
    { label: "Dark", value: "dark" },
  ],
  organicFlags: [
    { label: "Organic", value: 'organic' },
    { label: "Non-organic", value: 'not_organic' },
  ],
processTypes: [
    { label: "Washed", value: "washed" },
    { label: "Natural", value: "natural" },
    { label: "Anaerobic Natural", value: "anaerobic_natural" },
    { label: "Anaerobic Washed", value: "anaerobic_washed" },
    { label: "Honey", value: "honey" },
    { label: "Washed & Natural", value: "washed_natural" },
  ],
  caffeineFlags: [
    { label: "Caffeinated", value: 'caffeinated' },
    { label: "Decaffeinated", value: 'decaffeinated' },
  ],
};

