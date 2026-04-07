// src/pages/coffeelog/roasters/AddRoasterCafe.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { roasterFieldConfig, ROASTERFORM_STATIC_OPTIONS, roasterFormBeansTableFieldsConfig, roasterFormDrinkTableFieldsConfig } from "../../../constants/forms/roasterFormConfig";
import { roastersCountries, submitRoaster, getRoasterById, updateRoaster } from "../../../api/roasterApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { beansByRoaster } from "../../../api/beansApi";
import { drinksByRoaster } from "../../../api/drinkApi";
import CoffeeTable from "../../../components/CoffeeTable";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function RoasterCafeFormPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);
  const [relatedBeans, setRelatedBeans] = React.useState([]);
  const [relatedDrinks, setRelatedDrinks] = React.useState([]);
  const [tabValue, setTabValue] = React.useState("1");

  const navigate = useNavigate();
  const location = useLocation();
  const { shortid } = useParams();
  const getMode = (pathname, shortid) => {
    switch(true) {
      case pathname.includes("view"): return "view";
      case !!shortid: return "edit";
      default: return "add";
    }
  }
  const mode = getMode(location.pathname, shortid)
  const titles = {
    view: "View Roasters",
    edit: "Edit Roaster",
    add: "Add Roaster"
  } 

  React.useEffect(() => {
      const load = async () => {
        const [countries] = await Promise.all([
            roastersCountries()
          ]);
        setOptions({...ROASTERFORM_STATIC_OPTIONS, countries});
        if (shortid){
          const { data } = await getRoasterById(shortid);
          if(data){
            setFormData(data)
          }
          if(mode === "view"){
            const [beans, cafeLog] = await Promise.all([
              beansByRoaster(shortid),
              drinksByRoaster(shortid)
            ]);
            console.log(beans);
            setRelatedBeans(beans);
            setRelatedDrinks(cafeLog);
          }
        }
      };
      load().catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async () => {
    try{
      const res = shortid ? await updateRoaster(id, formData) : await submitRoaster(formData);
      setSaveDialogue(true);
      console.log("Add roaster result:", res);
    } catch(err){
      console.log(err);
      setErrors(err);
    }
  };


  if (!options) {
    return <div>Loading roaster options…</div>;
  }

  const resolvedFields = roasterFieldConfig.map((field) =>
    field.optionSource
      ? { ...field, options: options[field.optionSource] }
      : field
  );

  return (
    <>
      <CoffeeLogFormShell
        title={titles[mode]}
        hasBackButton={true}
        backRoute={shortid ? "/coffeeLog/roasters/list": "/coffeeLog"}
        fields={resolvedFields}
        formData={formData}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        onEdit={() => navigate(`/coffeeLog/roasters/edit/${shortid}`)}
        errors={errors}
        mode={mode}
      />
      <DialogueBox 
        title={"Saving Roaster"}
        message={"Roaster was successfully saved!"}
        open={saveDialogue}
        onCloseParent={() => { setSaveDialogue(false); navigate('/coffeeLog/roasters/list') } }
      />
      { mode === "view" && roasterViewTables() }
    </>
  );

  function roasterViewTables(){
    return (
      <>
        <Box sx={{ width: "90%", maxWidth: 1400, mx: "auto" }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                <Tab label="Beans" value="1" />
                <Tab label="Drinks" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <CoffeeTable columns={roasterFormBeansTableFieldsConfig} rows={relatedBeans} viewRoute={"/coffeeLog/beans/view"}/>
            </TabPanel>
            <TabPanel value="2">
              <CoffeeTable columns={roasterFormDrinkTableFieldsConfig} rows={relatedDrinks} viewRoute={"/coffeeLog/drinks/view"}/>
            </TabPanel>
          </TabContext>
        </Box>
      </>
    )
  }

}


