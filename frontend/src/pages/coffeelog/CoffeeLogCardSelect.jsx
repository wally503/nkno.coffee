import NavCardGrid from '../../components/NavCardGrid';
import { coffeelogOptionsRow1, coffeelogOptionsRow2, coffeelogIsNavRoot }
  from '../../constants/config/coffeelog/_shared';

export default function CoffeeLogCardSelect() {
  return (
    <NavCardGrid
      rows={[coffeelogOptionsRow1, coffeelogOptionsRow2]}
      isNavRoot={coffeelogIsNavRoot}
    />
  );
}