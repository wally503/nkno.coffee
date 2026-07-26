// src/constants/routes/brewSessionRoutes.jsx
import { BeansFormPage, ListBeansPage } from '../../pages/coffeelog/beans/index';
import { RoasterCafeFormPage ,ListRoasterCafesPage } from '../../pages/coffeelog/roasters/index';
import { ListDrinksPage, DrinksFormPage } from '../../pages/coffeelog/drinks/index';

export const brewSessionOptionsRow1 = [
  {
    id: 'BrwSsnType1',
    title:'Brew Session Add/Modify Adjustment Type 1',
    description: 'Add/Modify Adjustment Category 1',
    path: 'adjustment/type1',
    element: <BeansFormPage />
  }
];

export const brewSessionOptionsRow2 = [
  {
    id: 'BrwSsnType2',
    title:'Brew Session Add/Modify Adjustment Type 2',
    description: 'Add/Modify Adjustment Category 2',
    path: 'adjustment/type2',
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

export const brewSessionOptionsMasked = [
  ...makeDetailRoutes('beans', BeansFormPage),
  ...makeDetailRoutes('roasters', RoasterCafeFormPage),
  ...makeDetailRoutes('drinks', DrinksFormPage),
];

export const brewSessionOptions = [
  ...brewSessionOptionsRow1,
  ...brewSessionOptionsRow2,
  ...brewSessionOptionsMasked
];