import { BeansFormPage, ListBeansPage } from '../pages/coffeelog/beans/index';
import { RoasterCafeFormPage ,ListRoasterCafesPage } from '../pages/coffeelog/roasters/index';
import { ListDrinksPage, DrinksFormPage } from '../pages/coffeelog/drinks/index';

export const coffeelogOptionsRow1 = [
  {
    id: 'AddBeans',
    title:'Add Beans',
    description: 'Add new beans from an exsisting roaster/cafe',
    path: 'beans/add',
    element: <BeansFormPage />
  },
  {
    id: 'AddRoasterCafe',
    title:'Add Shop/Roaster',
    description: 'Add new cafe/roaster to historical list',
    path: 'roasters/add',
    element: <RoasterCafeFormPage />
  },
  {
    id: 'AddDrink',
    title:'Add Drink',
    description: 'Add new drink from an existing roaster/cafe',
    path: 'drink',
    element: <DrinksFormPage />
  }
];

export const coffeelogOptionsRow2 = [
  {
    id: 'ListBeans',
    title:'List Beans',
    description: 'Get list of existing Roasters in system',
    path: 'beans/list',
    element: <ListBeansPage />
  },
  {
    id: 'ListRoasters',
    title:'List Roasters',
    description: 'Get list of existing Roasters in system',
    path: 'roasters/list',
    element: <ListRoasterCafesPage />
  },
  {
    id: 'ListDrinks',
    title:'List Drinks',
    description: 'Get list of existing Drinks in system',
    path: 'drinks/list',
    element: <ListDrinksPage />
  }
];

const detailModes = ['view', 'edit'];

const makeDetailRoutes = (entity, Component) =>
  detailModes.map(mode => ({
    id: `${mode}${entity}`,
    path: `${entity}/${mode}/:shortid`,
    element: <Component mode={mode} />,
  }));

export const coffeelogOptionsMasked = [
  ...makeDetailRoutes('beans', BeansFormPage),
  ...makeDetailRoutes('roasters', RoasterCafeFormPage),
  ...makeDetailRoutes('drinks', DrinksFormPage),
];

export const coffeelogOptions = [
  ...coffeelogOptionsRow1,
  ...coffeelogOptionsRow2,
  ...coffeelogOptionsMasked
];