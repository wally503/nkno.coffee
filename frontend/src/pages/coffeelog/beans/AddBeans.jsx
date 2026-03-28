// src/pages/coffeelog/beans/AddBeans.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { BEANFORM_STATIC_OPTIONS, beansFieldConfig   } from "../../../constants/forms/beansFormConfig";
import { beansCountries, beansNotes, beansRoasters, submitBeans } from "../../../api/beansApi";

export default function AddBeansPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    const load = async () => {
      const [roasters, countries, notes] = await Promise.all([
          beansRoasters(),
          beansCountries(),
          beansNotes()
        ]);
      setOptions({...BEANFORM_STATIC_OPTIONS, roasters, countries, notes});
    };
    load().catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try{
      const res = await submitBeans(formData);
      console.log("Add beans result:", res);
    } catch(err){
      console.log(err);
      setErrors(err);
    }
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
      onSubmit={handleSubmit}
      errors={errors}
    />
  );
}