// src/constants/config/brew/cupping/cuppingConfig.js
import { BREW_BASE } from '../_base';

export const CUPPING_STATIC_OPTIONS = {
  water_type: [
    { label: 'Straight Distilled', value: 'distilled' },
    { label: 'TWW Light', value: 'tww_light' },
    { label: 'TWW Medium', value: 'tww_medium' },
    { label: 'TWW Dark', value: 'tww_dark' },
    { label: 'TWW Espresso', value: 'tww_espresso' },
    { label: 'TWW Cold Brew', value: 'tww_cold_brew' },
    { label: 'TWW Low Acid', value: 'tww_low_acid' },
    { label: 'Tap Water', value: 'tap' },
  ],
};

export const cuppingConfig = {
  key: 'cupping',
  label: 'Cupping',
  labelPlural: 'Cuppings',
  base: `${BREW_BASE}/cupping`,
  uriPath: 'cupping/',

  columns: [
    { id: "date", label: "Date", minWidth: 100, orderingField: "brew_log__date" },
    { id: "bean", label: "Bean", minWidth: 160, orderingField: "brew_log__bean__name" },
    { id: "extraction_rating", label: "Rating", minWidth: 80 },
    { id: "grinder", label: "Grinder", minWidth: 140 },
  ],

  fields: [
    // brew log fields
    {
      type: "dropdown",
      name: "bean",
      label: "Bean",
      required: true,
      size: { xs: 12, sm: 8, md: 8 },
      optionSource: "beans",
      editDisable: true,
    },
    {
      type: "date_time",
      name: "date",
      label: "Date & Time",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      defaultNow: true,
    },

    { type: "divider" },

    // shared fields (from BrewBaseMixin)
    {
      type: "dropdown",
      name: "scale",
      label: "Scale",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      optionSource: "scales",
      defaultValue: 'gBgrpqk1',
    },
    {
      type: "dropdown",
      name: "grinder",
      label: "Grinder",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      optionSource: "grinders",
      defaultValue: 'bDY9UtLh',
    },
    {
      type: "dropdown",
      name: "water_type",
      label: "Water Type",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: CUPPING_STATIC_OPTIONS.water_type,
      defaultValue: 'tww_light',
    },
    {
      type: "text_numeric",
      name: "grind_rotations",
      label: "Grind Rotations",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "3",
      defaultValue: '2',
    },
    {
      type: "text_numeric",
      name: "grind_position",
      label: "Grind Position",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "5.5",
      defaultValue: '7',
    },
    {
      type: "spacer",
      size: { xs: 0, sm: 2, md: 2 },
      color: "rgba(180, 140, 100, 0)",
    },
    {
      type: "text_numeric",
      name: "weight",
      label: "Bean Weight (g)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "10",
    },

    // cupping detail fields (CuppingDetail)
    {
      type: "text_numeric",
      name: "water",
      label: "Water (g)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "166.6",
    },
    {
      type: "text_numeric",
      name: "steep_time",   // rename to "settle_time" if the model field kept that name
      label: "Steep Time (to break)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "04:00",
      inputStyle: "duration",
    },

    { type: "divider" },
    {
      type: 'tags',
      name: 'tags',
      label: "Tags",
      method: 'cupping',
      size: { xs: 12, sm: 6, md: 6 },
      defaultValue: [],
    },
    {
      type: "rating",
      name: "extraction_rating",
      label: "Rating",
      required: true,
      size: { xs: 12, sm: 6, md: 6 },
    },
    {
      type: "spacer",
      size: { xs: 0, sm: 1, md: 1 },
      color: "rgba(180, 140, 100, 0)",
    },
    {
      type: "long_text",
      name: "notes",
      label: "Notes",
      required: false,
      size: { xs: 12 },
      placeholder: "Fragrance, aroma, flavour, acidity, body, aftertaste",
    },
  ],
};