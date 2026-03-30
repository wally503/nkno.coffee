// src/pages/coffeelog/beans/AddBeans.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { BEANFORM_STATIC_OPTIONS, beansFieldConfig   } from "../../../constants/forms/beansFormConfig";
import { beansCountries, beansNotes, beansRoasters, submitBeans, getBeanById, updateBean } from "../../../api/beansApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams } from "react-router-dom";

export default function BeansFormPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);

  const navigate = useNavigate();
  const { shortid } = useParams();

  React.useEffect(() => {
    const load = async () => {
      const [roasters, countries, notes] = await Promise.all([
          beansRoasters(),
          beansCountries(),
          beansNotes()
        ]);
      setOptions({...BEANFORM_STATIC_OPTIONS, roasters, countries, notes});
      if (shortid){
        const { data } = await getBeanById(shortid);
        if(data){
          setFormData(data)
          const noteLabels = data.flavor_notes.map(id => 
          notes.find(n => n.value === id)?.label
            ).filter(Boolean);
          console.log(noteLabels)
          setFormData(prev => ({ ...prev, flavor_notes: noteLabels }));
        }
      }
    };
    load().catch(console.error);

  }, []);

  const handleFieldChange = (name, value) => {
    console.log(name, value)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };  

      console.log(payload)
      const res = shortid ? await updateBean(shortid, payload) : await submitBeans(payload);
      setSaveDialogue(true);
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
    <>
      <CoffeeLogFormShell
        title={shortid ? "Edit Beans" : "Add Beans"}
        hasBackButton={true}
        backRoute={"/coffeeLog"}
        fields={resolvedFields}
        formData={formData}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        errors={errors}
      />
      <DialogueBox 
        title={"Saving Beans"}
        message={"Beans was successfully saved!"}
        open={saveDialogue}
        onCloseParent={() => { setSaveDialogue(false); navigate('/coffeeLog/beans/list') } }
      />
    </>
  );
}