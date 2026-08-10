// src/constants/forms/brew/waterConfig.js

import { CONTROLS_BASE } from './_base';

export const waterConfig = {
  // --- identity + location ---
  key: 'water',
  label: 'Water',
  labelPlural: 'Waters',
  base: `${CONTROLS_BASE}/waters`,   
  uriPath: 'brew/waters/',           
  cardStyle: 'compact',
  hub: CONTROLS_BASE,
  // --- table ---
  columns: [
    { 
        id: 'name',  
        label: 'Name',  
        minWidth: 220, 
        orderingField: 'name' 
    },
    { 
        id: 'description', 
        label: 'Description', 
        minWidth: 180, 
        orderingField: 'description' 
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
        name: 'description', 
        label: 'Description', 
        type: 'text', 
        required: true,
        size: { xs: 12, sm: 6, md: 6 }, 
    },
  ],
};