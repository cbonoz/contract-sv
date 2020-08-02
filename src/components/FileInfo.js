import React from 'react'
import History from "./History";
import createReactClass from "create-react-class";
import api from "../helpers/api";
import Loader from "react-loader-spinner"

const FileInfo = createReactClass({

    componentWillMount() {
        const filename = this.props.selectedFile.name;

        this.setState({
            loading: true,
            versions: null,
            currentHash: "1e50210a0202497fb79bc38b6ade6c34", // TODO allow user to upload + hash doc (without saving) from this page
        });

        const getDocs = async () => {
            try {
                const res = await api.getHistory(filename);
                const { data } = res;
                this.setState({
                    loading: false,
                    versions: data,
                })
                console.log("versions", data);
            } catch (e) {
                console.error("error loading documents", e);
            }
        };

        getDocs()
    },

    render() {
        return (
            <div>
                <h3>Version history for <b>{this.props.selectedFile.name}</b></h3>
                {this.state.loading && <Loader type="ThreeDots" color="#007bff" height="50" width="50" />}
                {!this.state.loading && <History versions={this.state.versions} currentHash={this.state.currentHash} />}
            </div>
        )
    }
});

export default FileInfo
