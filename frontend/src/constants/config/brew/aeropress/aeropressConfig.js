// src/constants/config/brew/aeropress/aeropressConfig.js
import { BREW_BASE } from '../_base'; // adjust if the real brew base-path constant lives elsewhere

export const AEROPRESS_STATIC_OPTIONS = {
  base: [
    { label: 'Standard', value: 'standard' },
    { label: 'Fellow Prismo', value: 'prismo' },
  ],
  filter: [
    { label: 'None', value: 'none' },
    { label: 'Single', value: 'single' },
    { label: 'Classic', value: 'classic' },
  ],
  orientation: [
    { label: 'Standard', value: 'standard' },
    { label: 'Inverted', value: 'inverted' },
  ],
  pour_direction: [
    { label: 'Spin', value: 'spin' },
    { label: 'Center', value: 'center' },
  ],
  pre_wet: [
    { label: 'Yes', value: 'wet' },
    { label: 'No', value: 'dry' },
  ],
  cup: [
    { label: 'Ceramic', value: 'ceramic' },
    { label: 'Glass', value: 'glass' },
    { label: 'Origami Aroma Cup', value: 'origami_aroma' },
  ],
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

export const aeropressConfig = {
  key: 'aeropress',
  label: 'Aeropress Brew',
  labelPlural: 'Aeropress Brews',
  base: `${BREW_BASE}/aeropress`,
  uriPath: 'aeropress/',

  // Column metadata for the By Style history list view — mirrors beansConfig's
  // `columns`, filled in when the Brew History / By Style page gets built.
  columns: [
    { id: "date", label: "Date", minWidth: 100, orderingField: "brew_log__date" },
    { id: "bean", label: "Bean", minWidth: 160, orderingField: "brew_log__bean__name" },
    { id: "extraction_rating", label: "Rating", minWidth: 80 },
    { id: "orientation", label: "Orientation", minWidth: 100 },
    { id: "grinder", label: "Grinder", minWidth: 140 },
  ],

  fields: [
    // brew log fields — locks the bean, sets the date/rating for this session
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

    // aeropress detail fields
    {
      type: "dropdown",
      name: "base",
      label: "Base",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: AEROPRESS_STATIC_OPTIONS.base,
    },
    {
      type: "dropdown",
      name: "orientation",
      label: "Orientation",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: AEROPRESS_STATIC_OPTIONS.orientation,
    },
    {
      type: "dropdown",
      name: "filter",
      label: "Filter",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: AEROPRESS_STATIC_OPTIONS.filter,
    },
    {
      type: "dropdown",
      name: "scale",
      label: "Scale",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      optionSource: "scales",
    },

    {
      type: "dropdown",
      name: "kettle",
      label: "Kettle",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      optionSource: "kettles",
    },
        {
      type: "dropdown",
      name: "cup",
      label: "Cup",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: AEROPRESS_STATIC_OPTIONS.cup,
    },
    { type: "divider" },

    // shared grind/water/scale fields (from BrewBaseMixin)
    {
      type: "dropdown",
      name: "grinder",
      label: "Grinder",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      optionSource: "grinders",
    },
    {
      type: "text_numeric",
      name: "grind_rotations",
      label: "Grind Rotations",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "3",
    },
    {
      type: "text_numeric",
      name: "grind_position",
      label: "Grind Position",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "5.5",
    },
    {
      type: "dropdown",
      name: "water_type",
      label: "Water Type",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: AEROPRESS_STATIC_OPTIONS.water_type,
    },
    {
      type: "dropdown",
      name: "pour_direction",
      label: "Pour Direction",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: AEROPRESS_STATIC_OPTIONS.pour_direction,
    },
    {
      type: "dropdown",
      name: "pre_wet",
      label: "Pre-wet Filter",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: AEROPRESS_STATIC_OPTIONS.pre_wet,
    },
    {
      type: "text_numeric",
      name: "temp",
      label: "Water Temp (C°)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "93",
    },
    {
      type: "text_numeric",
      name: "water",
      label: "Water (g)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "250",
    },
    {
      type: "text_numeric",
      name: "weight",
      label: "Bean Weight (g)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "18",
    },
    { type: "divider" },

    // variable-count Hoffmann stir events — no `size`, same as beansConfig's
    // dynamic_dropdown (flavor_notes): the shell hardcodes its own Grid offset/width.
    {
      type: "event_list",
      component: "hoffmann",
      name: "hoffmann_events",
      label: "Hoffmann Events",
      required: false,
    },

    { type: "divider" },

    {
      type: "long_text",
      name: "notes",
      label: "Notes",
      required: false,
      size: { xs: 12 },
      placeholder: "Tasting notes, what you'd change next time",
    },
    {
      type: "rating",
      name: "extraction_rating",
      label: "Extraction Rating",
      required: true,
      size: { xs: 12, sm: 6, md: 6 },
    },
  ],
};