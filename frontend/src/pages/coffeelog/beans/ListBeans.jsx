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

  React.useEffect(() => {
    defaultBeansTableList().then(setRows);
  }, []);
  
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
      <CoffeeTable columns={defaultBeansTableColumns} rows={rows} viewRoute={"/coffeeLog/beans/view"} rowsPerPageDefault={25} />
    </Box>
  );
}
