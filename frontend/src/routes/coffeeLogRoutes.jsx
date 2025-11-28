import AddBeansPage from '../pages/coffeelog/beans/AddBeans.jsx';
import AddRoasterCafePage from '../pages/coffeelog/roasters/AddRoasterCafe.jsx';
import AddDrinkReportPage from '../pages/coffeelog/drinks/AddDrinkReport.jsx';

export const coffeelogOptions = [
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