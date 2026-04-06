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

export const coffeelogOptionsMasked = [
  {
    id: 'EditBeans',
    title:'Edit Beans',
    description: 'Edit an existing bean in system',
    path: 'beans/edit/:shortid',
    element: <BeansFormPage />
  },
  {
    id: 'ViewBeans',
    title:'View Beans',
    description: 'View an existing bean in system',
    path: 'beans/view/:shortid',
    element: <BeansFormPage />
  },
  {
    id: 'EditRoasters',
    title:'Edit Roaster',
    description: 'Edit an existing roaster in system',
    path: 'roasters/edit/:shortid',
    element: <RoasterCafeFormPage />
  },
  {
    id: 'ViewRoasters',
    title:'View Roaster',
    description: 'View an existing roaster in system',
    path: 'roasters/view/:shortid',
    element: <RoasterCafeFormPage />
  },
  {
    id: 'EditDrinks',
    title:'Edit Drinks',
    description: 'Edit an existing drink in system',
    path: 'drinks/edit/:shortid',
    element: <DrinksFormPage />
  },
  {
    id: 'ViewDrinks',
    title:'View Drinks',
    description: 'View an existing drink in system',
    path: 'drinks/view/:shortid',
    element: <DrinksFormPage />
  },
];


export const coffeelogOptions = [
  ...coffeelogOptionsRow1,
  ...coffeelogOptionsRow2,
  ...coffeelogOptionsMasked
];