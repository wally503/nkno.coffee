// src/constants/config/brew/templates/recipie.jsx
import { TEMPLATES_BASE } from './_base';
 
export const recipieConfig = {
  key: 'recipie',
  label: 'Recipie',
  labelPlural: 'Recipies',
  base: `${TEMPLATES_BASE}/recipies`,
  uriPath: 'brew/recipies/',
  cardStyle: 'default',  
  hub: TEMPLATES_BASE,
  columns:  [
    { 
      id: "name", 
      label: "Recipie Name", 
      minWidth: 120 
    },
    {
      id: "template",
      label: "Recipie Template",
      minWidth: 120,
    //   orderingField: "template__name"
    },
    {
      id: "dose_grams",
      label: "Bean Dose (g)",
      minWidth: 100,
    },
    { 
      id: "water_grams",
      label: "Water (g)",
      minWidth: 90,
    },
    {
      id: "water_temp",
      label: "Water Temp (C)",
      minWidth: 110,
    },
    {
      id: "water",
      label: "Water Type",
      minWidth: 110,
    //   orderingField: "water__name"
    },
    {
      id: "method",
      label: "Process",
      minWidth: 110,
    //   orderingField: "method__name"
    },
  ],
  fields: [
    {
        type: "text",
        name: "name",
        label: "Recipe Name",
        required: true,
        size: { xs: 12, sm: 6 },
        placeholder: "e.g. Morning V60 - Medium Roast",
    },
    {
        type: "dropdown",
        name: "template",
        label: "Recipe Template",
        required: true,
        size: { xs: 12, sm: 6 },
        optionSource: "recipieTemplates",
    },
    {
        type: "text_numeric",
        name: "dose_grams",
        label: "Bean Dose (g)",
        required: true,
        size: { xs: 12, sm: 4 },
        placeholder: "18",
    },
    {
        type: "text_numeric",
        name: "water_grams",
        label: "Water (g)",
        required: true,
        size: { xs: 12, sm: 4 },
        placeholder: "300",
    },
    {
        type: "text_numeric",
        name: "water_temp",
        label: "Water Temp (C)",
        required: true,
        size: { xs: 12, sm: 4 },
        placeholder: "93",
    },
    {
        type: "dropdown",
        name: "method",
        label: "Brew Method",
        required: true,
        size: { xs: 12, sm: 6 },
        optionSource: "methods",
    },
    {
        type: "dropdown",
        name: "water",
        label: "Water Type",
        required: true,
        size: { xs: 12, sm: 6 },
        optionSource: "waters",
    },
  ],
};
