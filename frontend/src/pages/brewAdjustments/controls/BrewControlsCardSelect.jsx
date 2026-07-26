import NavCardGrid from '../../../components/NavCardGrid';
import { brewControlOptionsRow1, brewControlOptionsRow2, brewControlsIsNavRoot } from '../../../constants/routes/brewControlsRoutes';

export default function BrewTemplatesCardSelect() {
  return (
    <NavCardGrid
      rows={[brewControlOptionsRow1, brewControlOptionsRow2]}
      isNavRoot={brewControlsIsNavRoot}
    />
  );
}