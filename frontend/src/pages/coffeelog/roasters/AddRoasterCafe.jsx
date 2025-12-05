// src/pages/coffeelog/roasters/AddRoasterCafe.jsx

import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";

import { roasterFieldConfig } from "../../../constants/forms/roasterFormConfig";
import {
  fetchRoasterOptions,
  submitRoaster,
} from "../../../api/mockRoasterApi";

export default function AddRoasterCafePage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);

  React.useEffect(() => {
    fetchRoasterOptions()
      .then(setOptions)
      .catch((err) => console.error("Failed to load roaster options", err));
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await submitRoaster(formData);
    console.log("Add roaster result:", res);
    // later: show toast, navigate, reset, etc.
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
      fields={resolvedFields}
      formData={formData}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      // no flavorModel / onFlavorNotesChange here
    />
  );
}