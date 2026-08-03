import NavCardGrid from '../../components/NavCardGrid';
import { adjustmentOptionsRow, adjustmentIsNavRoot }
  from '../../constants/config/brew/_index';

export default function BrewAdjustmentsCardSelect() {
  return (
    <NavCardGrid
      options={adjustmentOptionsRow}
      isNavRoot={adjustmentIsNavRoot}
    />
  );
}