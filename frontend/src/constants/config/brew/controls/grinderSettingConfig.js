// src/constants/forms/brew/grinderSettingConfig.js

import { CONTROLS_BASE } from './_base';

export const grinderSettingConfig = {
  key: 'grindersetting',
  label: 'Grinder Setting',
  labelPlural: 'Grinder Settings',
  base: `${CONTROLS_BASE}/grindersettings`,
  uriPath: 'brew/grindersettings/',
  segment: 'grindersettings',
  maxWidth: 'sm',
  cardStyle: 'compact',
  hub: CONTROLS_BASE,
  columns: [
    {
      id: 'setting_name',
      label: 'Setting',
      minWidth: 220,
      orderingField: 'setting_name',
    },
    {
      id: 'grinder',
      label: 'Grinder',
      minWidth: 180,
      orderingField: 'grinder__name',
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 280,
      orderingField: 'description',
    },
  ],

  fields: [
    {
      type: 'text',
      name: 'setting_name',
      label: 'Setting Name',
      required: true,
      size: { xs: 12, sm: 12, md: 6 },
    },
    {
      type: 'dropdown',
      name: 'grinder',
      label: 'Grinder',
      required: true,
      size: { xs: 12, sm: 6, md: 6 },
      optionSource: 'brew/grinders/',
    },
    {
      type: 'long_text',
      name: 'description',
      label: 'Description',
      required: true,
      size: { xs: 12 },
    },
  ],
};