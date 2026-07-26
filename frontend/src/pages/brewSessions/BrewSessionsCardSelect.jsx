import NavCardGrid from '../../components/NavCardGrid';
import { brewSessionOptions, brewSessionsIsNavRoot }
  from '../../constants/routes/brewSessionsRoutes';

export default function BrewSessionsCardSelect() {
  return (
    <NavCardGrid
      options={brewSessionOptions}
      isNavRoot={brewSessionsIsNavRoot}
    />
  );
}