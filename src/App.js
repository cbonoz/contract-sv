import React, { useState } from "react";
import Home from "./components/Home";
import About from "./components/About";
import Upload from "./components/Upload";
import { Navbar, NavItem, NavDropdown, Nav, MenuItem } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "./auth";
import { setAxiosHeader } from "./helpers/api";
import axios from "axios";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "./App.css";

import "filepond/dist/filepond.min.css";

import "react-toastify/dist/ReactToastify.css";

import contractsvLogo from "./assets/contract_sv_trans.png";
import FileInfo from "./components/FileInfo";
import Verification from "./components/Verification";

// Call it once in your app. At the root of your app is the best place
toast.configure();

const App = () => {
  const [authTokens, setAuthTokens] = useState(
    JSON.parse(localStorage.getItem("tokens") || "{}")
  );

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  const logout = () => {
    localStorage.removeItem("tokens");
  };

  const hasAuth = authTokens && authTokens.wif;

  if (hasAuth && !axios.defaults.headers.common["wallet_key"]) {
    setAxiosHeader("wallet_key", authTokens.wif);
  }

  return (
    <AuthContext.Provider
      value={{ authTokens, setAuthTokens: setTokens, hasAuth }}
    >
      <div className="App">
        <ToastContainer position={toast.POSITION.TOP_CENTER} />

        <Navbar collapseOnSelect>
          <Nav className="mr-auto">
            <Navbar.Brand>
              <img
                onClick={() => (window.location = "/")}
                src={contractsvLogo}
                className="header-bar-logo"
              />
            </Navbar.Brand>
            {hasAuth && <Nav.Link href="/upload">Upload</Nav.Link>}
            {hasAuth && (
              <Navbar.Collapse>
                <Nav.Link
                  href="/"
                  onClick={logout}
                  className="justify-content-end"
                >
                  <span className="sv-green">Logout</span>
                </Nav.Link>
              </Navbar.Collapse>
            )}
          </Nav>
        </Navbar>

        <Router>
          <div>
            <Route exact path="/" component={Home} />
            {/*<Route path="/files" component={YourFiles} />*/}
            <Route path="/about" component={About} />
            <Route path="/upload" component={Upload} />
            <Route path="/cert/:txHash" component={Verification} />
          </div>
        </Router>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
