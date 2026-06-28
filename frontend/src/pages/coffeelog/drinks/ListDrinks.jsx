import * as React from "react";
import PageHeaderTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Grid, FormControl, FormHelperText, Box, Rating, Typography } from "@mui/material";
import CoffeeTable from "../../../components/CoffeeTable";
import { defaultDrinkTableColumns } from "../../../constants/tables/drinkListConfig";
import { defaultDrinksTableList } from "../../../api/drinkApi";
import { useTableState } from "../../../hooks/useTableState";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";

export default function ListDrinksPage() {
  const drinksTableState = useTableState('name');
  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      const drinksResult = await defaultDrinksTableList(drinksTableState.page, drinksTableState.pageSize);
      setRows(drinksResult.results);
      setTotalCount(drinksResult.count);
    };
    load().catch(console.error);
  }, [drinksTableState.page, drinksTableState.pageSize]);

  const navigate = useNavigate();
  
  return (
    <>
      <DefaultBodyLayout>
        <PageHeaderTitle title={"List Drinks"} hasBackButton={true} backRoute={"/CoffeeLog"}  />
        <CoffeeTable 
            columns={defaultDrinkTableColumns} 
            rows={rows} 
            totalCount={totalCount}
            tableState={drinksTableState}
            viewRoute={"/coffeeLog/drinks/view"}
          />
        </DefaultBodyLayout>
    </>
  );
}
