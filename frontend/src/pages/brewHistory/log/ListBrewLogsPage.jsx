// src/pages/brewHistory/log/ListBrewLogsPage.jsx
import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useTableState } from "../../../hooks/useTableState";
import CoffeeTable from "../../../components/CoffeeTable";
import { defaultBrewLogsTableList } from "../../../api/brewApi";
import { logConfig, STYLE_ROUTE_SEGMENT } from "../../../constants/config/brew/history/logConfig";
import { BAG_EVENT_ROW_SX_OPEN, BAG_EVENT_ROW_SX_CLOSE } from "../../../constants/tableStyles";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { eventRowSx } from "../../../constants/tableStyles";

export default function ListBrewLogsPage() {
  const logTableState = useTableState('-date');
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const result = await defaultBrewLogsTableList(
        logTableState.page, logTableState.pageSize, logTableState.search, logTableState.orderingParam,
        showAll ? "full" : undefined
      );
      setRows(result.results);
      setTotalCount(result.count);
    };
    load().catch(console.error);
  }, [showAll, logTableState.page, logTableState.pageSize, logTableState.search, logTableState.orderField, logTableState.orderDir]);

  // Route depends on the row's style — no single flat prefix works here,
  // so this passes a function instead of a string (CoffeeTable supports both).
  // Rows for styles without a route yet (espresso, milk_drink) or with no
  // linked detail row just don't navigate — clicking is a no-op rather than
  // throwing on a route that doesn't exist.
  const viewRoute = (row) => {
    const segment = STYLE_ROUTE_SEGMENT[row.style];
    if (!segment || row.detail_id == null) return null;
    return `/brew/${segment}/view/${row.short_id}`;
  };

  const decoratedRows = rows.map((row) =>
    row.style === "bag_event"
      ? { ...row, rowSx: eventRowSx(row.event_type, row.granularity) }
      : row
  );

  return (
    <>
      <DefaultBodyLayout>
        <PageHeaderTitle title={"Brew Log"} hasBackButton={true} backRoute={"/history"} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: logConfig.tableSettings.width, maxWidth: logConfig.tableSettings.maxWidth }}>
          <FormControlLabel
            control={<Switch checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />}
            label="Show every lot change"
          />
        </Box>
        <CoffeeTable
          columns={logConfig.tableColumns}
          rows={decoratedRows}
          cellPx={logConfig.tableSettings.cellPx}
          cellPy={logConfig.tableSettings.cellPy}            
          width={logConfig.tableSettings.width}
          maxWidth={logConfig.tableSettings.maxWidth}
          totalCount={totalCount}
          tableState={logTableState}
          viewRoute={viewRoute}
          renderDetail={(row) => row.children ?? []}
          lotCellFor={(column, child, ctx) => logConfig.childCells[column.id]?.(child, ctx) ?? ""}
        />
      </DefaultBodyLayout>
    </>
  );
}