import React from "react";
import { File, FilePond } from "react-filepond";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import api, { getErrorMessage } from "../helpers/api";
import { toast } from "react-toastify";
import createReactClass from "create-react-class";

const FileUploader = createReactClass({
  componentWillMount() {
    this.setState({
      files: [],
      errorText: null,
    });
  },

  showToast(message) {
    toast(message, { position: toast.POSITION.TOP_CENTER });
  },

  // handle file upload. https://pqina.nl/filepond/docs/patterns/api/server/
  handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
    const { enforceName, compare } = this.props;
    this.setState({ errorText: "" });
    // console.log(JSON.stringify(load))
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      let sizeKb = 0;
      if (fileContent) {
        sizeKb = fileContent.length / 1000 + "kb";
      }

      const fileName = file.name;

      if (enforceName && fileName !== enforceName) {
        const errorText = `File must be named ${enforceName} for ${
          compare ? `comparison` : `a new upload`
        }.`;

        error(errorText);
        this.setState({ errorText });
        return;
      }

      api
        .uploadFile(fileContent, fileName, compare)
        .then((res) => {
          console.log("got result", res);
          let msg = `File ${fileName} uploaded!`;
          if (!compare) {
            msg = `${msg} It may take a few minutes for the upload to appear on the timeline`;
          }
          this.showToast(msg);
          load("done");
          if (this.props.successCallback) {
            this.props.successCallback(res.data);
          }
        })
        .catch((err) => {
          const msg = `Error uploading file: ${getErrorMessage(err)}`;
          this.setState({ errorText: msg });
          error(msg);
        });

      // do whatever you want with the file content
      //   self.setState({ showModal: true, fileContent, sizeKb });
      // console.log(file.name, fileAsBinaryString)
    };
    reader.onabort = () => this.setState({ errorText: "File reading aborted" });
    reader.onerror = () => this.setState({ errorText: "File reading failed" });

    reader.readAsBinaryString(file);
  },

  render() {
    const { files, errorText } = this.state;
    return (
      <div className="file-uploader">
        <ListGroup>
          <ListGroupItem bsStyle="info">
            {this.props.compare
              ? `Compare existing document`
              : `Upload new document`}
          </ListGroupItem>
          <ListGroupItem>
            <FilePond
              allowMultiple={false}
              maxFiles={1}
              server={{ process: this.handleProcessing }}
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
  },
});

export default FileUploader;
