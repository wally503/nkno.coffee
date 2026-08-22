// src/constants/config/brew/newBrew/_routes.jsx
//
// New Brew leaf routes only. PickBrewStyle is this section's CardSelect
// equivalent — wired directly in App.jsx as the index route, same pattern
// as BrewControlsCardSelect/BrewTemplatesCardSelect were.
//
// Unlike controls/templates before it, these pages are bespoke per-style
// components (AeropressFormPage, etc.) rather than config-driven DynamicForm —
// see aeropressConfig.js comments for why.

import EspressoFormPage from '../../../../pages/brew/espresso/AddEspresso';
import AeropressFormPage from '../../../../pages/brew/aeropress/AddAeropress';
import PouroverFormPage from '../../../../pages/brew/pourover/AddPourover';
// import ColdBrewFormPage from '../../../../pages/brew/coldBrew/AddColdBrew';

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

  // Espresso / Milk Drink intentionally omitted — no route until the
  // mod kit lands and EspressoDetail/MilkDrinkDetail actually exist.
];