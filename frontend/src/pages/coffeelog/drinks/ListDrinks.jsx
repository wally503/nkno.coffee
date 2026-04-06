import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import CoffeeTable from "../../../components/CoffeeTable";
import { defaultDrinkTableColumns } from "../../../constants/tables/drinkListConfig";
import { defaultDrinksTableList } from "../../../api/drinkApi";


export default function ListDrinksPage() {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    defaultDrinksTableList().then(setRows);
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
      <PageHeaderTitle title={"List Drinks"} hasBackButton={true} backRoute={"/CoffeeLog"}  />
      <CoffeeTable columns={defaultDrinkTableColumns} rows={rows} viewRoute={"/coffeeLog/drinks/view"}/>
    </Box>
  );
}
