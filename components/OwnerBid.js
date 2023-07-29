import {
  PreDeployMetadata,
  useAddress,
  useContract,
  useContractEvents,
  useContractWrite,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { Input, Modal } from "web3uikit";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import abi from "../constant/abi.json";
import { ethers } from "ethers";
function convertTimeToSeconds(inputTime) {
  const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const [inputHours, inputMinutes] = inputTime.split(":");
  const inputTimestamp = Math.floor(
    new Date().setHours(inputHours, inputMinutes, 0) / 1000
  );
  const durationInSeconds = inputTimestamp - now;
  return durationInSeconds;
}
const OwnerBid = ({ address, tokenId, isVisible, onClose }) => {
  const { contract, isLoading, error } = useContract(contractAddress, abi);
  const { mutateAsync: startAuction } = useContractWrite(
    contract,
    "startAuction"
  );
  const { data } = useContractEvents(contract, "AuctionCreated");
  const account = useAddress();
  const [startPrice, setStartPrice] = useState();
  const [duration, setDuration] = useState();
  const [ownerdByuser, setOwnerdByUser] = useState();
  const [auctionData, setAuctionData] = useState();
  const isOwnedByUser = address === account || address === undefined;
  console.log(duration);
  let durat;
  useEffect(() => {
    async function handle() {
      if (data != undefined) {
        let lastentry;
        const ddata = data?.[0]?.data;
        const {
          auctionId,
          tokenId,
          seller,
          startPrice,
          duration,
          startTimeStamp,
          endTimeStamp,
        } = ddata || {};
        await fetch("http://127.0.0.1:8000/auctionlast")
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            lastentry = data?.[0];
            console.log(lastentry);
          });
        const last = lastentry ? lastentry.tokenId : 0;
        console.log(last);
        if (tokenId > last)
          fetch("http://127.0.0.1:8000/auction", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokenId: tokenId.toNumber(),
              seller: seller,
              startPrice: startPrice.toNumber(),
              duration: duration.toNumber(),
              startTimeStamp: startTimeStamp.toNumber(),
              endTimeStamp: endTimeStamp.toNumber(),
            }),
          });
      }
    }
    handle();
  }, [data]);

  useEffect(() => {
    if (duration != undefined) {
      const input = "00:01";
      durat = convertTimeToSeconds(duration);
      console.log(durat);
    }
  }, [duration]);
  async function handleStart() {
    console.log(tokenId, startPrice, durat);
    const token = ethers.BigNumber.from(tokenId);
    const Price = ethers.BigNumber.from(startPrice);
    const durations = ethers.BigNumber.from(durat);
    console.log(token);
    startAuction({
      args: [token, Price, durations],
    });
  }

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      title="Start Auction"
      onCloseButtonPressed={onClose}
      onOk={() => {
        console.log("ehlo");
        handleStart();
        onClose();
      }}
    >
      {/* <h1> start auction</h1> */}
      <div>
        <div className="">
          <Input
            label="StartPrice"
            name="startPrice"
            // value={startPrice}
            onChange={(e) => setStartPrice(e.target.value)}
          />
        </div>
        <div className="mt-5 mb-5">
          <input
            type="time"
            label="Duration"
            name="duration"
            // value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default OwnerBid;
