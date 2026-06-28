import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { useTableState } from "../../../hooks/useTableState";
import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import CoffeeTable from "../../../components/CoffeeTable";
// import { fetchBeansTableColumns, fetchBeansTableRows } from "../../../api/mockBeansTableApi";
import { defaultRoastersTableList } from "../../../api/roasterApi";
import { defaultRoastersTableColumns } from "../../../constants/tables/roasterListConfig";


export default function ListRoasterCafesPage() {
  const roasterTableState = useTableState('name');
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const roasterResult = await defaultRoastersTableList(roasterTableState.page, roasterTableState.pageSize, roasterTableState.search, roasterTableState.orderingParam);
      setRows(roasterResult.results);
      setTotalCount(roasterResult.count);
    };
    load().catch(console.error);
  }, [roasterTableState.page, roasterTableState.pageSize, roasterTableState.search, roasterTableState.orderField, roasterTableState.orderDir]);

  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",

        px: 4,
        py: 4,
        width: "100%",
      }}
    >
      <PageHeaderTitle title={"List Roasters"} hasBackButton={true} backRoute={"/CoffeeLog"}  />
      <CoffeeTable 
          columns={defaultRoastersTableColumns} 
          rows={rows} 
          totalCount={totalCount}
          tableState={roasterTableState}
          viewRoute={"/coffeeLog/roasters/view"} 
        />
    </Box>
  );
}
