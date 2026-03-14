// src/pages/coffeelog/beans/AddBeans.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { beansFieldConfig, flavorNoteModel } from "../../../constants/forms/beansFormConfig";
import { fetchBeansOptions, submitBeans } from "../../../api/mockBeansApi";

export default function AddBeansPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);

  React.useEffect(() => {
    fetchBeansOptions().then(setOptions).catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFlavorNotesChange = (valuesArray) => {
    setFormData((prev) => ({ ...prev, flavor_notes: valuesArray }));
  };

  const handleSubmit = async () => {
    const res = await submitBeans(formData);
    console.log("Add beans result:", res);
  };

  if (!options) return <div>Loading beans options…</div>;

  const resolvedFields = beansFieldConfig.map((field) =>
    field.optionSource ? { ...field, options: options[field.optionSource] } : field
  );

  return (
    <CoffeeLogFormShell
      title="Add Beans"
      hasBackButton={true}
      backRoute={"/CoffeeLog"}
      fields={resolvedFields}
      formData={formData}
      onFieldChange={handleFieldChange}
      flavorModel={flavorNoteModel}
      onFlavorNotesChange={handleFlavorNotesChange}
      onSubmit={handleSubmit}
    />
  );
}