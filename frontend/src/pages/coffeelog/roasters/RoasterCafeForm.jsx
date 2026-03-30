// src/pages/coffeelog/roasters/AddRoasterCafe.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { roasterFieldConfig, ROASTERFORM_STATIC_OPTIONS } from "../../../constants/forms/roasterFormConfig";
import { roastersCountries, submitRoaster,getRoasterById, updateRoaster } from "../../../api/roasterApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams } from "react-router-dom";

export default function RoasterCafeFormPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);

  const navigate = useNavigate();
  const { shortid } = useParams();

  React.useEffect(() => {
      const load = async () => {
        const [countries] = await Promise.all([
            roastersCountries()
          ]);
        setOptions({...ROASTERFORM_STATIC_OPTIONS, countries});
        if (shortid){
          const { data } = await getRoasterById(shortid);
          if(data){
            setFormData(data)
          }
        }
      };
      load().catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try{
      const res = shortid ? await updateRoaster(id, formData) : await submitRoaster(formData);
      setSaveDialogue(true);
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
    <>
      <CoffeeLogFormShell
        title={shortid ? "Edit Roaster / Cafe" : "Add Roaster / Cafe"}
        hasBackButton={true}
        backRoute={"/coffeeLog"}
        fields={resolvedFields}
        formData={formData}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        errors={errors}
        // no flavorModel / onFlavorNotesChange here
      />
      <DialogueBox 
        title={"Saving Roaster"}
        message={"Roaster was successfully saved!"}
        open={saveDialogue}
        onCloseParent={() => { setSaveDialogue(false); navigate('/coffeeLog/roasters/list') } }
      />
    </>
  );
}