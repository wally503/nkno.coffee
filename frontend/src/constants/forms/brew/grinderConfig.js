// src/constants/forms/brew/grinderConfig.js
//
// Self-contained config for the Grinder catalog entity.
// - `columns` keyed by `id`   -> consumed by CoffeeTable
// - `fields`  keyed by `name` -> consumed by CoffeeLogFormShell (it reads formData[field.name])
// - `uriPath` (trailing slash) -> consumed by the dynamic API
// Flat entity, no FK — the clean case to prove the pattern.

export const grinderConfig = {
  key: 'grinder',
  label: 'Grinder',
  labelPlural: 'Grinders',

  uriPath: 'brew/grinders/',              // MUST end in '/'
  baseRoute: '/adjustments/controls/grinders',

  // list table (CoffeeTable reads column.id)
  columns: [
    { id: 'name',  label: 'Name',  minWidth: 220, orderingField: 'name' },
    { id: 'brand', label: 'Brand', minWidth: 180, orderingField: 'brand' },
    { id: 'date_added', label: 'Added', minWidth: 140, orderingField: 'date_added',
      render: (v) => (v ? new Date(v).toLocaleDateString('en-CA') : '-') },
  ],

  // add/edit form (CoffeeLogFormShell reads formData[field.name])
  fields: [
    { name: 'name',  label: 'Name',  type: 'text', required: true },
    { name: 'brand', label: 'Brand', type: 'text' },
  ],
};