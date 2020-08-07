import React, { useEffect, useState } from "react";
import * as R from "ramda";
import api, { getErrorMessage } from "../helpers/api";
import Loader from "react-loader-spinner";

export default function Verification({ match }) {
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState({});
  const [errorText, setErrorText] = useState("");

  const txHash = R.pathOr(null, ["params", "transactionHash"], match);

  useEffect(() => {
    async function validateTx() {
      setLoading(true);
      setErrorText("");
      try {
        const res = await api.validate(txHash);
        const { data } = res;
        setFileData(data);
      } catch (e) {
        console.error("err", e);
        const msg = getErrorMessage(e);
        setErrorText(msg);
      }
      setLoading(false);
    }

    validateTx();
  }, [txHash]);

  return (
    <div className="content-area cert-page">
      <h1>Transaction Certificate</h1>
      {loading && (
        <Loader type="ThreeDots" color="#007bff" height="50" width="50" />
      )}
      {/* TODO: add verification screen */}
      {!loading && fileData && <div>{JSON.stringify(fileData)}</div>}
      {errorText && <p className="error-text">{errorText}</p>}
    </div>
  );
}
