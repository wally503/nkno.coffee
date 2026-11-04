// src/pages/brew/coldbrew/ColdbrewForm.jsx
import * as React from "react";
import BrewLogFormShell from "../shared/BrewLogFormShell";
import { COLDBREW_STATIC_OPTIONS, coldbrewConfig } from "../../../constants/config/brew/coldbrew/coldbrewConfig";
import {
  brewLots, brewGrinders, brewScales, brewKettles,
  submitColdbrew, getColdbrewById, updateColdbrew
} from "../../../api/brewApi";
import CloseLotPrompt from "../../../components/CloseLotPrompt";
import LotShortfallDialog from "../../../components/LotShortfallDialog";
import { LEGACY_LOT, lotOptionFromBrew, brewLogLotFields, splitCandidates } from "../../../utils/brewLots";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";
import Fade from '@mui/material/Fade';
import dayjs from 'dayjs';

export default function ColdbrewFormPage() {
  const [formData, setFormData] = React.useState({});
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
    view: "View Coldbrew Brew",
    edit: "Edit Coldbrew Brew",
    add: "New Coldbrew Brew",
  };

  React.useEffect(() => {
    const load = async () => {
      const [coldbrewRes, grinders, scales, kettles] = await Promise.all([
        shortid ? getColdbrewById(shortid) : Promise.resolve(null),
        brewGrinders(),
        brewScales(),
        brewKettles(),
      ]);

      const data = coldbrewRes?.data;

      const lots = shortid && data?.brew_log
        ? [lotOptionFromBrew(data.brew_log)]
        : await brewLots();

      setOptions({ ...COLDBREW_STATIC_OPTIONS, lots, grinders, scales, kettles });

      if (!shortid) { // only for add mode
        const defaults = {};
        coldbrewConfig.fields.forEach(f => {
          if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
        });
        setFormData(prev => ({ ...prev, ...defaults }));
      }

      if (data) {
        setFormData(prev => ({ ...prev, ...normalizeColdbrewData(data) }));
      }
    };

    load().catch(console.error);
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const normalizeColdbrewData = (data) => ({
    ...data,
    bean: data.brew_log?.bean?.short_id ?? data.brew_log?.bean,
    lot: data.brew_log?.lot?.id ?? LEGACY_LOT,
    date: data.brew_log?.date,
    extraction_rating: data.brew_log?.extraction_rating,
    grinder: data.grinder?.short_id ?? data.grinder,
    scale: data.scale?.short_id ?? data.scale,
    kettle: data.kettle?.short_id ?? data.kettle,
    brew_log: data.brew_log?.id ?? data.brew_log,
    tags: (data.brew_log?.tags ?? []).map(t => t.slug),
    notes: data.brew_log?.notes,
  });

  const handleSubmit = async (splitLotId) => {
    try {
      const { bean, lot, correct_remaining, date, extraction_rating, notes, hoffmann_events, tags = [], ...detailFields } = formData;
      const normalizedDate = date ? dayjs(date).toISOString() : null;
      const lotFields = brewLogLotFields({ bean, lot, correct_remaining, split_lot: splitLotId }, options);
      const payload = {
            ...detailFields,
            hoffmann_events,
            brew_log: { ...lotFields, date: normalizedDate, extraction_rating, notes, tags, style: 'cold_brew' },
          };

      const res = shortid
        ? await updateColdbrew(shortid, payload)
        : await submitColdbrew(payload);

      if (res?.close_prompt) {
        // the saved dialog follows once the prompt is answered
        setClosePrompt({ ...res.close_prompt, date: res.brew_log?.date });
      } else {
        setSaveDialogue(true);
      }

      console.log("Coldbrew save result:", res);
    } catch (err) {
      console.log(err);
      if (err?.brew_log?.lot_shortfall) setShortfall(err.brew_log.lot_shortfall);
      const { brew_log: brewLogErrors, ...detailErrors } = err;
      setErrors({ ...detailErrors, ...brewLogErrors });
    }
  };

  if (!options) return null;

  const resolvedFields = coldbrewConfig.fields.map((field) =>
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
              onEdit={() => navigate(`/brew/coldbrew/edit/${shortid}`)}
              errors={errors}
              mode={mode}
            />
            <DialogueBox
              title={"Saving Brew"}
              message={"Cold Brew brew was successfully saved!"}
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