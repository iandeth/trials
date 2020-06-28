import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import "index.css";
import App from "App";
import List from "List";
import NotFound from "NotFound";
import { Router } from "@reach/router";

import * as serviceWorker from "serviceWorker";

// @ts-ignore
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App path="/" />
      <List path="/list" />
      <NotFound default />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
