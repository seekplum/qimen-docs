import React from "react";
import { Switch, Route, Redirect } from "react-router";

import SceneList from "./SceneList";
import ApiList from "./ApiList";
import ApiDocument from "./ApiDocument";
import { ROUTES } from "../common/constants";

const MainLayout: React.FC = function () {
  return (
    <Switch>
      <Route path={ROUTES.DOCUMENT} exact>
        <ApiDocument />
      </Route>
      <Route path={ROUTES.API} exact>
        <ApiList />
      </Route>
      <Route path={ROUTES.SCENE} exact>
        <SceneList />
      </Route>
      <Redirect path="*" to={ROUTES.SCENE} />
    </Switch>
  );
};

export default MainLayout;
