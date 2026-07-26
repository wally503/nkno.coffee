// src/constants/routes/coffeeLogRoutes.jsx
//
// Coffee Log section routes. Real pages (these exist), so elements are kept.
// Paths normalized: plural entities, {entity}/add, {entity}/list, detail modes.

import { BeansFormPage, ListBeansPage } from '../../pages/coffeelog/beans/index';
import { RoasterCafeFormPage, ListRoasterCafesPage } from '../../pages/coffeelog/roasters/index';
import { ListDrinksPage, DrinksFormPage } from '../../pages/coffeelog/drinks/index';

// Row 1 = "add" verbs
export const coffeelogOptionsRow1 = [
  {
    id: 'AddBeans',
    title: 'Add Beans',
    description: 'Add new beans from an existing roaster/cafe',
    path: 'beans/add',
    cardStyle: 'default',
    element: <BeansFormPage />,
  },
  {
    id: 'AddRoasterCafe',
    title: 'Add Shop/Roaster',
    description: 'Add new cafe/roaster to historical list',
    path: 'roasters/add',
    cardStyle: 'default',
    element: <RoasterCafeFormPage />,
  },
  {
    id: 'AddDrink',
    title: 'Add Drink',
    description: 'Add new drink from an existing roaster/cafe',
    path: 'drinks/add', // was 'drink' — normalized
    cardStyle: 'default',
    element: <DrinksFormPage />,
  },
];

// Row 2 = "list" verbs
export const coffeelogOptionsRow2 = [
  {
    id: 'ListBeans',
    title: 'List Beans',
    description: 'Get list of existing beans in system',
    path: 'beans/list',
    cardStyle: 'default',
    element: <ListBeansPage />,
  },
  {
    id: 'ListRoasters',
    title: 'List Roasters',
    description: 'Get list of existing roasters in system',
    path: 'roasters/list',
    cardStyle: 'default',
    element: <ListRoasterCafesPage />,
  },
  {
    id: 'ListDrinks',
    title: 'List Drinks',
    description: 'Get list of existing drinks in system',
    path: 'drinks/list',
    cardStyle: 'default',
    element: <ListDrinksPage />,
  },
];

const detailModes = ['view', 'edit'];

const makeDetailRoutes = (entity, Component) =>
  detailModes.map((mode) => ({
    id: `${mode}${entity}`,
    path: `${entity}/${mode}/:shortid`,
    element: <Component mode={mode} />,
  }));

// masked = reachable by URL, not shown as cards
export const coffeelogOptionsMasked = [
  ...makeDetailRoutes('beans', BeansFormPage),
  ...makeDetailRoutes('roasters', RoasterCafeFormPage),
  ...makeDetailRoutes('drinks', DrinksFormPage),
];

// consumed by the router (.map over path/element)
export const coffeelogOptions = [
  ...coffeelogOptionsRow1,
  ...coffeelogOptionsRow2,
  ...coffeelogOptionsMasked,
];

// this section is a top-level nav destination -> no back card at its index
export const coffeelogIsNavRoot = true;