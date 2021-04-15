import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.less";

import MainLayout from "./pages/MainLayout";

const App: React.FC = function () {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <MainLayout />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
