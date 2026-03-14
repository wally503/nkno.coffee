import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import CoffeeTable from "../../../components/CoffeeTable";
import { fetchBeansTableColumns, fetchBeansTableRows } from "../../../api/mockBeansTableApi";



export default function ListBeansPage() {
  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    fetchBeansTableColumns().then(setColumns);
    fetchBeansTableRows().then(setRows);
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
      <PageHeaderTitle title={"List Beans"} hasBackButton={true} backRoute={"/CoffeeLog"}  />
      <CoffeeTable columns={columns} rows={rows} />
    </Box>
  );
}
