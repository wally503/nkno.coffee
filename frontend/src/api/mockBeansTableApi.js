// src/api/mockBeansTableApi.js

// pretend this came from Django, but it's just hardcoded for now:
const MOCK_BEANS_TABLE_ROWS= [
  {
    name: "Ethiopia Sidamo Natural",
    roaster: "nkno",
    origin: "Ethiopia – Sidamo",
    organic: false,
    washed: false,
    elevation: formatElevation(1900, 2200),
    notes: "berry, cocoa, floral",
  },
  {
    name: "Guatemala Antigua Washed",
    roaster: "nkno",
    origin: "Guatemala – Antigua",
    organic: false,
    washed: true,
    elevation: formatElevation(1500, null),
    notes: "chocolate, orange, almond",
  },
  {
    name: "Colombia Huila",
    roaster: "Counter Culture",
    origin: "Colombia – Huila",
    organic: true,
    washed: true,
    elevation: formatElevation(null, null),
    notes: "caramel, apple, clean",
  },
];


const MOCK_BEANS_TABLE_COLUMNS = [
  { id: "name", label: "Bean Name", minWidth: 100 },
  { id: "roaster", label: "Roaster", minWidth: 100 },
  {
    id: "origin",
    label: "Roast Origin",
    minWidth: 70,
  },
  {
    id: "organic",
    label: "Organic",
    minWidth: 70,
  },
  {
    id: "washed",
    label: "Washed",
    minWidth: 70,
  },
  {
    id: "elevation",
    label: "Elevation",
    minWidth: 100,
  },
  {
    id: "notes",
    label: "Notes",
    minWidth: 180,
  },
];

function formatElevation(min, max) {
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);

  if (!hasMin && !hasMax) {
    return "—";
  }

  if (hasMin && !hasMax) {
    return `${min} MASL`;
  }

  if (!hasMin && hasMax) {
    return `${max} MASL`;
  }

  return `${min}-${max} MASL`;
}


export async function fetchBeansTableRows() {
  // mock “API” — could be a real fetch later
  return Promise.resolve(MOCK_BEANS_TABLE_ROWS);
}

export async function fetchBeansTableColumns() {
  // mock “API” — could be a real fetch later
  return Promise.resolve(MOCK_BEANS_TABLE_COLUMNS);
}