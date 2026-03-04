import { AddBeansPage, ListBeansPage } from '../pages/coffeelog/beans/index';
import { AddRoasterCafePage, ListRoasterCafesPage } from '../pages/coffeelog/roasters/index';
import { AddDrinkReportPage } from '../pages/coffeelog/drinks/index';

export const coffeelogOptionsRow1 = [
  {
    id: 'AddBeans',
    title:'Add Beans',
    description: 'Add new beans from an exsisting roaster/cafe',
    path: 'AddBeans',
    element: <AddBeansPage />
  },
  {
    id: 'AddRoasterCafe',
    title:'Add Shop/Roaster',
    description: 'Add new cafe/roaster to historical list',
    path: 'AddRoasterCafe',
    element: <AddRoasterCafePage />
  },
  {
    id: 'AddDrinkReport',
    title:'Add Drink Report',
    description: 'Add new report about drink from an existing roaster/cafe',
    path: 'AddDrinkReport',
    element: <AddDrinkReportPage />
  }
];

export const coffeelogOptionsRow2 = [
  {
    id: 'ListBeans',
    title:'List Beans',
    description: 'Get list of existing Roasters in system',
    path: 'ListBeans',
    element: <ListBeansPage />
  },
  {
    id: 'ListRoasters',
    title:'List Roasters',
    description: 'Get list of existing Roasters in system',
    path: 'ListRoasters',
    element: <ListRoasterCafesPage />
  }
];


export const coffeelogOptions = [
  ...coffeelogOptionsRow1,
  ...coffeelogOptionsRow2,
];