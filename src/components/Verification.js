import React, { useEffect, useState } from "react";
import * as R from "ramda";
import api, { getErrorMessage } from "../helpers/api";
import Loader from "react-loader-spinner";
import { formatDate } from "../helpers/DateUtil";
import checkImage from "../assets/verified.png";
import errorImage from "../assets/times.png";
import logo from "../assets/contract_sv_trans.png";

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
        setFileData(data[0]);
      } catch (e) {
        console.error("err", e);
        const msg = getErrorMessage(e);
        setErrorText(msg);
      }
      setLoading(false);
    }

    validateTx();
  }, [txHash]);

  const txUrl = `https://testnet.bitcoincloud.net/tx/${txHash}`;
  const { name, timestamp, hash, size, tx_hash } = fileData;

  const validDocument = fileData && !errorText;

  if (loading) {
    return <Loader type="ThreeDots" color="#007bff" height="50" width="50" />;
  }

  return (
    <div className="content-area cert-page">
      <img src={logo} className="header-logo" />
      <p>Document validation on the BSV Blockchain</p>
      <h1>Transaction Certificate</h1>

      {validDocument && (
        <div>
          <h2 className="sv-green">Valid Document</h2>
          <img src={checkImage} className="cert-image" />
          <p>---</p>
          <p>
            This transaction hash corresponds to the hash of document&nbsp;<b>{name}</b>.
          </p>
          <p>
            This document was logged on {formatDate(new Date(timestamp * 1000))}
            .
          </p>
          <p>Size: {size} bytes.</p>

          <p>Document hash: {hash}</p>
          <a href={txUrl} target="_blank">
            View on BSV Explorer
          </a>
        </div>
      )}
      {!validDocument && (
        <div>
          <h2 className="error-text">No Match</h2>
          <img src={errorImage} className="cert-image" />
          <p>---</p>
          <p>
            The transaction hash provided does not correspond to a valid
            ContractSV document.
          </p>
          <p className="error-text">{errorText}</p>
        </div>
      )}
    </div>
  );
}
