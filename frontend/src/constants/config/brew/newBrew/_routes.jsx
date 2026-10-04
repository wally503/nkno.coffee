// src/constants/config/brew/newBrew/_routes.jsx
//
// New Brew leaf routes only. PickBrewStyle is this section's CardSelect
// equivalent — wired directly in App.jsx as the index route, same pattern
// as BrewControlsCardSelect/BrewTemplatesCardSelect were.
// 
// Unlike controls/templates before it, these pages are bespoke per-style
// components (AeropressFormPage, etc.) rather than config-driven DynamicForm —
// see aeropressConfig.js comments for why.

import EspressoFormPage from '../../../../pages/brew/espresso/EspressoForm';
import AeropressFormPage from '../../../../pages/brew/aeropress/AeropressForm';
import PouroverFormPage from '../../../../pages/brew/pourover/PouroverForm';
import ColdbrewFormPage from '../../../../pages/brew/coldbrew/ColdbrewForm';
import CuppingFormPage from '../../../../pages/brew/cupping/CuppingForm';

export const newBrewRouteList = [
  {
    path: 'espresso/add',
    element: <EspressoFormPage />,
  },
  {
    path: 'espresso/edit/:shortid',
    element: <EspressoFormPage />,
  },
  {
    path: 'espresso/view/:shortid',
    element: <EspressoFormPage />,
  },
  
  {
    path: 'aeropress/add',
    element: <AeropressFormPage />,
  },
  {
    path: 'aeropress/edit/:shortid',
    element: <AeropressFormPage />,
  },
  {
    path: 'aeropress/view/:shortid',
    element: <AeropressFormPage />,
  },

  {
    path: 'pourover/add',
    element: <PouroverFormPage />,
  },
  {
    path: 'pourover/edit/:shortid',
    element: <PouroverFormPage />,
  },
  {
    path: 'pourover/view/:shortid',
    element: <PouroverFormPage />,
  },

  // Cold Brew slots in here once its form page exists, same three-route shape.

  { 
    path: 'cupping/add', 
    element: <CuppingFormPage /> 
  },
  { 
    path: 'cupping/edit/:shortid', 
    element: <CuppingFormPage /> 
  },
  { 
    path: 'cupping/view/:shortid', 
    element: <CuppingFormPage /> 
  },

  { 
    path: 'cold-brew/add', 
    element: <ColdbrewFormPage /> 
  },
  { 
    path: 'cold-brew/edit/:shortid', 
    element: <ColdbrewFormPage /> 
  },
  { 
    path: 'cold-brew/view/:shortid', 
    element: <ColdbrewFormPage /> 
  },

  // Espresso / Milk Drink intentionally omitted — no route until the
  // mod kit lands and EspressoDetail/MilkDrinkDetail actually exist.
];