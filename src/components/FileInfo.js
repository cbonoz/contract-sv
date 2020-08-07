import React from "react";
import History from "./History";
import createReactClass from "create-react-class";
import api from "../helpers/api";
import Loader from "react-loader-spinner";
import {Button, Modal} from "react-bootstrap";
import FileUploader from "./FileUploader";

const FileInfo = createReactClass({
  async getDocs() {
    const filename = this.props.selectedFile.name;

    try {
      const res = await api.getHistory(filename);
      const { data } = res;
      this.setState({
        loading: false,
        versions: data,
      });
      console.log("versions", data);
    } catch (e) {
      console.error("error loading documents", e);
    }
  },

  componentWillMount() {
    this.setState({
      loading: true,
      versions: null,
      filterMatches: false,
      showModal: false,
      compare: false,
      currentHash: null,
    });

    this.getDocs();
  },

  handleCompareClicked(event) {
    this.setState({
      showModal: true,
      compare: true,
    });
  },

  handleUploadClicked(event) {
    this.setState({
      showModal: true,
      compare: false,
    });
  },

  handleFileUploaded(results) {
    if (this.state.compare && results.length > 0) {
      this.setState({
        showModal: false,
        compare: false,
        currentHash: results[0].hash,
      })
    } else if (!this.state.compare) {
      this.setState({
        showModal: false,
        currentHash: null,
      })
      this.getDocs()
    }
  },

  setShowModal(show) {
    this.setState({
      showModal: show
    })
  },

  render() {
    const { versions, currentHash, filterMatches, loading, showModal, compare } = this.state;
    return (
      <div className="file-info-page">
        <hr/>
        <h3>
          Version history for <b>{this.props.selectedFile.name}</b>
        </h3>
        <hr/>
        {loading && (
          <Loader type="ThreeDots" color="#007bff" height="50" width="50" />
        )}
        {!loading && (
          <div>
            <Button onClick={this.handleUploadClicked}>Upload new version</Button>&nbsp;
            <Button onClick={this.handleCompareClicked}>Compare existing document</Button>

            <Modal show={showModal} onHide={() => this.setShowModal(false)}>
              <Modal.Body>
                <FileUploader successCallback={this.handleFileUploaded} compare={compare} />
              </Modal.Body>
              <Modal.Footer>
                <Button bsStyle="danger" onClick={() => this.setShowModal(false)}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>

            <History
              versions={versions}
              currentHash={currentHash}
              filterMatches={filterMatches}
            />
          </div>
        )}
      </div>
    );
  },
});

export default FileInfo;
