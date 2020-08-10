import React, { useState } from "react";

import { Button, Modal } from "react-bootstrap";
import ReactRotatingText from "react-rotating-text";
import { Link } from "react-router-dom";

import contractsvLogo from "../assets/contract_sv_trans.png";
import { useAuth } from "../auth";
import { setAxiosHeader } from "../helpers/api";
import { HOW_IT_WORKS } from "../util";
const ROTATING_ITEMS = [
  "A private",
  "An auditable",
  "A distributed",
  "A secure",
];

const Home = () => {
  const [showHowModal, setShowHowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [wif, setWif] = useState("");
  const { setAuthTokens } = useAuth();

  const login = () => {
    setAuthTokens({ wif });
    window.location.href = "/upload";
  };

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
        <b>
          Use ContractSV for free using your BitcoinSV testnet wallet
          credential.
        </b>
      </p>
      <p className="how-it-works">
        <a href="#" onClick={showModal}>
          About ContractSV
        </a>
      </p>
      <p>
        <Button
          bsStyle="success btn-large"
          // variant="success"
          className="create-button"
          onClick={() => setShowLoginModal(true)}
        >
          Start Uploading
        </Button>
      </p>

      <Modal show={showHowModal} onHide={() => setShowHowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>How it works</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ContractSV is a document platform allowing you to compare documents
            against previously hashed versions that are stored and validated on
            the BitcoinSV blockchain.
          </p>
          <p>To get started, follow the instructions below.</p>
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

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Import your wallet to begin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ContractSV uses your testnet wallet to authorize and track
            documents. We'll associate any uploaded document hashes on the
            blockchain with this key. Please enter it below to begin:
          </p>
          <div class="field">
            <label class="label">Enter wallet key:</label>
            <div class="control">
              <textarea
                className="textarea login-textarea"
                type="text"
                rows={5}
                placeholder="Enter WIF"
                onChange={(e) => setWif(e.target.value)}
                value={wif}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="neutral" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={login}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
