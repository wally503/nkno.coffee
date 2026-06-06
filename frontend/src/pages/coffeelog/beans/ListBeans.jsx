import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import CoffeeTable from "../../../components/CoffeeTable";
// import { fetchBeansTableColumns, fetchBeansTableRows } from "../../../api/mockBeansTableApi";
import { defaultBeansTableList } from "../../../api/beansApi";
import { defaultBeansTableColumns } from "../../../constants/tables/beansListConfig";


export default function ListBeansPage() {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const beansResult = await defaultBeansTableList(page, pageSize);
      setRows(beansResult.results);
      setTotalCount(beansResult.count);
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
      <PageHeaderTitle title={"List Beans"} hasBackButton={true} backRoute={"/coffeeLog"}  />
      <CoffeeTable 
          columns={defaultBeansTableColumns} 
          rows={rows} 
          totalCount={totalCount}
          onPageChange={setPage} 
          onRowsPerPageChange={setPageSize} 
          viewRoute={"/coffeeLog/beans/view"} 
          rowsPerPageDefault={10}
        />
    </Box>
  );
}
