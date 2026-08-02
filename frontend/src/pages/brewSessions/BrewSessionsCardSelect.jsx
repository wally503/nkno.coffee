import NavCardGrid from '../../components/NavCardGrid';
import { brewSessionOptionsRow1, brewSessionOptionsRow2, brewSessionsIsNavRoot }
  from "../../constants/config/brew/sessions/_routes";

export default function BrewSessionsCardSelect() {
  return (
    <NavCardGrid
    options={[...brewSessionOptionsRow1, ...brewSessionOptionsRow2]}
      // options={brewSessionOptions}
      isNavRoot={brewSessionsIsNavRoot}
    />
  );
}