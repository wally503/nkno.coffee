// src/constants/config/coffeelog/beans/beansStockConfig.jsx
import LotActions from "../../../../components/table/LotActions";
import { StateBarCell, titleCase } from "../../../../components/table/tableCells";

console.log("beanStockConfig loaded v2");

export const beanStockTableSettings = {
  width: "93%",
  maxWidth: 1800,
  cellPx: 2,
  cellPy: 2,
};

export const beanStockColumns = [
  { id: "_expand", label: "", minWidth: 48, orderingField: null, type: "expander" },

  {
    id: "name", label: "Bean", minWidth: 340,
    render: (value, row) => (
      <div>
        <div style={{ fontSize: "1rem", fontWeight: 500, marginBottom: 8, marginLeft: -20 }}>{value}</div>
        <StateBarCell value={row.lots} finished={row.finished_lots} />
      </div>
    ),
  },
//   { id: "lots", label: "Lots", minWidth: 260, orderingField: null, type: "stateBar" },
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
    orderingField: null 
  },
  {
    id: "open_days",
    label: "Open For (days)",
    minWidth: 100,
    orderingField: null,
    render: () => "-",
  },
  { 
    id: "days_since_roast", 
    label: "Days Since Roast", 
    minWidth: 100, 
    orderingField: null 
  },
  { id: "_actions", label: "", minWidth: 110, orderingField: null, type: "actions" },
];

export const beanStockConfig = {
  key: "beanStock",
  label: "Bean Stock",
  uriPath: "bean-stock/",
  tableSettings: beanStockTableSettings,
  tableColumns: beanStockColumns,
};


export const beanStockLotCells = {
  name:             (lot) => `${lot.vessel_label}`,
  lots:             (lot) => lot.state,
  remaining:        (lot) => `${lot.remaining_weight} / ${lot.stored_weight} g`,
  states:           (lot) => titleCase(lot.state),
  open_days:        (lot) => lot.state === "open" ? (lot.open_days ?? "-") : "-",
  days_since_roast: (lot) => lot.state === "open" ? (lot.age_days ?? "-") : "-",
  _actions:         (lot, ctx) => <LotActions lot={lot} onChange={ctx.refresh} />,
  // _actions: () => "TEST"
};

beanStockConfig.lotCells = beanStockLotCells;
console.log("lotCells keys:", Object.keys(beanStockConfig.lotCells ?? {}));