// src/pages/coffeelog/drinks/AddDrinkReport.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { drinkFieldConfig } from "../../../constants/forms/drinkFormConfig";
import { submitDrink, drinksRoasters, getDrinkById } from "../../../api/drinkApi";
import { beansByRoaster } from "../../../api/beansApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";

export default function DrinksFormPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);

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
    view: "View Drinks",
    edit: "Edit Drinks",
    add: "Add Drinks"
  } 

  console.log("render!");

  React.useEffect(() => {
    const load = async () => {
      const [roasters] = await Promise.all([
          drinksRoasters(),
        ]);
      console.log("roasters:");
      console.log(roasters);
      setOptions({ roasters });
      if (shortid){
        const { data } = await getDrinkById(shortid);
        if(data){
          setFormData(data);
          // console.log(data);
        }}
    };
    load().catch(console.error);
  }, []);
  
  React.useEffect(() => {
    if (!options) return;
    if (!formData.roaster)
    {
      setOptions(prev => ({ ...prev, beans: [] }))
    } else {
      const roaster_short = options.roasters.find(r => r.value === formData.roaster)?.short_id;
      const load = async () => {
        const [beans] = await Promise.all([
            beansByRoaster(roaster_short, 0, 100)
          ]);
        setOptions(prev => ({ ...prev, beans: beans.results.map(b => ({ label: b.name, value: b.id })) }))
        console.log("beans results:");
        console.log(beans.results);
        console.log("setOptions:");
        console.log(options);
      };
      
      load().catch(console.error);
    }
  }, [formData.roaster]);


  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    try {
      const res = shortid
        ? await updateDrink(shortid, payload)
        : await submitDrink(payload);
      setSaveDialogue(true);
      // console.log("Add drink result:", res);
    } catch(err){
      console.log(err);
      setErrors(err);
    }
  };

  if (!options) return null;

  const resolvedFields = drinkFieldConfig.map((field) =>
    field.optionSource ? { ...field, options: options[field.optionSource] } : field
  );

  return (
    <>
      <DefaultBodyLayout>
        <CoffeeLogFormShell
          title={titles[mode]}
          hasBackButton={true}
          backRoute={location.state?.backRoute ?? (shortid ? "/coffeeLog/drinks/list" : "/coffeeLog")}
          fields={resolvedFields}
          formData={formData}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onEdit={() => navigate(`/coffeeLog/drinks/edit/${shortid}`)}
          errors={errors}
          mode={mode}
        />
        <DialogueBox 
          title={"Saving Drink"}
          message={"Drink was successfully saved!"}
          open={saveDialogue}
          onCloseParent={() => { setSaveDialogue(false); navigate('/coffeeLog') } }
        />
      </DefaultBodyLayout>
    </>
  );
}