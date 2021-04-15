import React from "react";
import { Switch, Route, Redirect } from "react-router";

import SceneList from "./SceneList";
import ApiList from "./ApiList";
import ApiDocument from "./ApiDocument";

const MainLayout = function () {
  return (
    <Switch>
      <Route path="/document" exact>
        <ApiDocument />
      </Route>
      <Route path="/api" exact>
        <ApiList />
      </Route>
      <Route path="/scene" exact>
        <SceneList />
      </Route>
      <Redirect path="*" to="/scene" />
    </Switch>
  );
};

export default MainLayout;
