// src/pages/brew/newBrew/BrewNewLayout.jsx
//
// Shape inferred from how BrewSessionsLayout is used in App.jsx —
// haven't seen BrewSessionsLayout's actual source. If it does more than
// wrap an Outlet (nav chrome, breadcrumbs, etc.), copy that instead of this.

import { Outlet } from "react-router-dom";

export default function BrewNewLayout() {
  return <Outlet />;
}