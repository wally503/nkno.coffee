// src/pages/brew/aeropress/EspressoForm.jsx
import * as React from "react";
import BrewLogFormShell from "../shared/BrewLogFormShell";
import { ESPRESSO_STATIC_OPTIONS, espressoConfig } from "../../../constants/config/brew/espresso/espressoConfig";
import { 
  brewLots, brewGrinders, brewScales, brewKettles,
  submitEspresso, getEspressoById, updateEspresso
} from "../../../api/brewApi";
import CloseLotPrompt from "../../../components/CloseLotPrompt";
import LotShortfallDialog from "../../../components/LotShortfallDialog";
import { LEGACY_LOT, lotOptionFromBrew, brewLogLotFields, splitCandidates } from "../../../utils/brewLots";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";
import Fade from '@mui/material/Fade';
import dayjs from 'dayjs';

export default function EspressoFormPage() {
  const [formData, setFormData] = React.useState(() => {
    const defaults = {};
    espressoConfig.fields.forEach(f => {
      if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
    });
    return defaults;
  });
  const [options, setOptions] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);
  const [closePrompt, setClosePrompt] = React.useState(null);
  const [shortfall, setShortfall] = React.useState(null);

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
      const [espressoRes, grinders, scales] = await Promise.all([
        shortid ? getEspressoById(shortid) : Promise.resolve(null),
        brewGrinders(),
        brewScales(),
      ]);

      const data = espressoRes?.data;

      const lots = shortid && data?.brew_log
        ? [lotOptionFromBrew(data.brew_log)]
        : await brewLots();

      setOptions({ ...ESPRESSO_STATIC_OPTIONS, lots, grinders, scales });

      if (!shortid) { // only for add mode
        const defaults = {};
        espressoConfig.fields.forEach(f => {
          if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
        });
        setFormData(prev => ({ ...prev, ...defaults }));
      }

      if (data) {
        setFormData(prev => ({ ...prev, ...normalizeEspressoData(data) }));
      }
    };

    load().catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const normalizeEspressoData = (data) => ({
    ...data,
    bean: data.brew_log?.bean?.short_id ?? data.brew_log?.bean,
    lot: data.brew_log?.lot?.id ?? LEGACY_LOT,
    date: data.brew_log?.date,
    extraction_rating: data.brew_log?.extraction_rating,
    notes: data.brew_log?.notes,
    grinder: data.grinder?.short_id ?? data.grinder,
    scale: data.scale?.short_id ?? data.scale,
    brew_log: data.brew_log?.id ?? data.brew_log,
    tags: (data.brew_log?.tags ?? []).map(t => t.slug),
  });

  const handleSubmit = async (splitLotId) => {
    try {
      const { bean, lot, correct_remaining, date, extraction_rating, notes, brew_log, tags = [], ...detailFields } = formData;
      const normalizedDate = date ? dayjs(date).toISOString() : null;
      const lotFields = brewLogLotFields({ bean, lot, correct_remaining, split_lot: splitLotId }, options);
      const payload = {
            ...detailFields,
            brew_log: { ...lotFields, date: normalizedDate, extraction_rating, notes, tags, style: 'espresso' },
          };

      const res = shortid
        ? await updateEspresso(shortid, payload)
        : await submitEspresso(payload);

      if (res?.close_prompt) {
        // the saved dialog follows once the prompt is answered
        setClosePrompt({ ...res.close_prompt, date: res.brew_log?.date });
      } else {
        setSaveDialogue(true);
      }

      console.log("Espresso save result:", res);
    } catch (err) {
      console.log(err);
      if (err?.brew_log?.lot_shortfall) setShortfall(err.brew_log.lot_shortfall);
      const { brew_log: brewLogErrors, ...detailErrors } = err;
      setErrors({ ...detailErrors, ...brewLogErrors });
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
              onSubmit={() => handleSubmit()}
              onEdit={() => navigate(`/brew/espresso/edit/${shortid}`)}
              errors={errors}
              mode={mode}
            />
            <DialogueBox
              title={"Saving Brew"}
              message={"Espresso brew was successfully saved!"}
              open={saveDialogue}
              onCloseParent={() => { setSaveDialogue(false); navigate('/history/log'); }}
            />
            <CloseLotPrompt
              prompt={closePrompt}
              onDone={() => { setClosePrompt(null); setSaveDialogue(true); }}
            />
            <LotShortfallDialog
              shortfall={shortfall}
              candidates={splitCandidates(options, formData.lot)}
              onClose={() => setShortfall(null)}
              onConfirm={(lotId) => { setShortfall(null); handleSubmit(lotId); }}
            />
          </DefaultBodyLayout>
        </div>
      </Fade>
    </>
  );
}