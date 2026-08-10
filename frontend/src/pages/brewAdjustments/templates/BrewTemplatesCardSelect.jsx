import NavCardGrid from '../../../components/NavCardGrid';
import { brewTemplateOptionsRow1, brewTemplateOptionsRow2, brewTemplatesIsNavRoot ,brewTemplatesRouteList }
  from '../../../constants/config/brew/templates/_routes';

export default function BrewTemplatesCardSelect() {
  return (
    <NavCardGrid
      options={[...brewTemplateOptionsRow1, ...brewTemplateOptionsRow2]}
      isNavRoot={brewTemplatesIsNavRoot}
    />
  );
}