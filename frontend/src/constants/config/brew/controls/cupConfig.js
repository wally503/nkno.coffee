// src/constants/forms/brew/cupConfig.js

import { CONTROLS_BASE } from './_base';

export const cupConfig = {
  // --- identity + location ---
  key: 'cup',
  label: 'Cup',
  labelPlural: 'Cups',
  base: `${CONTROLS_BASE}/cups`,   
  uriPath: 'brew/cups/',           

  // --- table ---
  columns: [
    { 
        id: 'name',  
        label: 'Name',  
        minWidth: 220, 
        orderingField: 'name' 
    },
    { 
        id: 'material', 
        label: 'Material', 
        minWidth: 180, 
        orderingField: 'material' 
    },
    { 
        id: 'capacity', 
        label: 'Capacity', 
        minWidth: 180, 
        orderingField: 'capacity' 
    },
  ],

  // add/edit form (CoffeeLogFormShell reads formData[field.name])
  fields: [
    { 
        name: 'name',  
        label: 'Name',  
        type: 'text', 
        required: true 
    },
    { 
        name: 'material', 
        label: 'Material', 
        type: 'text', 
        required: true 
    },
    {
        name: 'capacity',
        label: 'Capacity',
        type: 'text'
    }
  ],
};