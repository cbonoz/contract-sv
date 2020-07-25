import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import Footer from "./Footer";

const About = createReactClass({
  render() {
    return (
      <div className="centered about-page">
        <div className="about-section centered">
          <h1>About Us</h1>

          <p>
            "contractsv" is an accountless contract management platform built on
            the{" "}
            <a
              href="https://www.jpmorgan.com/country/CL/ES/Quorum"
              target="_blank"
            >
              Quorum
            </a>{" "}
            blockchain.
          </p>

          <p>
            Hashes of documents, and other metadata, are stored on your
            permissioned or internal Quorum blockchain. Files are stored
            separatedly. We are not creating a token, but rather using Quorum's
            blockchain and privacy benefits to record metadata, permissions, and
            proof of ownership that can be queried and used for
            permission/access control through our front end UI.
          </p>

          <p>Never lose track of a Contract again.</p>
        </div>
        <Footer />
      </div>
    );
  },
});

export default About;
