import NavCardGrid from '../../../components/NavCardGrid';
import { brewControlOptionsRow1, brewControlOptionsRow2, brewControlsIsNavRoot } from '../../../constants/config/brew/controls/_routes';

export default function BrewTemplatesCardSelect() {
  return (
    <NavCardGrid
      rows={[brewControlOptionsRow1, brewControlOptionsRow2]}
      isNavRoot={brewControlsIsNavRoot}
    />
  );
}