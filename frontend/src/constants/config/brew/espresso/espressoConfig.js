// src/constants/config/brew/espresso/espressoConfig.js
import { BREW_BASE } from '../_base'; // adjust if the real brew base-path constant lives elsewhere

export const ESPRESSO_STATIC_OPTIONS = {
  machine: [
    { label: 'Gaggia Classic Pro (Unmodded)', value: 'gaggia_unmod' },
  ],
  puck_screen: [
    { label: 'None', value: 'none' },
    { label: 'Normcore Puck Screen - 316 Stainless', value: 'normcore_316_ss' },
  ],
  basket: [
    { label: 'Normcore High Extraction Basket', value: 'nc_high_ext' },
    { label: 'Normcore Precision Basket', value: 'nc_prec' },
  ],
  wdt_used: [
    { label: 'Used', value: 'used' },
    { label: 'Not Used', value: 'not_used' },
  ],
  tamper: [
    { label: 'Normcore V4.1 Spring Tamper (Flat)', value: 'nc_41_flat' },
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
  paper_filter_type: [
    { label: 'None', value: 'none' },
    { label: 'Normcore Filter', value: 'normcore' },
  ],
  paper_filter_used: [
    { label: 'Used', value: 'used' },
    { label: 'Not Used', value: 'not_used' },
  ],
};

export const espressoConfig = {
  key: 'espresso',
  label: 'Espresso Brew',
  labelPlural: 'Espresso Brews',
  base: `${BREW_BASE}/espresso`,
  uriPath: 'espresso/',

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

    // espresso detail fields
    {
      type: "dropdown",
      name: "machine",
      label: "Espresso Machine",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: ESPRESSO_STATIC_OPTIONS.machine,
    },
    {
      type: "dropdown",
      name: "basket",
      label: "Basket",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: ESPRESSO_STATIC_OPTIONS.basket,
    },
    {
      type: "dropdown",
      name: "puck_screen",
      label: "Puck Screen",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: ESPRESSO_STATIC_OPTIONS.puck_screen,
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
      name: "cup",
      label: "Cup",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: ESPRESSO_STATIC_OPTIONS.cup,
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
      options: ESPRESSO_STATIC_OPTIONS.water_type,
    },
    {
      type: "text_numeric",
      name: "weight",
      label: "Bean Weight (g)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "18",
    },
    {
      type: "spacer",
      size: { xs: 0, sm: 4, md: 4 },
      color: "rgba(180, 140, 100, 0)",
    },
    {
      type: "dropdown",
      name: "tamper",
      label: "Tamper",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: ESPRESSO_STATIC_OPTIONS.tamper,
    },
    {
      type: "dropdown",
      name: "wdt_used",
      label: "WDT Tool Used",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: ESPRESSO_STATIC_OPTIONS.wdt_used,
    },
    {
      type: "text_numeric",
      name: "wdt_rotations",
      label: "WDT Rotations",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
    },

    {
      type: "dropdown",
      name: "paper_filter_used",
      label: "Paper Filter Used",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: ESPRESSO_STATIC_OPTIONS.paper_filter_used,
    },
    {
      type: "dropdown",
      name: "paper_filter_type",
      label: "Paper Filter Type",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: ESPRESSO_STATIC_OPTIONS.paper_filter_type,
    },
    {
      type: "text_numeric",
      name: "paper_filter_count",
      label: "Number of Paper Filters Used",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
    },


    {
      type: "text_numeric",
      name: "pull_time",
      label: "Pull Time",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
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