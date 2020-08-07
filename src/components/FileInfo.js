import React from "react";
import History from "./History";
import createReactClass from "create-react-class";
import api from "../helpers/api";
import Loader from "react-loader-spinner";
import { Button } from "react-bootstrap";
import FileUploader from "./FileUploader";

const FileInfo = createReactClass({
  componentWillMount() {
    const filename = this.props.selectedFile.name;

    this.setState({
      loading: true,
      versions: null,
      filterMatches: false,
      showUploader: false,
      compare: false,
      currentHash: null,
    });

    const getDocs = async () => {
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
    };

    getDocs();
  },

  handleCompareClicked(event) {
    this.setState({
      showUploader: !this.state.showUploader,
      compare: true,
    });
  },

  handleUploadClicked(event) {
    this.setState({
      showUploader: !this.state.showUploader,
      compare: false
    });
  },

  handleFileUploaded(results) {
    if (results.length > 0) {
      this.setState({
        currentHash: results[0].hash
      })
    }
  },

  render() {
    const { versions, currentHash, filterMatches, loading, showUploader, compare } = this.state;
    return (
      <div className="file-info-page">
        <hr />
        <h3>
          Version history for <b>{this.props.selectedFile.name}</b>
        </h3>
        {loading && (
          <Loader type="ThreeDots" color="#007bff" height="50" width="50" />
        )}
        {!loading && (
          <div>
            <Button>Upload new version</Button>
            <Button onClick={this.handleCompareClicked}>Compare existing document</Button>
            {showUploader && (
                <FileUploader successCallback={this.handleFileUploaded} compare={compare} />
            )}
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
