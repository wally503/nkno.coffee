// src/constants/config/brew/pourover/pouroverConfig.js
import { BREW_BASE } from '../_base';

export const POUROVER_STATIC_OPTIONS = {
  dripper: [
    { label: 'Origami', value: 'origami' },
    { label: 'V60', value: 'v60' },
  ],
  cup: [
    { label: 'Ceramic', value: 'ceramic' },
    { label: 'Glass', value: 'glass' },
    { label: 'Origami Aroma Cup', value: 'origami_aroma' },
  ],
  pour_style: [
    { label: 'Center Focused', value: 'center' },
    { label: 'Clockwise', value: 'clockwise' },
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
  filter_type: [
    { label: 'Classic', value: 'classic' },
  ],
  pre_wet: [
    { label: 'Yes', value: 'wet' },
    { label: 'No', value: 'dry' },
  ],
};

export const pouroverConfig = {
  key: 'pourover',
  label: 'Pourover Brew',
  labelPlural: 'Pourover Brews',
  base: `${BREW_BASE}/pourover`,
  uriPath: 'pourover/',

  // Column metadata for the By Style history list view — mirrors aeropressConfig's columns.
  columns: [
    { id: "date", label: "Date", minWidth: 100, orderingField: "brew_log__date" },
    { id: "bean", label: "Bean", minWidth: 160, orderingField: "brew_log__bean__name" },
    { id: "extraction_rating", label: "Rating", minWidth: 80 },
    { id: "dripper", label: "Dripper", minWidth: 100 },
    { id: "grinder", label: "Grinder", minWidth: 140 },
  ],

  fields: [
    // bean + date up top, same spacer treatment as aeropressConfig
  {
    type: "dropdown",
    name: "bean",
    label: "Bean",
    required: true,
    size: { xs: 12, sm: 8, md: 8 },
    optionSource: "beans",
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

    // pourover-specific fields — dripper/filter_brand/filter_count as one row,
    // pre_wet as its own toggle row (binary — a switch reads better than a
    // 2-option dropdown), then kettle/scale/cup as an even 3-across row.
    {
      type: "dropdown",
      name: "dripper",
      label: "Dripper",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: POUROVER_STATIC_OPTIONS.dripper,
    },
    {
      type: "text",
      name: "filter_brand",
      label: "Filter Brand",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "Cafec Abaca",
    },
    {
      type: "text_numeric",
      name: "filter_count",
      label: "Filter Count",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "1",
    },
    {
     type: "dropdown",
     name: "filter_type",
     label: "Filter Type",
     required: true,
     size: { xs: 12, sm: 4, md: 4 },
     options: POUROVER_STATIC_OPTIONS.filter_type,
    },
    {
      type: "dropdown",
      name: "pre_wet",
      label: "Pre-wet filter?",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: POUROVER_STATIC_OPTIONS.pre_wet,
    },
    {
      type: "spacer",
      size: { xs: 0, sm: 4, md: 4 },
      color: "rgba(180, 140, 100, 0)",
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
      options: POUROVER_STATIC_OPTIONS.cup,
    },
    { type: "divider" },

    // shared grind/water/scale fields (from BrewBaseMixin), plus weight/temp/water.
    // water_type + pour_style + spacer mirrors aeropressConfig's
    // water_type + pour_direction + spacer row exactly.
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
      placeholder: "2",
    },
    {
      type: "text_numeric",
      name: "grind_position",
      label: "Grind Position",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "8.0",
    },
    {
      type: "dropdown",
      name: "water_type",
      label: "Water Type",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      options: POUROVER_STATIC_OPTIONS.water_type,
    },
    {
      type: "spacer",
      size: { xs: 0, sm: 8, md: 8 },
      color: "rgba(180, 140, 100, 0)",
    },
    {
      type: "text_numeric",
      name: "temp",
      label: "Water Temp (C°)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "94",
    },
    {
      type: "text_numeric",
      name: "water",
      label: "Water (g)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "320",
    },
    {
      type: "text_numeric",
      name: "weight",
      label: "Bean Weight (g)",
      required: true,
      size: { xs: 12, sm: 4, md: 4 },
      placeholder: "20",
    },

    { type: "divider" },

    // variable-count pour events — no `size`, same as hoffmann_events on
    // aeropressConfig: the shell hardcodes its own Grid offset/width for event_list.
    {
      type: "event_list",
      component: "pourover",
      name: "pour_events",
      label: "Pour Events",
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

    // rating pinned at the very end, same as aeropressConfig
    {
      type: "rating",
      name: "extraction_rating",
      label: "Extraction Rating",
      required: true,
      size: { xs: 12, sm: 6, md: 6 },
    },
  ],
};