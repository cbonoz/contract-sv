import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

const FileDetails = createReactClass({
    render() {
        const self = this;
        const file = self.props.file;
        const fileKeys = Object.keys(file);
        let index = fileKeys.indexOf("address");
        if (index !== -1) fileKeys.splice(index, 1);
        index = fileKeys.indexOf("name");
        if (index !== -1) fileKeys.splice(index, 1);

        return (
            <div>
                <h4><b>{file['name']}</b></h4>
                <div className="file-detail"><b>Versions:</b> {file['data']['versions']}</div>
                <div className="file-detail"><b>Last modified:</b> {new Date(file['data']['last_modified'] * 1000).toLocaleDateString()}</div>
            </div>
        );
    }
});

export default FileDetails;

