import React from "react";
import { Input, Modal } from "web3uikit";
const PlaceBid = ({ address, tokenId, isVisible, onClose }) => {
  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      title="Place Bid"
      onCloseButtonPressed={onClose}
      onOk={() => {
        console.log("ehlo");
        onClose();
      }}
    >
      <div className="mb-5">
        <Input label="Bid amount" />
      </div>
    </Modal>
  );
};

export default PlaceBid;
