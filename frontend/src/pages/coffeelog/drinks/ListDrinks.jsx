import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import CoffeeTable from "../../../components/CoffeeTable";
import { defaultDrinkTableColumns } from "../../../constants/tables/drinkListConfig";
import { defaultDrinksTableList } from "../../../api/drinkApi";


export default function ListDrinksPage() {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);


  React.useEffect(() => {
    const load = async () => {
      const drinksResult = await defaultDrinksTableList(page, pageSize);
      setRows(drinksResult.results);
      setTotalCount(drinksResult.count);
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
      <PageHeaderTitle title={"List Drinks"} hasBackButton={true} backRoute={"/CoffeeLog"}  />
      <CoffeeTable 
          columns={defaultDrinkTableColumns} 
          rows={rows} 
          totalCount={totalCount}
          onPageChange={setPage} 
          onRowsPerPageChange={setPageSize} 
          viewRoute={"/coffeeLog/drinks/view"}
          rowsPerPageDefault={10}
        />
    </Box>
  );
}
