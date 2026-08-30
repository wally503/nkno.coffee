// src/pages/coffeelog/beans/AddBeans.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { BEANS_STATIC_OPTIONS, beansConfig   } from "../../../constants/config/coffeelog/beans/beansConfig";
import { beansCountries, beansNotes, beansRoasters, submitBeans, getBeanById, updateBean } from "../../../api/beansApi";
import { brewsByBean } from "../../../api/brewApi";
import DialogueBox from "../../../components/DialogueBox";
import { useTableState } from "../../../hooks/useTableState";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CoffeeTable from "../../../components/CoffeeTable";

export default function BeansFormPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);

  const [tabValue, setTabValue] = React.useState("1");
  const brewTableState = useTableState('name');
  const [brewRows, setBrewRows] = React.useState([]);
  const [brewTotalCount, setBrewTotalCount] = React.useState(0);

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
    view: "View Beans",
    edit: "Edit Beans",
    add: "Add Beans"
  } 

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  React.useEffect(() => {
    const load = async () => {
      const [roasters, countries, notes] = await Promise.all([
          beansRoasters(),
          beansCountries(),
          beansNotes()
        ]);
      setOptions({...BEANS_STATIC_OPTIONS, roasters, countries, notes});
      if (shortid){
        const { data } = await getBeanById(shortid);
        console.log('testin data', data);
        console.log('allnotes', notes);
        if(data){
          const noteLabels = data.flavor_notes.map(id => 
          notes.find(n => n.value === id)?.label
            ).filter(Boolean);
          setFormData(prev => ({ ...data, flavor_notes: noteLabels }));
        }
        if(mode === "view"){
          const [brews] = await Promise.all([
            brewsByBean(shortid, brewTableState.page, brewTableState.pageSize, brewTableState.search, brewTableState.orderingParam),
          ]);
          setBrewRows(brews.results);
          setBrewTotalCount(brews.count);
        }
      }
    };
    load().catch(console.error);

  }, [brewTableState.page, brewTableState.pageSize, brewTableState.search, brewTableState.orderingParam]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };  
      console.log("result formdate for beans:", formData)
      const res = shortid 
        ? await updateBean(shortid, payload) 
        : await submitBeans(payload);
      setSaveDialogue(true);
      console.log("Add beans result:", res);
    } catch(err){
      console.log(err);
      setErrors(err);
    }
  };

  if (!options) return null;

  const resolvedFields = beansConfig.fields.map((field) =>
    field.optionSource ? { ...field, options: options[field.optionSource] } : field
  );

  return (
    <>
      <Fade in={!!options} timeout={400}>
        <div>
          <DefaultBodyLayout>
            <CoffeeLogFormShell
              title={titles[mode]}
              hasBackButton={true}
              backRoute={location.state?.backRoute ?? (shortid ? "/coffeeLog/beans/list" : "/coffeeLog")}
              fields={resolvedFields}
              formData={formData}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
              onEdit={() => navigate(`/coffeeLog/beans/edit/${shortid}`)}
              errors={errors}
              mode={mode}
            />
            <DialogueBox 
              title={"Saving Beans"}
              message={"Beans were successfully saved!"}
              open={saveDialogue}
              onCloseParent={() => { setSaveDialogue(false); navigate('/coffeeLog/beans/list') } }
            />
            { mode === "view" && beanViewTables() }
          </DefaultBodyLayout>
        </div>
      </Fade>
    </>
  );

  function beanViewTables(){
    return (
      <>
        <Box sx={{ width: "90%", maxWidth: 1400, mx: "auto" }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="Beans Related Brews">
                <Tab label="Brews" value="1" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <CoffeeTable 
                  columns={beansConfig.brewsTableColumns} 
                  rows={brewRows} 
                  totalCount={brewTotalCount}
                  tableState={brewTableState}
                viewRoute={`/coffeeLog/beans/view`}
              />
            </TabPanel> 
          </TabContext>
        </Box>
      </>
    )
  }
}