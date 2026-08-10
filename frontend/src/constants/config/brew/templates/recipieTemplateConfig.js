// src/constants/config/brew/templates/recipieTemplateConfig.js
import { TEMPLATES_BASE } from './_base';

export const recipieTemplateConfig = {
  key: 'recipietemplate',
  label: 'Recipe Template',
  labelPlural: 'Recipe Templates',
  base: `${TEMPLATES_BASE}/recipietemplates`,
  uriPath: 'brew/recipietemplates/',
  cardStyle: 'default',
  hub: TEMPLATES_BASE,
  columns: [
    {
      id: "name",
      label: "Template Name",
      minWidth: 150,
    },
    {
      id: "grinder",
      label: "Grinder",
      minWidth: 120,
      // orderingField: "grinder__name"
    },
    {
      id: "vessel",
      label: "Vessel",
      minWidth: 120,
      // orderingField: "vessel__name"
    },
  ],
  fields: [
    {
      type: "text",
      name: "name",
      label: "Template Name",
      required: true,
      size: { xs: 12, sm: 6 },
      placeholder: "e.g. Standard V60 Shape",
    },
    {
      type: "dropdown",
      name: "grinder",
      label: "Grinder",
      required: false,
      size: { xs: 12, sm: 3 },
      optionSource: "grinders",
    },
    {
      type: "dropdown",
      name: "vessel",
      label: "Brew Vessel",
      required: false,
      size: { xs: 12, sm: 3 },
      optionSource: "vessels",
    },
    {
      type: "long_text",
      name: "markup",
      label: "Template Markup",
      required: false,
      size: { xs: 12 },
      placeholder: "[[grinder.grind_size]] steps and holes go here",
    },
  ],
};