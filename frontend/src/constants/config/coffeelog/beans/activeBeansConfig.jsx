// activeBeansConfig.jsx
import { COFFEELOG_BASE } from './_base';

export const activeBeansConfig = {
  key: 'activeBean',
  label: 'Active Bean',
  labelPlural: 'Active Beans',
  base: `${COFFEELOG_BASE}/beans`,   // click-through uses the bean's short_id like the Beans page
  uriPath: 'bean-stock/',          // the new summary endpoint
  columns: [
    { 
        id: "_expand", 
        label: "", 
        minWidth: 48, 
        orderingField: null, 
        type: "expander" 
    },
    { 
        id: "name", 
        label: "Bean", 
        minWidth: 220 },
    { 
        id: "lots", 
        label: "Lots", 
        minWidth: 260, 
        orderingField: null, 
        type: "stateBar" },
    {
        id: "remaining", 
        label: "Remaining", 
        minWidth: 120, 
        orderingField: null,
        render: (_, row) => `${row.total_remaining} / ${row.total_stored} g`,
    },
    { 
        id: "states", 
        label: "States", 
        minWidth: 160, 
        orderingField: null },
    {
        id: "open_days",
        label: "Open For (days)",
        minWidth: 100,
        orderingField: null,
        render: () => "-",
    },
    { 
        id: "days_since_roast", 
        label: "Roasted", 
        minWidth: 100, 
        orderingField: null 
    },
  ],
};