// src/pages/coffeelog/beans/AddBeans.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { BEANFORM_STATIC_OPTIONS, beansFieldConfig, flavorNoteModel,   } from "../../../constants/forms/beansFormConfig";
import { beansCountries, beansRoasters, submitBeans } from "../../../api/beansApi";

export default function AddBeansPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);

  React.useEffect(() => {
    const load = async () => {
      const [roasters, countries] = await Promise.all([
          beansRoasters(),
          beansCountries()
        ]);
      setOptions({...BEANFORM_STATIC_OPTIONS, roasters, countries});
    };
    load().catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFlavorNotesChange = (valuesArray) => {
    setFormData((prev) => ({ ...prev, flavor_notes: valuesArray }));
  };

  const handleSubmit = async () => {
    console.log("About to submit beans.");
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