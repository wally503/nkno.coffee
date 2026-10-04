// src/constants/config/brew/coldbrew/coldbrewConfig.js
import { BREW_BASE } from '../_base';

export const COLDBREW_STATIC_OPTIONS = {
  filter_style: [
    { label: 'Paper Filter', value: 'paper' },
    { label: 'Mesh / Nut-Milk Bag', value: 'mesh_bag' },
    { label: 'Fine Mesh Strainer (post-steep)', value: 'strainer' },
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

export const coldbrewConfig = {
  key: 'cold_brew',
  label: 'Cold Brew',
  labelPlural: 'Cold Brews',
  base: `${BREW_BASE}/coldbrew`,   // matches router.register('coldbrew', ...)
  uriPath: 'coldbrew/',

  columns: [
    { id: "date", label: "Date", minWidth: 100, orderingField: "brew_log__date" },
    { id: "bean", label: "Bean", minWidth: 160, orderingField: "brew_log__bean__name" },
    { id: "extraction_rating", label: "Rating", minWidth: 80 },
    { id: "filter_style", label: "Filter", minWidth: 120 },
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

    // cold brew detail fields (ColdBrewDetail)
    {
      type: "dropdown",
      name: "filter_style",
      label: "Filter",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: COLDBREW_STATIC_OPTIONS.filter_style,
    },
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
      name: "water_type",
      label: "Water Type",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: COLDBREW_STATIC_OPTIONS.water_type,
      defaultValue: 'tww_cold_brew',
    },

    { type: "divider" },

    // shared grind fields (from BrewBaseMixin)
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
      type: "text_numeric",
      name: "weight",
      label: "Bean Weight (g)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "100",
    },
    {
      type: "text_numeric",
      name: "water",
      label: "Water (g)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "800",
    },
    {
      type: "text_numeric",
      name: "settle_time",
      label: "Settle Time",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "10:00",
      inputStyle: "duration",   // MM:SS only, max 99:59 (see note)
    },

    { type: "divider" },
    {
      type: 'tags',
      name: 'tags',
      label: "Tags",
      method: 'cold_brew',
      size: { xs: 12, sm: 6, md: 6 },
      defaultValue: [],
    },
    {
      type: "rating",
      name: "extraction_rating",
      label: "Extraction Rating",
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
      placeholder: "Tasting notes, what you'd change next time",
    },
  ],
};