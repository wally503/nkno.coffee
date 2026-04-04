// src/constants/forms/roasterFormConfig.js

export const roasterFieldConfig = [
  {
    type: "text",
    name: "name",
    label: "Roaster / Cafe Name",
    required: true,
    size: { xs: 12, sm: 6, md: 6 },
    placeholder: "Perkatory Coffee Roasters",
  },
  {
    type: "dropdown",
    name: "business_type",
    label: "Business Type",
    required: false,
    size: { xs: 12, sm: 6, md: 6 },
    optionSource: "businessTypes",
  },
  {
    type: "text",
    name: "address",
    label: "Address",
    required: false,
    size: { xs: 12 },
    placeholder: "123 Brew St",
  },
  {
    type: "text",
    name: "city",
    label: "City",
    required: false ,
    size: { xs: 12, sm: 4, md: 4 },
    placeholder: "New Haven",
  },
  {
    type: "text",
    name: "state_region",
    label: "State / Region",
    required: false,
    size: { xs: 12, sm: 4, md: 4 },
    placeholder: "Connecticut",
  },
  {
    type: "dropdown",
    name: "country",
    label: "Country",
    required: true,
    size: { xs: 12, sm: 4, md: 4 },
    optionSource: "countries",
  },
  {
    type: "text",
    name: "website",
    label: "Website",
    required: false,
    size: { xs: 12, sm: 6, md: 6 },
    placeholder: "https://perkatorycoffee.com",
  },
  {
    type: "text",
    name: "social",
    label: "Social Link",
    required: false,
    size: { xs: 12, sm: 6, md: 6 },
    placeholder: "https://instagram.com/perkatorycoffee",
  },
  {
    type: "text",
    name: "notes",
    label: "Notes",
    required: false,
    size: { xs: 12 },
    placeholder: "Personal notes about the roaster/cafe",
  },
];




export const ROASTERFORM_STATIC_OPTIONS = {
  businessTypes: [
    { label: "Roaster", value: "roaster" },
    { label: "Cafe", value: "cafe" },
    { label: "Roaster/Cafe", value: "roaster_cafe" },
  ],
};

export const roasterFormBeansTableFieldsConfig = [
  { 
    id: "name", 
    label: "Bean Name", 
    minWidth: 150 
  },
  {
    id: "origin_country",
    label: "Roast Origin",
    minWidth: 120,
  },
  {
    id: "organic_or_not",
    label: "Organic",
    minWidth: 85,
  },
  {
    id: "washing_style",
    label: "Washed",
    minWidth: 85,
  },
  {
    id: "elevation",
    label: "Elevation",
    minWidth: 100,
  },
  {
    id: "flavor_notes",
    label: "Notes",
    minWidth: 180,
  },
  {
    id: "roast_date",
    label: "Roast Date",
    minWidth: 180,
  },
  {
    id: "purchase_date",
    label: "Purchase Date",
    minWidth: 180,
  }
];