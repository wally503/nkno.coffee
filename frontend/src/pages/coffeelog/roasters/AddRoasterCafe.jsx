// src/pages/coffeelog/roasters/AddRoasterCafe.jsx

import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { roasterFieldConfig, ROASTERFORM_STATIC_OPTIONS } from "../../../constants/forms/roasterFormConfig";
import { roastersCountries, submitRoaster } from "../../../api/roasterApi";

export default function AddRoasterCafePage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {

      const load = async () => {
        const [countries] = await Promise.all([
            roastersCountries()
          ]);
        setOptions({...ROASTERFORM_STATIC_OPTIONS, countries});
      };
      load().catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try{
      const res = await submitRoaster(formData);
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
    <CoffeeLogFormShell
      title="Add Roaster / Cafe"
      hasBackButton={true}
      backRoute={"/CoffeeLog"}
      fields={resolvedFields}
      formData={formData}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      errors={errors}
      // no flavorModel / onFlavorNotesChange here
    />
  );
}