import NavCardGrid from '../../components/NavCardGrid';
import { adjustmentOptionsRow1, adjustmentOptionsRow2, adjustmentIsNavRoot }
  from '../../constants/routes/adjustmentRoutes';

export default function BrewAdjustmentsCardSelect() {
  return (
    <NavCardGrid
      options={[...adjustmentOptionsRow1, ...adjustmentOptionsRow2]}
      isNavRoot={adjustmentIsNavRoot}
    />
  );
}