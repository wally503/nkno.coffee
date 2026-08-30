// src/pages/brew/pourover/AddPourover.jsx
import * as React from "react";
import BrewLogFormShell from "../shared/BrewLogFormShell";
import { POUROVER_STATIC_OPTIONS, pouroverConfig } from "../../../constants/config/brew/pourover/pouroverConfig";
import {
  brewBeans, brewGrinders, brewScales, brewKettles,
  submitPourover, getPouroverById, updatePourover
} from "../../../api/brewApi";
import { markBeanFinished } from "../../../api/beansApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";
import Fade from '@mui/material/Fade';

export default function PouroverFormPage() {
  const [formData, setFormData] = React.useState({});
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);
  const [bagCloseDialogue, setBagCloseDialogue] = React.useState(false);
  const [pendingBeanShortId, setPendingBeanShortId] = React.useState(null);

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
      const [pouroverRes, grinders, scales, kettles] = await Promise.all([
        shortid ? getPouroverById(shortid) : Promise.resolve(null),
        brewGrinders(),
        brewScales(),
        brewKettles(),
      ]);

      const data = pouroverRes?.data;

      const beans = shortid && data?.brew_log?.bean
        ? [{ label: data.brew_log.bean.name, value: data.brew_log.bean.short_id }]
        : await brewBeans();

      setOptions({ ...POUROVER_STATIC_OPTIONS, beans, grinders, scales, kettles });

      if (data) {
        setFormData(prev => ({ ...prev, ...normalizePouroverData(data) }));
      }
    };

    load().catch(console.error);
  }, []);
  
  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const normalizePouroverData = (data) => ({
    ...data,
    bean: data.brew_log?.bean?.short_id ?? data.brew_log?.bean,
    date: data.brew_log?.date,
    extraction_rating: data.brew_log?.extraction_rating,
    notes: data.brew_log?.notes,
    grinder: data.grinder?.short_id ?? data.grinder,
    scale: data.scale?.short_id ?? data.scale,
    kettle: data.kettle?.short_id ?? data.kettle,
    brew_log: data.brew_log?.id ?? data.brew_log,
  });

  const handleSubmit = async () => {
    try {
      const { bean, date, extraction_rating, notes, pour_events, ...detailFields } = formData;

      const payload = shortid
        ? { ...detailFields, pour_events }
        : {
            ...detailFields,
            pour_events,
            brew_log: { bean, date, extraction_rating, notes, style: 'pourover' },
          };

      const res = shortid
        ? await updatePourover(shortid, payload)
        : await submitPourover(payload);

      setSaveDialogue(true);

      if (res?.needs_bag_close_prompt) {
        setPendingBeanShortId(bean);
        setBagCloseDialogue(true);
      }

      console.log("Pourover save result:", res);
    } catch (err) {
      console.log(err);
      const { brew_log: brewLogErrors, ...detailErrors } = err;
      setErrors({ ...detailErrors, ...brewLogErrors });
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
            <DialogueBox
              title={"Bag Almost Empty"}
              message={"This bag is nearly out — want to mark it as finished?"}
              open={bagCloseDialogue}
              onCloseParent={() => setBagCloseDialogue(false)}
              onConfirm={() => markBeanFinished(pendingBeanShortId)} 
              confirmLabel="Yes, Close Bag"
              cancelLabel="No, Not yet"
            />
          </DefaultBodyLayout>
        </div>
      </Fade>
    </>
  );
}