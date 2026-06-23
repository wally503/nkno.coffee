export const defaultBeansTableColumns = [
  { 
    id: "name", 
    label: "Bean Name", 
    minWidth: 150 
  },
  { 
    id: "roaster", 
    label: "Roaster", 
    minWidth: 150,
    orderingField: "roaster__name"
  },
  {
    id: "origin_country",
    label: "Roast Origin",
    minWidth: 120,
    orderingField: "origin_country__name"
  },
  {
    id: "roast_level",
    label: "Roast",
    minWidth: 85,
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
    minWidth: 100,
    orderingField: null
  },
  {
    id: "flavor_notes",
    label: "Flavor / Body Notes",
    minWidth: 180,
    orderingField: null
  },
  {
    id: "purchase_date",
    label: "Purchase Date",
    minWidth: 180,
  }
];