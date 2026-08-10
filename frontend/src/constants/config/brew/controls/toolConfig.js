// src/constants/forms/brew/toolConfig.js

import { CONTROLS_BASE } from './_base';

export const toolConfig = {
  // --- identity + location ---
  key: 'tool',
  label: 'Tool',
  labelPlural: 'Tools',
  base: `${CONTROLS_BASE}/tools`,   
  uriPath: 'brew/tools/',           
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
        required: true 
    },
    { 
        name: 'description', 
        label: 'Description', 
        type: 'text',
        required: true 
    },
  ],
};