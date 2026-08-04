// src/constants/forms/brew/vesselSettingConfig.js

import { CONTROLS_BASE } from './_base';

export const vesselSettingConfig = {
  // --- identity + location ---
  key: 'vesselsetting',
  label: 'Vessel Setting',
  labelPlural: 'Vessel Settings',
  base: `${CONTROLS_BASE}/vesselsettings`,   
  uriPath: 'brew/vesselsettings/',           

  // --- table ---
  columns: [
    { 
        id: 'name',  
        label: 'Name',  
        minWidth: 220, 
        orderingField: 'name' 
    },
    { 
        id: 'setting_name', 
        label: 'Setting Name', 
        minWidth: 180, 
        orderingField: 'setting_name' 
    },
    { 
        id: 'description', 
        label: 'Description', 
        minWidth: 180, 
        orderingField: 'description' 
    },
    { 
        id: 'vessel', 
        label: 'Vessel', 
        minWidth: 180, 
        orderingField: 'vessel__name' 
    },
  ],

  // add/edit form (CoffeeLogFormShell reads formData[field.name])
  fields: [
    { 
        name: 'name',  
        label: 'Name',  
        type: 'text', 
        required: true,
        size: { xs: 12, sm: 6, md: 6 },
    },
    {
        type: 'dropdown',
        name: 'vessel',
        label: 'Vessel',
        required: true,
        size: { xs: 12, sm: 6, md: 6 },
        optionSource: 'brew/vessels/',
    },
        { 
        name: 'setting_name', 
        label: 'Setting Name', 
        type: 'text', 
        required: true,
        size: { xs: 12, sm: 6, md: 6 },
    },
    { 
        name: 'description', 
        label: 'Description', 
        type: 'text', 
        required: true 
    },

  ],
};