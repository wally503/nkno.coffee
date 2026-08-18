//src/pages/index.js
export { default as HomePage } from './Home';
export { default as MapsPage } from './Maps';
export { default as CoffeeLogCardSelect } from './coffeelog/CoffeeLogCardSelect';
export { default as NavCardGrid } from '../components/NavCardGrid';
export { default as LogHistoryPage } from './LogHistory';


// brew: New Brew + Brew History replace the old Adjustments (Templates/Controls)
// and Sessions (stubbed, never finished) sections.
export { default as PickBrewStyle } from './brew/newBrew/PickBrewStyle';
export { default as BrewNewLayout } from './brew/newBrew/BrewNewLayout';
export { default as BrewHistoryCardSelect } from './brewHistory/BrewHistoryCardSelect';
export { default as BrewHistoryLayout } from './brewHistory/BrewHistoryLayout';