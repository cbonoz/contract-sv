import React from "react";

export const capLength = (s, length) => {
  if (!s) {
    return s;
  }

  if (!length) {
    length = 25;
  }

  const maxLen = Math.min(s.length, length);
  if (s.length > length) {
    // console.log('s', s);
    return s.substr(0, maxLen) + ""; // no added elipsis
  }
  return s;
};

export const HOW_IT_WORKS = [
  <div>
    Create a BitcoinSV (test net or main net) wallet. Example{" "}
    <a href="">here</a>.
  </div>,
  <div>
    Import your wallet. After importing, you'll be able to upload documents and
    tie their state to the BitcoinSV blockchain and use ContractSV as your
    blockchain backed source of record for determining if a provided document
    has been tampered with or not.
  </div>,
  <div>
    Uploaded documents will be attached to that wallet. Please login again with
    a different wallet to view other documents.
  </div>,
];
