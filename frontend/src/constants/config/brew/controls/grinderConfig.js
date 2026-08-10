// src/constants/forms/brew/grinderConfig.js

import { CONTROLS_BASE } from './_base';

export const grinderConfig = {
  // --- identity + location ---
  key: 'grinder',
  label: 'Grinder',
  labelPlural: 'Grinders',
  base: `${CONTROLS_BASE}/grinders`,   
  uriPath: 'brew/grinders/',           
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
        id: 'brand', 
        label: 'Brand', 
        minWidth: 180, 
        orderingField: 'brand' 
    },
    // { 
    // id: 'date_added', 
    // label: 'Added', 
    // minWidth: 140, 
    // orderingField: 'date_added',
    //   render: (v) => (v ? new Date(v).toLocaleDateString('en-CA') : '-') 
    // },
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
        name: 'brand', 
        label: 'Brand', 
        type: 'text' 
    },
  ],
};