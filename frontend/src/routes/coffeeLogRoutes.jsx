import AddBeansPage from '../pages/coffeelog/AddBeans.jsx';
import AddRoasterCafePage from '../pages/coffeelog/AddRoasterCafe.jsx';
import AddDrinkReportPage from '../pages/coffeelog/AddDrinkReport.jsx';

export const coffeelogOptions = [
  {
    id: 'AddBeans',
    path: 'AddBeans',
    element: <AddBeansPage />
  },
  {
    id: 'AddRoasterCafe',
    path: 'AddRoasterCafe',
    element: <AddRoasterCafePage />
  },
  {
    id: 'AddDrinkReport',
    path: 'AddDrinkReport',
    element: <AddDrinkReportPage />
  }
];