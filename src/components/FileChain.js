import React from 'react';
import createReactClass from 'create-react-class';
import {Button, Form, ListGroupItem, Modal, ListGroup} from 'react-bootstrap';
import FlipMove from 'react-flip-move';
import Columns from 'react-columns';
import PropTypes from 'prop-types';
import FileDetails from "./FileDetails";
import { capLength } from '../util'

import { putEdit, putView } from '../helpers/api'

const DEFAULT_TRANSACTION = '0x2446f1fd773fbb9f080e674b60c6a033c7ed7427b8b9413cf28a2a4a6da9b56c'

const FileChain = createReactClass({

    componentWillMount() {
        this.setState({
            showModal: false,
            currentMetadata: null,
            currentKey: null,
            currentTransaction: DEFAULT_TRANSACTION
        });
    },

    selectFile(metadata) {
        console.log('selectFile', JSON.stringify(metadata));
        this.setState({currentMetadata: metadata, showModal: true});
    },

    edit(metadata) {
        // TODO: implement
        console.log('edit', metadata)
        putEdit('chris', metadata.address).then(console.log)
    },

    download(metadata) {
        // TODO: implement
        console.log('download', metadata)
        putView('chris', metadata.address).then(console.log)


    },

    handleKeyChange(e) {
        this.setState({ currentKey: e.target.value });
    },

    handleClose() {
        this.setState({showModal: false});
    },

    render() {
        const self = this;
        const metadata = self.state.currentMetadata;
        const blockFiles = self.props.blockFiles;
        const { currentTransaction } = this.state

        return (
            <div className="file-chain">
                <ListGroup>
                    <ListGroupItem bsStyle="success">Your Previously Uploaded Contracts</ListGroupItem>
                    <Columns columns={2}>
                        {blockFiles && blockFiles.map((file, i) => {
                            return <FlipMove key={i}
                                             enterAnimation="accordionHorizontal" leaveAnimation="accordionHorizontal"
                                             duration={500} appearAnimation="accordionVertical">
                                <div className="file-block" onClick={() => self.selectFile(file)}>
                                    <FileDetails file={file}/>
                                </div>
                            </FlipMove>
                        })}
                    </Columns>
                </ListGroup>

                {/* Selected File metadata info modal */}
                <Modal show={self.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Uploaded Contract</Modal.Title>
                    </Modal.Header>
                    < Modal.Body >
                        <FileDetails file={metadata}/>
                        {metadata && metadata.address && <p><b>Address: </b>{capLength(metadata.address, 50)}</p>}
                        <h5><b>Original Contract Transaction Hash:</b></h5>
                            {currentTransaction && <p>{currentTransaction}</p>}
                        <hr/>
                        <hr/>
                        <Button className='delete-button' bsStyle="danger">Delete File</Button>
                        <p>Note that deleting a file will remove the ability of others to view or edit the file by making it "inactive". The contract record and history will still be preserved on the blockchain.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={() => this.edit(metadata)}>Upload new version</Button>
                        <Button bsStyle="info" onClick={() => this.download(metadata)}>Download</Button>
                        <Button bsStyle="danger" onClick={this.handleClose}>Close</Button>
                        {/*<Button bsStyle="danger" onClick={this.handleClose}>Grant Access</Button>*/}
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
});

export default FileChain;

