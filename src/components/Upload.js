import React, { useEffect, useState } from "react";

import FileChain from "./FileChain";
import FileUploader from "./FileUploader";
import FileInfo from "./FileInfo";
import { Button, Col, Row } from "react-bootstrap";

import api from "../helpers/api";
import { useAuth } from "../auth";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

const MAX_BLOCKS = 15;

const Upload = () => {
  const [blockFiles, setBlockFiles] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [balance, setBalance] = useState({});
  const { hasAuth } = useAuth();

  const goToDashboard = () => (window.location.href = "/");

  if (!hasAuth) {
    goToDashboard();
  }

  useEffect(() => {
    const getDocs = async () => {
      setLoading(true);
      try {
        const res = await api.getDocuments();
        const { data } = res;
        console.log("docs", data);
        setBlockFiles(data);
      } catch (e) {
        console.error("error getting documents", e);
        const msg = `Could not fetch documents. ${api.getErrorMessage(e)}`;
        toast.error(msg, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
        });
      }
      setLoading(false);
    };

    getDocs();
  }, []);

  function addBlocks(blocks) {
    setBlockFiles(blockFiles.concat(blocks));
  }

  if (!hasAuth) {
    return null;
  }

  // If we have a selected file show it.
  const hasSelectedFile = !!selectedFile;
  if (hasSelectedFile) {
    return (
      <div className="upload-page">
        <div className="header-row">
          <Button onClick={() => setSelectedFile(null)}>Go back</Button>
        </div>
        <FileInfo selectedFile={selectedFile} />
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="header-row">Your Documents</div>

      {loading && (
        <div className="centered loading-margin">
          <Loader type="ThreeDots" color="#007bff" height="50" width="50" />
        </div>
      )}

      {!loading && (
        <Row className="show-grid">
          <Col xs={12} md={5}>
            <FileUploader
              addBlocks={(blocks) => addBlocks(blocks)}
              compare={false}
            />
          </Col>
          <Col xs={12} md={7}>
            <FileChain
              loading={loading}
              blockFiles={blockFiles}
              setSelectedFile={setSelectedFile}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Upload;
