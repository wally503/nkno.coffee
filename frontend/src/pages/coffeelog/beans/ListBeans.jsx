import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { useTableState } from "../../../hooks/useTableState";
import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import CoffeeTable from "../../../components/CoffeeTable";
// import { fetchBeansTableColumns, fetchBeansTableRows } from "../../../api/mockBeansTableApi";
import { defaultBeansTableList } from "../../../api/beansApi";
import { defaultBeansTableColumns } from "../../../constants/tables/beansListConfig";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";


export default function ListBeansPage() {
  const beansTableState = useTableState('name');
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const beansResult = await defaultBeansTableList(beansTableState.page, beansTableState.pageSize, beansTableState.search, beansTableState.orderingParam);
      setRows(beansResult.results);
      setTotalCount(beansResult.count);
    };
    load().catch(console.error);
  }, [beansTableState.page, beansTableState.pageSize, beansTableState.search, beansTableState.orderField, beansTableState.orderDir]);

  const navigate = useNavigate();
  
  return (
    <>
      <DefaultBodyLayout>
        <PageHeaderTitle title={"List Beans"} hasBackButton={true} backRoute={"/coffeeLog"}  />
        <CoffeeTable 
            columns={defaultBeansTableColumns} 
            rows={rows} 
            totalCount={totalCount}
            tableState={beansTableState}
            viewRoute={"/coffeeLog/beans/view"} 
          />
        </DefaultBodyLayout>
    </>
  );
}
