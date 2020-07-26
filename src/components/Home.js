import React, { useState } from "react";

import { Button, Modal } from "react-bootstrap";
import ReactRotatingText from "react-rotating-text";
import { Link } from "react-router-dom";

import contractsvLogo from "../assets/contract_sv_trans.png";
import { HOW_IT_WORKS } from "../util";
const ROTATING_ITEMS = [
  "A private",
  "An auditable",
  "A distributed",
  "A secure",
];

const Home = () => {
  const [showHowModal, setShowHowModal] = useState(false);

  const showModal = (e) => {
    e.preventDefault();
    setShowHowModal(true);
  };

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
        document verification platform backed by BitcoinSV
      </p>
      <p className="header-text-h3">
        <br />
        {/* <b>No</b> Username or Password required. */}
      </p>
      <p className="how-it-works">
        <a href="#" onClick={showModal}>
          Welcome to ContractSV
        </a>
      </p>
      <p>
        <Link to="/upload">
          <Button bsStyle="success btn-large" className="create-button">
            Start Uploading
          </Button>
        </Link>
      </p>

      <Modal show={showHowModal} onHide={() => setShowHowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>How it works</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ol>
            {HOW_IT_WORKS.map((step, i) => {
              return (
                <li className="how-it-works-item" key={i}>
                  {step}
                </li>
              );
            })}
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={() => setShowHowModal(false)}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
