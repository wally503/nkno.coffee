// src/App.jsx
import './App.css';
import { Routes, Route } from 'react-router-dom';

// --- top-level pages ---
import { HomePage, MapsPage, LogHistoryPage, CoffeeLogCardSelect } from './pages';

// --- coffeelog ---
import CoffeeLogLayout from './pages/coffeelog/CoffeeLogLayout';
import { coffeelogOptions } from './constants/config/coffeelog/_shared';

// --- brew: layouts ---
import BrewNewLayout from './pages/brew/newBrew/BrewNewLayout';
import BrewHistoryLayout from './pages/brewHistory/BrewHistoryLayout';

// --- brew: card selects ---
import PickBrewStyle from './pages/brew/newBrew/PickBrewStyle';
import BrewHistoryCardSelect from './pages/brewHistory/BrewHistoryCardSelect';

// --- brew: generated route lists (NAMED exports) ---
import { newBrewRouteList } from './constants/config/brew/newBrew/_routes';
import { historyRouteList } from './constants/config/brew/history/_routes';

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
          <Route path="/logHistory" element={<LogHistoryPage />} />

          {/* CoffeeLog */}
          <Route path="/coffeeLog" element={<CoffeeLogLayout />}>
            <Route index element={<CoffeeLogCardSelect />} />
            {coffeelogOptions.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>

          {/* New Brew */}
          <Route path="/brew" element={<BrewNewLayout />}>
            <Route index element={<PickBrewStyle />} />
            {newBrewRouteList.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>

          {/* Brew History */}
          <Route path="/history" element={<BrewHistoryLayout />}>
            <Route index element={<BrewHistoryCardSelect />} />
            {historyRouteList.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;