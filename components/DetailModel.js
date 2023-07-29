import React from "react";
import { Modal } from "web3uikit";
import { useAddress } from "@thirdweb-dev/react";

const DetailModel = ({ address, tokenId, isVisible, onClose, attribute }) => {
  const account = useAddress();
  console.log(`capacity${attribute[0].value}`);
  console.log(`location${attribute[1].value}`);
  console.log(`renewable type${attribute[2].value}`);
  const isOwnedByUser = address === account || address === undefined;

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        console.log("ehlo");
        onClose();
      }}
    >
      <h1>tokenId{tokenId}</h1>
      {isOwnedByUser ? (
        <div>
          <button>cancel</button>
          <button>auction</button>
        </div>
      ) : (
        <div>not owner</div>
      )}
    </Modal>
  );
};

export default DetailModel;
