import React from 'react'
import History from "./History";
import createReactClass from "create-react-class";
import api from "../helpers/api";

const FileInfo = createReactClass({
    componentWillMount() {
        this.setState({
            loading: true,
            versions: null,
        });

        const getDocs = async () => {
            try {
                const res = await api.getHistory("doc3");
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
        return (
            <History versions={this.state.versions}/>
        )
    }
});

export default FileInfo
