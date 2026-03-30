// src/pages/coffeelog/drinks/AddDrinkReport.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { drinkFieldConfig } from "../../../constants/forms/drinkFormConfig";
import { submitDrink, drinksRoasters } from "../../../api/drinkApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate } from "react-router-dom";

export default function AddBeansPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const [roasters] = await Promise.all([
          drinksRoasters(),
        ]);
      setOptions({ roasters });
    };
    load().catch(console.error);
  }, []);

  const navigate = useNavigate();

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await submitDrink(formData);
      setSaveDialogue(true);
      console.log("Add drink result:", res);
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
        title="Add Drink"
        hasBackButton={true}
        backRoute={"/CoffeeLog"}
        fields={resolvedFields}
        formData={formData}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        errors={errors}
      />
      <DialogueBox 
        title={"Saving Drink"}
        message={"Drink was successfully saved!"}
        open={saveDialogue}
        onCloseParent={() => { setSaveDialogue(false); navigate('/CoffeeLog') } }
      />
    </>
  );
}