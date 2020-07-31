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
  const [balance, setBalance] = useState({});
  const { hasAuth } = useAuth();

  const goToDashboard = () => (window.location.href = "/");

  if (!hasAuth) {
    goToDashboard();
  }

  useEffect(() => {
    const getDocs = async () => {
      try {
        const res = await api.getDocuments();
        const { data } = res;
        console.log("docs", data);
        setBlockFiles(data);
      } catch (e) {
        console.error("error loading documents", e);
      }
    };

    getDocs();
  }, []);

  function addBlocks(blocks) {
    setBlockFiles(blockFiles.concat(blocks));
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
