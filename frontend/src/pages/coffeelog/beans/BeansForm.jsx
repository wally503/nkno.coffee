// src/pages/coffeelog/beans/AddBeans.jsx
import * as React from "react";
import CoffeeLogFormShell from "../shared/CoffeeLogFormShell";
import { BEANFORM_STATIC_OPTIONS, beansFieldConfig   } from "../../../constants/forms/beansFormConfig";
import { beansCountries, beansNotes, beansRoasters, submitBeans, getBeanById, updateBean } from "../../../api/beansApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function BeansFormPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { shortid } = useParams();
  const getMode = (pathname, shortid) => {
    switch(true) {
      case pathname.includes("view"): return "view";
      case !!shortid: return "edit";
      default: return "add";
    }
  }
  const mode = getMode(location.pathname, shortid)
  const titles = {
    view: "View Beans",
    edit: "Edit Beans",
    add: "Add Beans"
  } 



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
          //console.log(noteLabels)
          setFormData(prev => ({ ...prev, flavor_notes: noteLabels }));
        }
      }
    };
    load().catch(console.error);

  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };  
      const res = shortid ? await updateBean(shortid, payload) : await submitBeans(payload);
      setSaveDialogue(true);
      // console.log("Add beans result:", res);
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
        title={titles[mode]}
        hasBackButton={true}
        backRoute={shortid ? "/coffeeLog/beans/list": "/coffeeLog"}
        fields={resolvedFields}
        formData={formData}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        onEdit={() => navigate(`/coffeeLog/beans/edit/${shortid}`)}
        errors={errors}
        mode={mode}
      />
      <DialogueBox 
        title={"Saving Beans"}
        message={"Beans were successfully saved!"}
        open={saveDialogue}
        onCloseParent={() => { setSaveDialogue(false); navigate('/coffeeLog/beans/list') } }
      />
    </>
  );
}