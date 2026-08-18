// src/pages/brew/pourover/AddPourover.jsx
import * as React from "react";
import BrewLogFormShell from "../shared/BrewLogFormShell";
import { POUROVER_STATIC_OPTIONS, pouroverConfig } from "../../../constants/config/brew/pourover/pouroverConfig";
import {
  brewBeans, brewGrinders, brewScales, brewKettles,
  submitBrewLog, submitPourover, getPouroverById, updatePourover
} from "../../../api/brewApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";
import Fade from '@mui/material/Fade';

export default function PouroverFormPage() {
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
    view: "View Pourover Brew",
    edit: "Edit Pourover Brew",
    add: "New Pourover Brew",
  };

  React.useEffect(() => {
    const load = async () => {
      const [beans, grinders, scales, kettles] = await Promise.all([
        brewBeans(),
        brewGrinders(),
        brewScales(),
        brewKettles(),
      ]);
      setOptions({ ...POUROVER_STATIC_OPTIONS, beans, grinders, scales, kettles });

      if (shortid) {
        const { data } = await getPouroverById(shortid);
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
      // Split formData into BrewLog fields vs PouroverDetail fields —
      // the API needs BrewLog to exist first so PouroverDetail can FK to it.
      const { bean, date, extraction_rating, notes, pour_events, ...detailFields } = formData;

      let brewLogId = formData.brew_log;

      if (!shortid) {
        const brewLog = await submitBrewLog({
          bean, date, extraction_rating, notes, style: 'pourover',
        });
        if (!brewLog?.id) {
          throw new Error('BrewLog creation did not return an id — aborting before creating PouroverDetail.');
        }
        brewLogId = brewLog.id;
      }

      const payload = { ...detailFields, brew_log: brewLogId, pour_events };

      const res = shortid
        ? await updatePourover(shortid, payload)
        : await submitPourover(payload);

      setSaveDialogue(true);
      console.log("Pourover save result:", res);
    } catch (err) {
      console.log(err);
      setErrors(err);
    }
  };

  if (!options) return null;

  const resolvedFields = pouroverConfig.fields.map((field) =>
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
              onEdit={() => navigate(`/brew/pourover/edit/${shortid}`)}
              errors={errors}
              mode={mode}
            />
            <DialogueBox
              title={"Saving Brew"}
              message={"Pourover brew was successfully saved!"}
              open={saveDialogue}
              onCloseParent={() => { setSaveDialogue(false); navigate('/history/by-style'); }}
            />
          </DefaultBodyLayout>
        </div>
      </Fade>
    </>
  );
}