// src/pages/coffeelog/drinks/AddDrinkReport.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { drinkFieldConfig } from "../../../constants/forms/drinkFormConfig";
import { submitDrink, drinksRoasters, getDrinkById } from "../../../api/drinkApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";

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

  React.useEffect(() => {
    const load = async () => {
      const [roasters] = await Promise.all([
          drinksRoasters(),
        ]);
        // console.log(roasters)
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



  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    try {
      const res = await submitDrink(formData);
      setSaveDialogue(true);
      // console.log("Add drink result:", res);
    } catch(err){
      console.log(err);
      setErrors(err);
    }
  };

  if (!options) return <div>Loading drinks options…</div>;

  const resolvedFields = drinkFieldConfig.map((field) =>
    field.optionSource ? { ...field, options: options[field.optionSource] } : field
  );

  return (
    <>
      <CoffeeLogFormShell
        title={titles[mode]}
        hasBackButton={true}
        backRoute={shortid ? "/coffeeLog/drinks/list": "/coffeeLog"}
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
    </>
  );
}