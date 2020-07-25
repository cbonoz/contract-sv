import React from "react";

import FileChain from "./FileChain";
import FileUploader from "./FileUploader";
import { Jumbotron, Button, Row, Col } from "react-bootstrap";

import api from "../helpers/api";
import PropTypes from "prop-types";

const MAX_BLOCKS = 15;

class Upload extends React.Component {
  state = {
    blockFiles: [],
    files: [],
  };

  constructor(props) {
    super(props);
    this.addBlocks = this.addBlocks.bind(this);
  }

  componentDidMount() {
    console.log(api.BASE_URL);

    this.getAccount = this.getAccount.bind(null, this);
    // this.getBlockFiles()
    this.demoBlocks = this.demoBlocks.bind(this);
    // this.generateNextBlock = this.generateNextBlock.bind(this)
    // this.generateNextBlock()
    // this.generateNextBlock()
    // this.generateNextBlock()
    // this.demoBlocks()
    const block = api.createTestMetaData();
    const block2 = api.createTestMetaData();
    const block3 = api.createTestMetaData();
    this.addBlocks([block, block2, block3]);
  }

  getAccount() {
    console.log("getAccount");
  }

  // Demo file block generation.
  demoBlocks() {
    const self = this;

    function myFunction() {
      self.generateNextBlock();
      const rand = Math.round(Math.random() * 2000) + 1000; // 1000-3000ms interval.
      // setTimeout(myFunction, rand)
    }
  }

  addBlocks(blocks) {
    const { blockFiles } = this.state;
    this.setState({
      blockFiles: blockFiles.concat(blocks),
    });
  }

  generateNextBlock() {
    const block = api.createTestMetaData();
    let nextList = [block].concat(this.state.blockFiles);

    if (nextList.length > MAX_BLOCKS) {
      nextList = nextList.splice(0, MAX_BLOCKS);
    }

    console.log(nextList);
    this.setState({ blockFiles: nextList });
  }

  render() {
    const { blockFiles } = this.state;
    return (
      <div className="upload-page">
        {/*TODO: uncomment*/}
        {/* <img src={contractsvLogo} className="centered header-logo"/> */}
        <h2>Upload New Contract</h2>

        <Row className="show-grid">
          <Col xs={12} md={5}>
            <FileUploader addBlocks={(blocks) => this.addBlocks(blocks)} />
          </Col>
          <Col xs={12} md={7}>
            <FileChain blockFiles={blockFiles} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Upload;
