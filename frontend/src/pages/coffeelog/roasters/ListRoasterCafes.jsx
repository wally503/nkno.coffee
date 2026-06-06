import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import CoffeeTable from "../../../components/CoffeeTable";
// import { fetchBeansTableColumns, fetchBeansTableRows } from "../../../api/mockBeansTableApi";
import { defaultRoastersTableList } from "../../../api/roasterApi";
import { defaultRoastersTableColumns } from "../../../constants/tables/roasterListConfig";


export default function ListBeansPage() {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const roasterResult = await defaultRoastersTableList(page, pageSize);
      setRows(roasterResult.results);
      setTotalCount(roasterResult.count);
    };
    load().catch(console.error);
  }, [page, pageSize]);
  
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
          onPageChange={setPage} 
          onRowsPerPageChange={setPageSize} 
          viewRoute={"/coffeeLog/roasters/view"} 
          rowsPerPageDefault={10}
        />
    </Box>
  );
}
