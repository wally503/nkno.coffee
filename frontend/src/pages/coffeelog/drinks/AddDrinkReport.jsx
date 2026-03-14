// src/pages/coffeelog/drinks/AddDrinkReport.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { drinkFieldConfig } from "../../../constants/forms/drinkFormConfig";
import { submitDrink, fetchDrinkOptions } from "../../../api/mockDrinkApi";

export default function AddBeansPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);

  React.useEffect(() => {
    fetchDrinkOptions().then(setOptions).catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await submitDrink(formData);
    console.log("Add drink result:", res);
  };

  if (!options) return <div>Loading drinks options…</div>;

  const resolvedFields = drinkFieldConfig.map((field) =>
    field.optionSource ? { ...field, options: options[field.optionSource] } : field
  );

  return (
    <CoffeeLogFormShell
      title="Add Drink"
      hasBackButton={true}
      backRoute={"/CoffeeLog"}
      fields={resolvedFields}
      formData={formData}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
    />
  );
}