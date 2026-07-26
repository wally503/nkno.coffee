import NavCardGrid from '../../../components/NavCardGrid';
import { brewTemplateOptionsRow1, brewTemplateOptionsRow2, brewTemplatesIsNavRoot }
  from '../../../constants/routes/brewTemplatesRoutes';

export default function BrewTemplatesCardSelect() {
  return (
    <NavCardGrid
      options={[...brewTemplateOptionsRow1, ...brewTemplateOptionsRow2]}
      isNavRoot={brewTemplatesIsNavRoot}
    />
  );
}