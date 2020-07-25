import React from "react";

import FileChain from "./FileChain";
import createReactClass from "create-react-class";
import { Jumbotron, Button, Grid, Row, Col } from "react-bootstrap";
import ReactRotatingText from "react-rotating-text";
import { Link } from "react-router-dom";

import contractsvLogo from "../assets/contract_sv_trans.png";

import api from "../helpers/api";
import PropTypes from "prop-types";

const MAX_BLOCKS = 15;

const ROTATING_ITEMS = [
  "A private",
  "An auditable",
  "A distributed",
  "A secure",
];

const Home = createReactClass({
  render() {
    const self = this;
    return (
      <div className="home-page">
        {/*TODO: uncomment*/}
        <img
          src={contractsvLogo}
          className="centered header-logo header-logo-home"
        />

        <p className="header-text-h2">
          <ReactRotatingText className="rotating-bold" items={ROTATING_ITEMS} />
          {/* An auditable */}
          <br />
          contract management platform
        </p>
        <p className="header-text-h3">
          <br />
          {/* <b>No</b> Username or Password required. */}
        </p>
        <p>
          <Link to="/upload">
            <Button bsStyle="success btn-large" className="create-button">
              Start Uploading
            </Button>
          </Link>
        </p>
      </div>
    );
  },
});

export default Home;
