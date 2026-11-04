// src/pages/brew/aeropress/AeropressForm.jsx
import * as React from "react";
import BrewLogFormShell from "../shared/BrewLogFormShell";
import { AEROPRESS_STATIC_OPTIONS, aeropressConfig } from "../../../constants/config/brew/aeropress/aeropressConfig";
import {
  brewLots, brewGrinders, brewScales, brewKettles,
  submitAeropress, getAeropressById, updateAeropress
} from "../../../api/brewApi";
import CloseLotPrompt from "../../../components/CloseLotPrompt";
import LotShortfallDialog from "../../../components/LotShortfallDialog";
import { LEGACY_LOT, lotOptionFromBrew, brewLogLotFields, splitCandidates } from "../../../utils/brewLots";
import DialogueBox from "../../../components/DialogueBox";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultBodyLayout from "../../../components/DefaultBodyLayout";
import Fade from '@mui/material/Fade';
import dayjs from 'dayjs';

export default function AeropressFormPage() {
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
    view: "View Aeropress Brew",
    edit: "Edit Aeropress Brew",
    add: "New Aeropress Brew",
  };

  React.useEffect(() => {
    const load = async () => {
      const [aeropressRes, grinders, scales, kettles] = await Promise.all([
        shortid ? getAeropressById(shortid) : Promise.resolve(null),
        brewGrinders(),
        brewScales(),
        brewKettles(),
      ]);

      const data = aeropressRes?.data;

      const lots = shortid && data?.brew_log
        ? [lotOptionFromBrew(data.brew_log)]
        : await brewLots();

      setOptions({ ...AEROPRESS_STATIC_OPTIONS, lots, grinders, scales, kettles });

      if (!shortid) { // only for add mode
        const defaults = {};
        aeropressConfig.fields.forEach(f => {
          if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
        });
        setFormData(prev => ({ ...prev, ...defaults }));
      }

      if (data) {
        setFormData(prev => ({ ...prev, ...normalizeAeropressData(data) }));
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
            brew_log: { ...lotFields, date: normalizedDate, extraction_rating, notes, tags, style: 'aeropress' },
          };

      const res = shortid
        ? await updateAeropress(shortid, payload)
        : await submitAeropress(payload);

      if (res?.close_prompt) {
        // the saved dialog follows once the prompt is answered
        setClosePrompt({ ...res.close_prompt, date: res.brew_log?.date });
      } else {
        setSaveDialogue(true);
      }

      console.log("Aeropress save result:", res);
    } catch (err) {
      console.log(err);
      if (err?.brew_log?.lot_shortfall) setShortfall(err.brew_log.lot_shortfall);
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
              onSubmit={() => handleSubmit()}
              onEdit={() => navigate(`/brew/aeropress/edit/${shortid}`)}
              errors={errors}
              mode={mode}
            />
            <DialogueBox
              title={"Saving Brew"}
              message={"Aeropress brew was successfully saved!"}
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