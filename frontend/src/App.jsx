// src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import {
  CoffeeLogCardSelect,
  AdjustmentCardSelect,
  BrewSessionCardSelect,
  HomePage,
  MapsPage,
  LogHistoryPage,
} from './pages';
import { ControlsCardSelect } from './pages'; // add to your pages/index barrel

import { coffeelogOptions } from './constants/routes/coffeeLogRoutes';
import { brewSessionOptions } from './constants/routes/brewSessionRoutes';
import { adjustmentOptions } from './constants/routes/adjustmentRoutes';

import CoffeeLogLayout from './pages/coffeelog/CoffeeLogLayout';
import AdjustmentsLayout from './pages/adjustment/AdjustmentLayout';
import BrewSessionLayout from './pages/brewSession/BrewSessionLayout';

import LoginPage from './Login';
import Layout from './Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/maps" element={<MapsPage />} />

          <Route path="/coffeeLog" element={<CoffeeLogLayout />}>
            <Route index element={<CoffeeLogCardSelect />} />
            {coffeelogOptions.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>

          <Route path="/brewSession" element={<BrewSessionLayout />}>
            <Route index element={<BrewSessionCardSelect />} />
            {brewSessionOptions.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>

          <Route path="/adjustments" element={<AdjustmentsLayout />}>
            <Route index element={<AdjustmentCardSelect />} />
            {/* controls sub-menu index (the fork into catalog entities) */}
            <Route path="controls" element={<ControlsCardSelect />} />
            {adjustmentOptions.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>

          <Route path="/logHistory" element={<LogHistoryPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;