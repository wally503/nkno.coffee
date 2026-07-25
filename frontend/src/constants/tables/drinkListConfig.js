export const defaultDrinkTableColumns = [
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
];