export const defaultBeansTableColumns = [
  { 
    id: "name", 
    label: "Bean Name", 
    minWidth: 220 
  },
  { 
    id: "roaster", 
    label: "Roaster", 
    minWidth: 120,
    orderingField: "roaster__name"
  },
  {
    id: "origin_country",
    label: "Roast Origin",
    minWidth: 110,
    orderingField: "origin_country__name"
  },
  {
    id: "roast_level",
    label: "Roast",
    minWidth: 110,
    orderingField: "roast_level"
  },
  {
    id: "washing_style",
    label: "Process",
    minWidth: 85,
  },
  {
    id: "elevation",
    label: "Elevation",
    minWidth: 120,
    orderingField: null
  },
  {
    id: "flavor_notes",
    label: "Flavor / Body Notes",
    minWidth: 200,
    orderingField: null
  },
  {
    id: "purchase_date",
    label: "Purchase Date",
    minWidth: 130,
  }
];