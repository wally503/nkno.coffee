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

  React.useEffect(() => {
    defaultRoastersTableList().then(setRows);
  }, []);
  
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "calc(100vh - 69px)",
        px: 4,
        py: 4,
        width: "100%",
      }}
    >
      <PageHeaderTitle title={"List Roasters"} hasBackButton={true} backRoute={"/CoffeeLog"}  />
      <CoffeeTable columns={defaultRoastersTableColumns} rows={rows} viewRoute={"/coffeeLog/roasters/view"}/>
    </Box>
  );
}
