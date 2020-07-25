import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import {Button, Form, FormGroup, Modal, FormControl} from "react-bootstrap";
import api from "../helpers/api";
import { capLength } from '../util'
import FileDetails from "./FileDetails";

const YourFiles = createReactClass({

    componentWillMount() {
        this.setState({
            address: "",
            files: null,
            currentAddress: "",
            currentKey: "",
            showModal: false,
            loading: false,
        });
    },

    handleChange(e) {
        this.setState({ address: e.target.value });
    },

    handleClose() {
        this.setState({showModal: false});
    },

    selectFile(metadata) {
        console.log('selectFile', JSON.stringify(metadata));
        this.setState({currentMetadata: metadata, showModal: true});
        api.putView('chris', metadata.address).then(res => {
            console.log('viewed contract')
        })
    },

    search() {
        const self = this
        this.setState({loading: true});
        const { address }= this.state
        console.log('searching files with address', address);

        // TODO: implement query.
        let result;
        if (address === api.TEST_DEMO_ADDRESS) {
            result = [api.createTestMetaData(api.generateFileName(), api.TEST_DEMO_ADDRESS)]
            self.setState({files: result, loading: false, currentAddress: address});
        } else {
            api.getFilesForSharedKey(address).then(data => {
                console.log('data', data)
                self.setState({
                    files: [data], loading: false
                })
            })
        }
    },

    download() {
        // TODO: implement
        console.log('download')
    },

    edit() {
        // TODO: implement
        console.log('edit')
    },

    sign() {
        // TODO: implement
        console.log('sign')
    },

    handleSharingKeyChange(e) {
        this.setState({ ownerSharingKey: e.target.value });
    },

    handlePublicKeyChange(e) {
        this.setState({ targetPublicKey: e.target.value });
    },

    handleAddressChange(e) {
        this.setState({ address: e.target.value });
    },

    getValidationState() {
        const length = this.state.address.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    },

    render() {
        const self = this;
        const {files, currentMetadata, currentTransaction} = this.state

        return (
            <div className="centered files-page">

                <h1>Find Contract</h1>

                <p>Enter your access key below to fetch a created contract.</p>

                <p>Once these files are shown below, you can download, edit, and sign them.</p>

                <FormGroup
                className='contract-access-input'
                    validationState={this.getValidationState()}
                    controlId="formBasicText">
                    {/* <p>Enter your access key</p> */}
                    <FormControl
                        type="text"
                        value={this.state.address}
                        placeholder="Enter Contract Access Key"
                        onChange={this.handleAddressChange}
                    />

                    <Button bsStyle="success" className="search-button" onClick={() => this.search()}>Search</Button>
                </FormGroup>


                <hr/>

                {files !== null && files.map((file) => {
                    return <div key={file.address} className="file-block" onClick={() => self.selectFile(file)}>
                        <FileDetails file={file}/>
                    </div>
                })}

                {files !== null && ! files.length && <p className="no-results centered">No files found for <b>{self.state.currentAddress}</b></p>}

                {/*TODO: make this a shareable modal between here and FileChain*/}
                <Modal show={self.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{(currentMetadata && currentMetadata.name) || 'Contract'}</Modal.Title>
                    </Modal.Header>
                    < Modal.Body >
                        <h4>Found blockchain record</h4>
                        <FileDetails file={currentMetadata}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="default" onClick={this.edit}>Edit</Button>
                        <Button bsStyle="default" onClick={this.download}>Download</Button>
                        <Button bsStyle="success" onClick={this.sign}>Sign</Button>
                        <Button bsStyle="danger" onClick={this.handleClose}>Close</Button>
                        {/*<Button bsStyle="danger" onClick={this.handleClose}>Grant Access</Button>*/}
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
});

export default YourFiles;

