import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { useTableState } from "../../../hooks/useTableState";
import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import CoffeeTable from "../../../components/CoffeeTable";
// import { fetchBeansTableColumns, fetchBeansTableRows } from "../../../api/mockBeansTableApi";
import { defaultBeansTableList } from "../../../api/beansApi";
import { defaultBeansTableColumns } from "../../../constants/tables/beansListConfig";


export default function ListBeansPage() {
  const { page, setPage, pageSize, setPageSize, search, setSearch, orderField, orderDir, orderingParam, handleOrderingChange } = useTableState('name');
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const beansResult = await defaultBeansTableList(page, pageSize, search, orderingParam);
      setRows(beansResult.results);
      setTotalCount(beansResult.count);
    };
    load().catch(console.error);
  }, [page, pageSize, search, orderField, orderDir]);

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
          onSearchChange={(e) => setSearch(e.target.value)}
          onOrderingChange={handleOrderingChange}
          orderField={orderField}
          orderDir={orderDir}
          viewRoute={"/coffeeLog/beans/view"} 
          rowsPerPageDefault={10}
        />
    </Box>
  );
}
