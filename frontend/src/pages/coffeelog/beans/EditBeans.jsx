// src/pages/coffeelog/beans/EditBeans.jsx
import * as React from "react";
import { useParams } from "react-router-dom";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { beansFieldConfig } from "../../../constants/forms/beansFormConfig";
import { fetchBeansOptions, fetchBeanById, updateBeans } from "../../../api/mockBeansApi";

export default function EditBeansPage() {
  const { beanId } = useParams();
  const [formData, setFormData] = React.useState(null);
  const [options, setOptions] = React.useState(null);

  // load options + existing bean
  React.useEffect(() => {
    Promise.all([fetchBeansOptions(), fetchBeanById(beanId)])
      .then(([opts, bean]) => {
        setOptions(opts);
        setFormData(bean); // <- existing values, already model-shaped
      })
      .catch(console.error);
  }, [beanId]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFlavorNotesChange = (valuesArray) => {
    setFormData((prev) => ({ ...prev, flavor_notes: valuesArray }));
  };

  const handleSubmit = async () => {
    const res = await updateBeans(beanId, formData);
    console.log("Edit beans result:", res);
  };

  if (!options || !formData) return <div>Loading bean…</div>;

  const resolvedFields = beansFieldConfig.map((field) =>
    field.optionSource ? { ...field, options: options[field.optionSource] } : field
  );

  return (
    <CoffeeLogFormShell
      title={`Edit Beans: ${formData.bean_name ?? ""}`}
      fields={resolvedFields}
      formData={formData}
      onFieldChange={handleFieldChange}
      flavorModel={dynamicDropdownModel}
      onFlavorNotesChange={handleFlavorNotesChange}
      onSubmit={handleSubmit}
    />
  );
}
