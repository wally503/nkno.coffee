// src/constants/forms/brew/methodConfig.js

import { CONTROLS_BASE } from './_base';

export const methodConfig = {
  // --- identity + location ---
  key: 'method',
  label: 'Brew Method',
  labelPlural: 'Brew Methods',
  base: `${CONTROLS_BASE}/methods`,   
  uriPath: 'brew/methods/',           

  // --- table ---
  columns: [
    { 
        id: 'name',  
        label: 'Name',  
        minWidth: 220, 
        orderingField: 'name' 
    },
    { 
        id: 'is_dormant', 
        label: 'Is Dormant', 
        minWidth: 180, 
        orderingField: 'is_dormant' 
    },
  ],

  // add/edit form (CoffeeLogFormShell reads formData[field.name])
  fields: [
    { 
        name: 'name',  
        label: 'Name',  
        type: 'text', 
        required: true,
        size: { xs: 12 },
    },
    { 
        type: 'dropdown',
        name: 'is_dormant',
        label: 'Dormant',
        required: true,
        size: { xs: 12 },
        options: [
          { label: 'Active', value: false },
          { label: 'Dormant', value: true },
        ],
    },
  ],
};