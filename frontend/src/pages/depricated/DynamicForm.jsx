// src/pages/brew/shared/DynamicForm.jsx
//
// Generic add/edit/view form for flat catalog entities. Reuses the existing
// CoffeeLogFormShell (the config-driven field renderer) and wires it to the
// dynamic API. Mode inferred from the route, same pattern as the bean form.

import * as React from 'react';
import { Fade } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CoffeeLogFormShell from '../coffeelog/shared/CoffeeLogFormShell';
import DialogueBox from '../../components/DialogueBox';
import DefaultBodyLayout from '../../components/DefaultBodyLayout';
import {
  submitDynamicForm,
  updateDynamicForm,
  getDynamicById,
  getDynamicOptions,
} from '../../api/dynamicApi';

export default function DynamicForm({ config }) {
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [saveDialogue, setSaveDialogue] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [options, setOptions] = React.useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { shortid } = useParams();

  const getMode = (pathname, id) => {
    switch (true) {
      case pathname.includes('view'): return 'view';
      case !!id: return 'edit';
      default: return 'add';
    }
  };
  const mode = getMode(location.pathname, shortid);

  React.useEffect(() => {
    const load = async () => {
      const sources = [...new Set(
        config.fields.filter(f => f.optionSource).map(f => f.optionSource)
      )];

      if (sources.length) {
        const results = await Promise.all(sources.map(s => getDynamicOptions(s)));
        setOptions(Object.fromEntries(sources.map((s, i) => [s, results[i]])));
      }

      if (shortid) {
        const res = await getDynamicById(config.uriPath, shortid);
        if (res?.data) setFormData(res.data);
      }
      setLoaded(true);
    };
    load().catch(console.error);
  }, [config, shortid]);

  const titles = {
    view: `View ${config.label}`,
    edit: `Edit ${config.label}`,
    add: `Add ${config.label}`,
  };

  React.useEffect(() => {
    const load = async () => {
      if (shortid) {
        const res = await getDynamicById(config.uriPath, shortid);
        if (res?.data) setFormData(res.data);
      }
      setLoaded(true);
    };
    load().catch(console.error);
  }, [config.uriPath, shortid]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };
      shortid
        ? await updateDynamicForm(config.uriPath, shortid, payload)
        : await submitDynamicForm(config.uriPath, payload);
      setSaveDialogue(true);
    } catch (err) {
      setErrors(err);
    }
  };

  const resolvedFields = config.fields.map((field) =>
    field.optionSource ? { ...field, options: options[field.optionSource] } : field
  );
  const listRoute = `${config.base}/list`;

  if (!loaded) return null;
  return (
    <>
      <Fade in={!!options} timeout={400}>
        <div>
          <DefaultBodyLayout>
            <CoffeeLogFormShell
              title={titles[mode]}
              hasBackButton
              backRoute={location.state?.backRoute ?? listRoute}
              fields={resolvedFields}
              formData={formData}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
              onEdit={() => navigate(`${config.base}/edit/${shortid}`)}
              errors={errors}
              mode={mode}
            />
            <DialogueBox
              title={`Saving ${config.label}`}
              message={`${config.label} was successfully saved!`}
              open={saveDialogue}
              onCloseParent={() => {
                setSaveDialogue(false);
                navigate(listRoute);
              }}
            />
          </DefaultBodyLayout>
        </div>
      </Fade>
    </>
  );
}