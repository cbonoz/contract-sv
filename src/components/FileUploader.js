import React, { useState } from "react";
import createReactClass from "create-react-class";
import { FilePond, File } from "react-filepond";
import {
  Button,
  Modal,
  ListGroup,
  ListGroupItem,
  Form,
  FormControl,
  label,
  FormGroup,
} from "react-bootstrap";
import api, { getErrorMessage } from "../helpers/api";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [errorText, setErrorText] = useState("");

  function showToast(message) {
    toast(message, { position: toast.POSITION.TOP_CENTER });
  }

  // handle file upload. https://pqina.nl/filepond/docs/patterns/api/server/
  function handleProcessing(
    fieldName,
    file,
    metadata,
    load,
    error,
    progress,
    abort
  ) {
    setErrorText("");
    // console.log(JSON.stringify(load))
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      let sizeKb = 0;
      if (fileContent) {
        sizeKb = fileContent.length / 1000 + "kb";
      }

      const fileName = file.name;

      api
        .uploadFile(fileContent, fileName, false)
        .then((res) => {
          console.log("got result", res);
          showToast(`File ${fileName} uploaded!`);
          load("done");
        })
        .catch((err) => {
          const msg = `Error uploading file: ${getErrorMessage(err)}`;
          setErrorText(msg);
          error(msg);
        });

      // do whatever you want with the file content
      //   self.setState({ showModal: true, fileContent, sizeKb });
      // console.log(file.name, fileAsBinaryString)
    };
    reader.onabort = () => setErrorText("File reading aborted");
    reader.onerror = () => setErrorText("File reading failed");

    reader.readAsBinaryString(file);
  }

  return (
    <div className="file-uploader">
      <ListGroup>
        <ListGroupItem bsStyle="info">Upload new version</ListGroupItem>
        <ListGroupItem>
          <FilePond
            allowMultiple={false}
            maxFiles={1}
            server={{ process: handleProcessing }}
            oninit={() => console.log("init")}
          >
            {files.map((file) => (
              <File key={file} source={file} />
            ))}
          </FilePond>
          {errorText && <p className="error-text">{errorText}</p>}
        </ListGroupItem>
      </ListGroup>
    </div>
  );
};

export default FileUploader;
