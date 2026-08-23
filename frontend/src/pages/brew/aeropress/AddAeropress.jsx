// src/pages/brew/aeropress/AddAeropress.jsx
import * as React from "react";
import BrewLogFormShell from "../shared/BrewLogFormShell";
import { AEROPRESS_STATIC_OPTIONS, aeropressConfig } from "../../../constants/config/brew/aeropress/aeropressConfig";
import {
  brewBeans, brewGrinders, brewScales, brewKettles,
  submitAeropress, getAeropressById, updateAeropress
} from "../../../api/brewApi";
import { markBeanFinished } from "../../../api/beansApi";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";
import Fade from '@mui/material/Fade';

export default function AeropressFormPage() {
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
    view: "View Aeropress Brew",
    edit: "Edit Aeropress Brew",
    add: "New Aeropress Brew",
  };

  React.useEffect(() => {
    const load = async () => {
      const [beans, grinders, scales, kettles] = await Promise.all([
        brewBeans(),
        brewGrinders(),
        brewScales(),
        brewKettles(),
      ]);
      setOptions({ ...AEROPRESS_STATIC_OPTIONS, beans, grinders, scales, kettles });

      if (shortid) {
        const { data } = await getAeropressById(shortid);
        if (data) {
          setFormData(prev => ({ ...prev, ...normalizeAeropressData(data) }));
        }
      }
    };
    load().catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const normalizeAeropressData = (data) => ({
    ...data,
    bean: data.brew_log?.bean,
    date: data.brew_log?.date,
    extraction_rating: data.brew_log?.extraction_rating,
    grinder: data.grinder?.short_id ?? data.grinder,
    scale: data.scale?.short_id ?? data.scale,
    kettle: data.kettle?.short_id ?? data.kettle,
    brew_log: data.brew_log?.id ?? data.brew_log,
  });

  const handleSubmit = async () => {
    try {
      const { bean, date, extraction_rating, notes, hoffmann_events, ...detailFields } = formData;

      const payload = shortid
        ? { ...detailFields, hoffmann_events }
        : {
            ...detailFields,
            hoffmann_events,
            brew_log: { bean, date, extraction_rating, notes, style: 'aeropress' },
          };

      const res = shortid
        ? await updateAeropress(shortid, payload)
        : await submitAeropress(payload);

      setSaveDialogue(true);

      if (res?.needs_bag_close_prompt) {
        setPendingBeanShortId(bean);
        setBagCloseDialogue(true);
      }

      console.log("Aeropress save result:", res);
    } catch (err) {
      console.log(err);
      const { brew_log: brewLogErrors, ...detailErrors } = err;
      setErrors({ ...detailErrors, ...brewLogErrors });
    }
  };

  if (!options) return null;

  const resolvedFields = aeropressConfig.fields.map((field) =>
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
              onEdit={() => navigate(`/brew/aeropress/edit/${shortid}`)}
              errors={errors}
              mode={mode}
            />
            <DialogueBox
              title={"Saving Brew"}
              message={"Aeropress brew was successfully saved!"}
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