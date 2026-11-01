// src/constants/config/coffeelog/beans/beansStockConfig.jsx
import { StateBarCell } from "../../../../components/table/tableCells";

export const beanStockTableSettings = {
  width: "93%",
  maxWidth: 1800,
  cellPx: 2,
  cellPy: 2,
};

export const beanStockColumns = [
  { id: "_expand", label: "", minWidth: 48, orderingField: null, type: "expander" },
{
  id: "name", label: "Bean", minWidth: 320,
  render: (value, row) => (
    <div>
      <div style={{ fontSize: "1rem", fontWeight: 500, marginBottom: 6 }}>{value}</div>
      <div style={{ maxWidth: 500, marginLeft: 24 }}>
        <StateBarCell value={row.lots} />
      </div>
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
  { id: "states", label: "States", minWidth: 160, orderingField: null },
  { id: "open_days", label: "Open For (days)", minWidth: 100, orderingField: null },
  { id: "days_since_roast", label: "Days Since Roast", minWidth: 100, orderingField: null },
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
  states:           (lot) => lot.state,
  open_days:        (lot) => lot.open_days ?? "-",
  days_since_roast: (lot) => lot.age_days ?? "-",
};

beanStockConfig.lotCells = beanStockLotCells;