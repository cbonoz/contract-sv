import React, { useState, useEffect } from "react";

import FileChain from "./FileChain";
import FileUploader from "./FileUploader";
import { Jumbotron, Button, Row, Col } from "react-bootstrap";

import api from "../helpers/api";
import PropTypes from "prop-types";
import { useAuth } from "../auth";

const MAX_BLOCKS = 15;

const Upload = () => {
  const [blockFiles, setBlockFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const { authTokens } = useAuth();

  const goToDashboard = () => (window.location.href = "/");
  const hasAuth = authTokens && authTokens.wif;

  if (!hasAuth) {
    goToDashboard();
  }

  useEffect(() => {
    const block = api.createTestMetaData();
    const block2 = api.createTestMetaData();
    const block3 = api.createTestMetaData();
    addBlocks([block, block2, block3]);
    return () => {};
  }, []);

  function addBlocks(blocks) {
    setBlockFiles(blockFiles.concat(blocks));
  }

  function generateNextBlock() {
    const block = api.createTestMetaData();
    let nextList = [block].concat(this.state.blockFiles);

    if (nextList.length > MAX_BLOCKS) {
      nextList = nextList.splice(0, MAX_BLOCKS);
    }

    console.log(nextList);
    setBlockFiles(nextList);
  }
  if (!hasAuth) {
    return null;
  }

  return (
    <div className="upload-page">
      <h2>Manage files</h2>

      <Row className="show-grid">
        <Col xs={12} md={5}>
          <FileUploader addBlocks={(blocks) => addBlocks(blocks)} />
        </Col>
        <Col xs={12} md={7}>
          <FileChain blockFiles={blockFiles} />
        </Col>
      </Row>
    </div>
  );
};

export default Upload;
