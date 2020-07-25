import React from "react";
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
import api from "../helpers/api";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";

const FileUploader = createReactClass({
  componentWillMount() {
    this.setState({
      files: [],
      showModal: false,
      sharingKey: "8f4ef855-41df-4164-92a1-068fe2a337b2",
      signingKey: "",
      privateChecked: false,
      address: "",
      sizeKb: 0,
      // current file properties for upload.
      currentFile: null,
      fileContent: null,
      metadata: null,
      fieldName: null,
    });
  },

  handlePrivateChange(e) {
    this.setState({ private: e.target.value });
  },

  handleSharingKeyChange(e) {
    this.setState({ sharingKey: e.target.value });
  },

  handleClose() {
    this.setState({ showModal: false });
  },

  handleSigningKeyChange(e) {
    this.setState({ signingKey: e.target.value });
  },

  showToast(message) {
    toast(message, { position: toast.POSITION.TOP_CENTER });
  },

  handleSignAndSubmit() {
    const self = this;
    this.setState({ showModal: false });

    const {
      currentFile,
      sizeKb,
      sharingKey,
      signingKey,
      privateChecked,
      fileContent,
      address,
    } = this.state;
    const { addBlocks } = this.props;
    const file = currentFile;
    const fileName = file.name;
    const d = file.lastModifiedDate || new Date();

    const fileDate = d.toLocaleDateString() + " " + d.toLocaleTimeString();
    if (!sharingKey) {
      self.showToast("Sharing key must be specified");
      return;
    }

    // TODO: passing pkey sec risk, used for hashing server side temporary.
    const metadata = api.createMetaData(
      file,
      sizeKb,
      fileDate,
      address,
      sharingKey,
      signingKey,
      privateChecked
    );

    api
      .postUploadFile(fileContent, metadata)
      .then((res) => {
        console.log("success", res);
        addBlocks([res]);
        // self.showToast(`Created contract! ${fileName}`)
      })
      .catch((err) => {
        console.error("error", err);
      });
  },

  onDrop: (acceptedFiles) => {
    console.log("accepted", acceptedFiles);
    const self = this;
    acceptedFiles.forEach((file) => {
      let nextFiles = [file].concat(self.state.files);
      self.setState({ files: nextFiles });
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = reader.result;
        // do whatever you want with the file content
        console.log(file.name, fileAsBinaryString);
      };
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");

      reader.readAsBinaryString(file);
    });
  },

  // Initialized the file
  handleInit() {
    console.log("filepond now initialised", this.pond);
  },

  // handle file upload.
  handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
    const self = this;
    // console.log(JSON.stringify(load))
    self.setState({
      fieldName: fieldName,
      currentFile: file,
      metadata: metadata,
    });
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      let sizeKb = 0;
      if (fileContent) {
        sizeKb = fileContent.length / 1000 + "kb";
      }

      const fileName = file.name;

      api.uploadFile(fileContent, fileName).then((res) => {
        console.log("got result", res);
      });

      // do whatever you want with the file content
      //   self.setState({ showModal: true, fileContent, sizeKb });
      // console.log(file.name, fileAsBinaryString)
    };
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");

    reader.readAsBinaryString(file);
  },

  render() {
    const {
      files,
      privateChecked,
      signingKey,
      sharingKey,
      currentFile,
      showModal,
    } = this.state;

    return (
      <div className="file-uploader">
        <ListGroup>
          <ListGroupItem bsStyle="info">Upload new version</ListGroupItem>
          <ListGroupItem>
            <FilePond
              allowMultiple={true}
              maxFiles={3}
              ref={(ref) => (this.pond = ref)}
              server={{ process: this.handleProcessing }}
              oninit={() => this.handleInit()}
            >
              {files.map((file) => (
                <File key={file} source={file} />
              ))}
            </FilePond>
          </ListGroupItem>
        </ListGroup>

        {/*Upload file modal*/}
        <Modal show={showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Hey, We Got Your File!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            {currentFile && (
              <p>
                Are you ready to submit file: <b>{currentFile["name"]}</b>?
              </p>
            )}
            <hr />

            <FormGroup controlId="formSharingKey">
              <label>Shared Access Key</label>
              <p className="help-text">
                Save this key, it will be used to share access to this file.
              </p>
              <FormControl
                readOnly
                type="text"
                value={sharingKey}
                placeholder="Enter access key value"
                onChange={this.handleSharingKeyChange}
              />
            </FormGroup>

            <FormGroup controlId="formSharingKey">
              <label>Signing Key</label>
              <p className="help-text">
                If specified, this key will be required to upload a signed
                version of the file.
              </p>
              <FormControl
                type="text"
                value={signingKey}
                placeholder="Enter sign key value"
                onChange={this.handleSigningKeyChange}
              />
            </FormGroup>

            <br />
            <FormGroup controlId="formAddress">
              <label>Create internal contract?</label>
              <p className="help-text">
                This will restrict access to your file's history and metadata.
              </p>
              <FormControl
                type="checkbox"
                value={privateChecked}
                placeholder="Make Contract Private - history of the file will be stored on the private blockchain"
                onChange={this.handlePrivateChange}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={this.handleSignAndSubmit}>
              Sign & Upload
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
});

export default FileUploader;
