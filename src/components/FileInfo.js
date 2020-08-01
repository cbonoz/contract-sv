import React from 'react'
import History from "./History";
import createReactClass from "create-react-class";
import api from "../helpers/api";
import Loader from "react-loader-spinner"

const FileInfo = createReactClass({

    componentWillMount() {
        const fileId = this.props.match.params.fileId

        this.setState({
            loading: true,
            versions: null,
        });

        const getDocs = async () => {
            try {
                const res = await api.getHistory(fileId);
                const { data } = res;
                this.setState({
                    loading: false,
                    versions: data
                })
                console.log("versions", data);
            } catch (e) {
                console.error("error loading documents", e);
            }
        };

        getDocs()
    },

    render() {
        let fileId = this.props.match.params.fileId
        let component
        if (this.state.loading) {
            component = <Loader type="ThreeDots" color="#007bff" height="50" width="50" />
        } else {
            component = <History versions={this.state.versions}/>
        }
        return (
            <div>
                <h3>Version history for <b>{fileId}</b></h3>
                {component}
            </div>
        )
    }
});

export default FileInfo
