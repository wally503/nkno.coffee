// src/pages/beanStock/ListBeanStockPage.jsx

import * as React from "react";
import PageHeaderTitle from "../../components/PageTitle";
import { useTableState } from "../../hooks/useTableState";
import CoffeeTable from "../../components/CoffeeTable";
import LotRows from "../../components/table/LotRows";
import DefaultBodyLayout from "../../components/DefaultBodyLayout";
import { defaultBeanStockTableList } from "../../api/beanStockApi";
import { beanStockConfig } from "../../constants/config/coffeelog/beans/beansStockConfig"
import { beansConfig } from "../../constants/config/coffeelog/beans/beansConfig";

export default function ListBeanStockPage() {
  const stockTableState = useTableState("name");
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const result = await defaultBeanStockTableList(
        stockTableState.page, stockTableState.pageSize, stockTableState.search, stockTableState.orderingParam
      );
      setRows(result.results);
      setTotalCount(result.count);
    };
    load().catch(console.error);
  }, [stockTableState.page, stockTableState.pageSize, stockTableState.search, stockTableState.orderField, stockTableState.orderDir]);

  return (
    <DefaultBodyLayout>
      <PageHeaderTitle title={"Bean Stock"} hasBackButton={true} backRoute={"/"} />
      <CoffeeTable
        columns={beanStockConfig.tableColumns}
        rows={rows}
        cellPx={beanStockConfig.tableSettings.cellPx}
        cellPy={beanStockConfig.tableSettings.cellPy}
        width={beanStockConfig.tableSettings.width}
        maxWidth={beanStockConfig.tableSettings.maxWidth}
        totalCount={totalCount}
        tableState={stockTableState}
        viewRoute={`${beansConfig.base}/view`}
        renderDetail={(row) => [...row.lots].reverse()}
        lotCellFor={(column, lot, ctx) => beanStockConfig.lotCells[column.id]?.(lot, ctx) ?? ""}
        rowClickable={false}
      />
    </DefaultBodyLayout>
  );
}