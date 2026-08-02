// src/constants/config/brew/vesselConfig.js
//
// Config for the BrewVessel catalog entity. Mirrors grinder (flat, no FK).
 
import { CONTROLS_BASE } from './_base';
 
export const vesselConfig = {
  // --- identity + location ---
  key: 'vessel',
  label: 'Vessel',
  labelPlural: 'Vessels',
  base: `${CONTROLS_BASE}/vessels`,
  uriPath: 'brew/vessels/',
 
  // --- table ---
  columns: [
    {
      id: 'name',
      label: 'Name',
      minWidth: 220,
      orderingField: 'name',
    },
    {
      id: 'brand',
      label: 'Brand',
      minWidth: 180,
      orderingField: 'brand',
    },
  ],
 
  // --- form ---
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'text',
    },
  ],
};