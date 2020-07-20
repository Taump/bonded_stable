import React from "react";
import { Router, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import historyInstance from "./historyInstance";
import { HomePage, CreatePage, SettingsPage } from "./pages";
import { Spinner } from "./components/Spinner/Spinner";

const AppRouter = () => {
  const connected = useSelector((state) => state.connected);
  if (!connected) return <Spinner />;
  return (
    <Router history={historyInstance}>
      <Route path="/" component={HomePage} exact />
      <Route path="/create" component={CreatePage} />
      <Route path="/settings" component={SettingsPage} />
    </Router>
  );
};

export default AppRouter;
