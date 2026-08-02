// src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';

// --- top-level pages ---
import { HomePage, MapsPage, LogHistoryPage, CoffeeLogCardSelect } from './pages';

// --- coffeelog ---
import CoffeeLogLayout from './pages/coffeelog/CoffeeLogLayout';
import { coffeelogOptions } from './constants/routes/coffeeLogRoutes';

// --- brew: layouts ---
import BrewAdjustmentsLayout from './pages/brewAdjustments/BrewAdjustmentsLayout';
import BrewTemplatesLayout from './pages/brewAdjustments/templates/BrewTemplatesLayout';
import BrewControlsLayout from './pages/brewAdjustments/controls/BrewControlsLayout';
import BrewSessionsLayout from './pages/brewSessions/BrewSessionsLayout';

// --- brew: card selects ---
import BrewAdjustmentsCardSelect from './pages/brewAdjustments/BrewAdjustmentsCardSelect';
import BrewTemplatesCardSelect from './pages/brewAdjustments/templates/BrewTemplatesCardSelect';
import BrewControlsCardSelect from './pages/brewAdjustments/controls/BrewControlsCardSelect';
import BrewSessionsCardSelect from './pages/brewSessions/BrewSessionsCardSelect';

// --- brew: generated route lists (NAMED exports) ---
import { brewControlsRouteList } from './constants/config/brew/controls/_routes';
import { brewSessionsRouteList } from './constants/config/brew/sessions/_routes';
import { brewTemplatesRouteList } from './constants/config/brew/templates/_routes';

// --- shell ---
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

          <Route path="/adjustments" element={<BrewAdjustmentsLayout />}>
            <Route index element={<BrewAdjustmentsCardSelect />} />

            <Route path="controls" element={<BrewControlsLayout />}>
              <Route index element={<BrewControlsCardSelect />} />
              {brewControlsRouteList.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>

            <Route path="templates" element={<BrewTemplatesLayout />}>
              <Route index element={<BrewTemplatesCardSelect />} />
              {brewTemplatesRouteList.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>
          </Route>

          <Route path="/brewSession" element={<BrewSessionsLayout />}>
            <Route index element={<BrewSessionsCardSelect />} />
            {brewSessionsRouteList.map(({ path, element }) => (
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