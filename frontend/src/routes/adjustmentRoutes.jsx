import { BeansFormPage, ListBeansPage } from '../pages/coffeelog/beans/index';
import { RoasterCafeFormPage ,ListRoasterCafesPage } from '../pages/coffeelog/roasters/index';
import { ListDrinksPage, DrinksFormPage } from '../pages/coffeelog/drinks/index';

export const adjustmentOptionsRow1 = [
  {
    id: 'AdjType1',
    title:'Adjustments Add/Modify Adjustment Type 1',
    description: 'Add/Modify Adjustment Category 1',
    path: 'adjustments/type1',
    element: <BeansFormPage />
  }
];

export const adjustmentOptionsRow2 = [
  {
    id: 'AdjType2',
    title:'Adjustments Add/Modify Adjustment Type 2',
    description: 'Add/Modify Adjustment Category 2',
    path: 'adjustments/type2',
    element: <ListBeansPage />
  }
];

const detailModes = ['view', 'edit'];

const makeDetailRoutes = (entity, Component) =>
  detailModes.map(mode => ({
    id: `${mode}${entity}`,
    path: `${entity}/${mode}/:shortid`,
    element: <Component mode={mode} />,
  }));

export const adjustmentOptionsMasked = [
  ...makeDetailRoutes('beans', BeansFormPage),
  ...makeDetailRoutes('roasters', RoasterCafeFormPage),
  ...makeDetailRoutes('drinks', DrinksFormPage),
];

export const adjustmentOptions = [
  ...adjustmentOptionsRow1,
  ...adjustmentOptionsRow2,
  ...adjustmentOptionsMasked
];