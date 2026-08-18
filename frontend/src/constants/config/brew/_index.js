import { newBrewRouteList } from './newBrew/_routes';
import { historyRouteList } from './history/_routes';
 
// Templates, Controls, and Sessions (stubbed, never finished) are gone —
// replaced by New Brew (bespoke per-style forms) and Brew History
// (Log + By Style). Both are now top-level navbar destinations, not
// cards under an Adjustments hub, so adjustmentOptionsRow/adjustmentIsNavRoot
// have no brew-relevant meaning anymore and are dropped.
 
export const brewRoutes = {
  newBrew: newBrewRouteList,
  history: historyRouteList,
};
 