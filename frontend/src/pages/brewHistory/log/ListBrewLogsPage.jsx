// src/pages/brewHistory/log/ListBrewLogsPage.jsx
import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useTableState } from "../../../hooks/useTableState";
import CoffeeTable from "../../../components/CoffeeTable";
import { defaultBrewLogsTableList } from "../../../api/brewApi";
import { logColumns, STYLE_ROUTE_SEGMENT, BAG_EVENT_ROW_SX_OPEN, BAG_EVENT_ROW_SX_CLOSE } from "../../../constants/config/brew/history/logConfig";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";

export default function ListBrewLogsPage() {
  const logTableState = useTableState('-date');
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const result = await defaultBrewLogsTableList(
        logTableState.page, logTableState.pageSize, logTableState.search, logTableState.orderingParam
      );
      setRows(result.results);
      setTotalCount(result.count);
    };
    load().catch(console.error);
  }, [logTableState.page, logTableState.pageSize, logTableState.search, logTableState.orderField, logTableState.orderDir]);

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
    row.style === 'bag_event' 
      ? row.event_type === 'opened' ? { ...row, rowSx: BAG_EVENT_ROW_SX_OPEN } : { ...row, rowSx: BAG_EVENT_ROW_SX_CLOSE }
      : row
  );

  return (
    <>
      <DefaultBodyLayout>
        <PageHeaderTitle title={"Brew Log"} hasBackButton={true} backRoute={"/history"} />
        <CoffeeTable
          columns={logColumns}
          rows={decoratedRows}
          totalCount={totalCount}
          tableState={logTableState}
          viewRoute={viewRoute}
        />
      </DefaultBodyLayout>
    </>
  );
}