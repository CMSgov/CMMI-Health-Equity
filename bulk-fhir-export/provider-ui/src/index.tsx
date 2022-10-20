import React from "react";
import { ExportConfigServiceApi } from "./api";
import * as ReactDOM from "react-dom";
import { IconClose } from "@trussworks/react-uswds";

import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  useNavigate,
} from "react-router-dom";
import ExportConfigPage from "./components/ExportConfigPage";

function Routes() {
  let navigate = useNavigate();
  const goToConfigPage = (id: string) => navigate(`/provider/config/${id}`);
  return (
    <div className="grid-container">
      <Switch>
        <Route
          path="/provider"
          element={
            <ExportConfigPage onNavigate={(id: string) => goToConfigPage(id)} />
          }
        ></Route>
        <Route
          path="/provider/config/:id"
          element={
            <ExportConfigPage onNavigate={(id: string) => goToConfigPage(id)} />
          }
        />
      </Switch>
    </div>
  );
}

const api = new ExportConfigServiceApi({
  baseUrl: "/provider/api",
  fetch,
});

export const ExportConfigServiceContext =
  React.createContext<ExportConfigServiceApi>(api);

function App() {
  return (
    <div>
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <div className="usa-logo" id="basic-logo">
              <em className="usa-logo__text">
                <a href="/provider/" title="FHIR Bulk Sandbox">
                  Participant Bulk Sandbox
                </a>
              </em>
            </div>
          </div>
          <nav aria-label="Primary navigation" className="usa-nav">
            <button className="usa-nav__close">
              <IconClose />
            </button>
            <ul className="usa-nav__primary usa-accordion">
              <li className="usa-nav__primary-item">
                <a href="/provider/">New Config</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <ExportConfigServiceContext.Provider value={api}>
        <Router>
          <Routes />
        </Router>
      </ExportConfigServiceContext.Provider>
    </div>
  );
}


const app = document.getElementById("root")
ReactDOM.render(<App />, app);