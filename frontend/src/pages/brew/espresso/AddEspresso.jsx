// src/pages/brew/aeropress/AddAeropress.jsx
import * as React from "react";
import BrewLogFormShell from "../shared/BrewLogFormShell";
import { ESPRESSO_STATIC_OPTIONS, espressoConfig } from "../../../constants/config/brew/espresso/espressoConfig";
import {
  brewBeans, brewGrinders, brewScales, brewKettles,
  submitBrewLog, submitEspresso, getEspressoById, updateEspresso
} from "../../../api/brewApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";
import Fade from '@mui/material/Fade';

export default function EspressoFormPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { shortid } = useParams();
  const getMode = (pathname, shortid) => {
    switch (true) {
      case pathname.includes("view"): return "view";
      case !!shortid: return "edit";
      default: return "add";
    }
  };
  const mode = getMode(location.pathname, shortid);
  const titles = {
    view: "View Espresso Brew",
    edit: "Edit Espresso Brew",
    add: "New Espresso Brew",
  };

  React.useEffect(() => {
    const load = async () => {
      const [beans, grinders, scales, kettles] = await Promise.all([
        brewBeans(),
        brewGrinders(),
        brewScales(),
        brewKettles(),
      ]);
      setOptions({ ...ESPRESSO_STATIC_OPTIONS, beans, grinders, scales, kettles });

      if (shortid) {
        const { data } = await getEspressoById(shortid);
        if (data) {
          setFormData(prev => ({ ...prev, ...data }));
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
      // Split formData into BrewLog fields vs AeropressDetail fields —
      // the API needs BrewLog to exist first so AeropressDetail can FK to it.
      const { bean, date, extraction_rating, notes, ...detailFields } = formData;

      let brewLogId = formData.brew_log;

      if (!shortid) {
        const brewLog = await submitBrewLog({
          bean, date, extraction_rating, notes, style: 'espresso',
        });
        if (!brewLog?.id) {
          throw new Error('BrewLog creation did not return an id — aborting before creating EspressoDetail.');
        }
        brewLogId = brewLog.id;
      }

      const payload = { ...detailFields, brew_log: brewLogId };

      const res = shortid
        ? await updateEspresso(shortid, payload)
        : await submitEspresso(payload);

      setSaveDialogue(true);
      console.log("Espresso save result:", res);
    } catch (err) {
      console.log(err);
      setErrors(err);
    }
  };

  if (!options) return null;

  const resolvedFields = espressoConfig.fields.map((field) =>
    field.optionSource ? { ...field, options: options[field.optionSource] } : field
  );

  return (
    <>
      <Fade in={!!options} timeout={400}>
        <div>
          <DefaultBodyLayout>
            <BrewLogFormShell
              title={titles[mode]}
              hasBackButton={true}
              backRoute={location.state?.backRoute ?? (shortid ? "/history/by-style" : "/brew")}
              fields={resolvedFields}
              formData={formData}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
              onEdit={() => navigate(`/brew/espresso/edit/${shortid}`)}
              errors={errors}
              mode={mode}
            />
            <DialogueBox
              title={"Saving Brew"}
              message={"Espresso brew was successfully saved!"}
              open={saveDialogue}
              onCloseParent={() => { setSaveDialogue(false); navigate('/history/by-style'); }}
            />
          </DefaultBodyLayout>
        </div>
      </Fade>
    </>
  );
}