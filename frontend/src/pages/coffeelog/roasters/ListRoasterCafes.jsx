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
  const [search, setSearch] = React.useState('');
  const [orderField, setOrderField] = React.useState('name');
  const [orderDir, setOrderDir] = React.useState('asc');
  const [pageSize, setPageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const orderingParam = orderDir === 'desc' ? `-${orderField}` : orderField;
      const roasterResult = await defaultRoastersTableList(page, pageSize, search, orderingParam);
      setRows(roasterResult.results);
      setTotalCount(roasterResult.count);
    };
    load().catch(console.error);
  }, [page, pageSize, search, orderField, orderDir]);
  
  const handleOrderingChange = (field) => {
    if (field !== orderField) {
      setOrderField(field);
      setOrderDir('asc');
    } else if (orderDir === 'asc') {
      setOrderDir('desc');
    } else {
      setOrderField('name');
      setOrderDir('asc');
    }
  };

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
          onSearchChange={(e) => setSearch(e.target.value)}
          onOrderingChange={handleOrderingChange}
          orderField={orderField}
          orderDir={orderDir}
          viewRoute={"/coffeeLog/roasters/view"} 
          rowsPerPageDefault={10}
        />
    </Box>
  );
}
