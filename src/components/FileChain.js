import React from "react";
import createReactClass from "create-react-class";
import {Button, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import FlipMove from "react-flip-move";
import Columns from "react-columns";
import FileDetails from "./FileDetails";
import {capLength} from "../util";
import {putEdit} from "../helpers/api";

const FileChain = createReactClass({
  componentWillMount() {
    this.setState({
      showModal: false,
      errorText: "",
      currentMetadata: null,
    });
  },

  selectFile(metadata) {
    const { setSelectedFile } = this.props;
    console.log("selectFile", JSON.stringify(metadata));
    setSelectedFile(metadata);
  },

  edit(metadata) {
    // TODO: implement
    console.log("edit", metadata);
    putEdit("chris", metadata.address).then(console.log);
  },

  seeVersionHistory(metadata) {
    console.log("version history", metadata);
    window.open("/files/" + metadata.name);
  },

  handleClose() {
    this.setState({ showModal: false });
  },

  render() {
    const { metadata, errorText } = this.state;
    const { blockFiles, loading } = this.props;

    // const hasBlockFiles = blockFiles && blockFiles.length > 0;
    console.log("load", loading, blockFiles);
    const files = blockFiles || [];

    return (
      <div className="file-chain">
        <ListGroup>
          <ListGroupItem bsStyle="success">
            Previously uploaded files
          </ListGroupItem>
          {!loading && !files.length && (
            <div>
              <p className="left no-file-text">
                No files uploaded. Upload your first file on the left.
              </p>
            </div>
          )}
          <Columns columns={2}>
            {files
              .sort((f1, f2) => f1.data.last_modified > f2.data.last_modified ? -1 : 1)
              .map((file, i) => {
                return (
                  <FlipMove
                    key={i}
                    enterAnimation="accordionHorizontal"
                    leaveAnimation="accordionHorizontal"
                    duration={200}
                    appearAnimation="accordionVertical"
                  >
                    <div
                      className="file-block"
                      onClick={() => this.selectFile(file)}
                    >
                      <FileDetails file={file} />
                    </div>
                  </FlipMove>
                );
            })}
            {errorText && <p className="error-text">{errorText}</p>}
          </Columns>
        </ListGroup>

        {/* Selected File metadata info modal */}
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Uploaded Contract</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FileDetails file={metadata} />
            {metadata && metadata.address && (
              <p>
                <b>Address: </b>
                {capLength(metadata.address, 50)}
              </p>
            )}
            {/*<hr />*/}
            {/*<Button className="delete-button" bsStyle="danger">*/}
            {/*  Delete File*/}
            {/*</Button>*/}
            {/*<p>*/}
            {/*  Note that deleting a file will remove the ability of others to*/}
            {/*  view or edit the file by making it "inactive". The contract record*/}
            {/*  and history will still be preserved on the blockchain.*/}
            {/*</p>*/}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={() => this.edit(metadata)}>
              Upload new document
            </Button>
            <Button
              bsStyle="info"
              onClick={() => this.seeVersionHistory(metadata)}
            >
              See version history
            </Button>
            <Button bsStyle="danger" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
});

export default FileChain;
