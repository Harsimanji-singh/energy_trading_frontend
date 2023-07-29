import React, { Suspense, startTransition, useEffect, useState } from "react";
import { Input, TextArea, Button, Loading } from "web3uikit";
import {
  useContract,
  useContractWrite,
  useContractEvents,
  useContractRead,
  useStorageUpload,
  useSDK,
} from "@thirdweb-dev/react";
import axios from "axios";
import { ethers } from "ethers";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import abi from "../constant/abi.json";

const mintnft = () => {
  const { contract, isLoading, error } = useContract(contractAddress, abi);
  const { mutateAsync: mint } = useContractWrite(contract, "mintEnergyAsset");
  const { data } = useContractEvents(contract, "NFTMinted");
  const { mutateAsync: upload } = useStorageUpload();

  const [state, setState] = useState({
    assetName: "",
    description: "",
    file: "",
    capacity: "",
    location: "",
    type: "",
  });
  useEffect(() => {
    async function handle() {
      if (data != undefined) {
        let lastentry;
        const ddata = data?.[0]?.data;
        const { tokenId: id, owner: address, tokenUri } = ddata || {};
        await fetch("http://127.0.0.1:8000/nftlast")
          .then((response) => response.json())
          .then((data) => {
            lastentry = data[0];
          });
        const last = lastentry ? lastentry.tokenId : 0;
        if (id > last) {
          console.log(data);
          fetch("http://127.0.0.1:8000/nft", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokenId: id.toNumber(),
              address: address,
              tokenUri: tokenUri,
            }),
          });
        }
      }
    }
    handle();
  }, [data]);

  if (isLoading) {
    return <div> Loading...</div>;
  }
  if (error) {
    return <div>Errro : {error.message}</div>;
  }

  const handleChange = (event, value) => {
    setState({
      ...state,
      [event.target.name]: value,
    });
  };

  const uploadToIpfs = async (data) => {
    const uploadUrl = await upload({
      data: [data],
      options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
    });
    return uploadUrl;
  };

  const handleLogic = async () => {
    const assetName = state.assetName;
    const description = state.description;
    const file = state.file;
    const url = await uploadToIpfs(file);
    const capacity = state.capacity;
    const location = state.location;
    const type = state.type;
    const tokenUri = JSON.stringify({
      name: assetName,
      description: description,
      image: url,
      attributes: [
        {
          trait_type: "capacity",
          value: capacity,
        },
        { trait_type: "location", value: location },
        {
          trait_type: "Renewable Type",
          value: type,
        },
      ],
    });
    const token = await uploadToIpfs(tokenUri);
    console.log(assetName, description, url?.[0], token?.[0]);
    mint({ args: [assetName, description, url?.[0], token?.[0]] });
    // mint({ args: ["lsdkf", "lskdfj", "lsdkfj", "lksjdf"] });
  };

  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <div>
        <h1 className="flex justify-center items-center text-xl ">
          {" "}
          Create a Energy Listing
        </h1>
        <form className="mt-10 px-5 flex flex-col justify-center items-center border-solid border-2">
          <div>
            <Input
              label="Asset Name"
              name="assetName"
              value={state.assetName}
              errorMessage="Not valid"
              validation="require"
              className="space-y-1"
              onChange={(e) => handleChange(e, e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Input
              label="Asset Description"
              name="description"
              errorMessage="Not valid"
              validation="require"
              value={state.description}
              className="mt-8"
              onChange={(e) => handleChange(e, e.target.value)}
            />
          </div>
          <div className="mt-5">
            <input
              type="file"
              // value={state.file}
              name="file"
              onChange={(e) => handleChange(e, e.target.files[0])}
            />
          </div>
          <div className="mt-5">
            <Input
              label="Energy Capacity"
              name="capacity"
              errorMessage="Not valid"
              value={state.capacity}
              validation="require"
              className="mt-8"
              onChange={(e) => handleChange(e, e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Input
              label="Location"
              name="location"
              value={state.location}
              errorMessage="Not valid"
              validation="require"
              className="mt-8"
              onChange={(e) => handleChange(e, e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Input
              label="Renewable Type"
              name="type"
              value={state.type}
              errorMessage="Not valid"
              validation="require"
              className="mt-8"
              onChange={(e) => handleChange(e, e.target.value)}
            />
          </div>
          <div className="mt-5">
            <Button
              type="button"
              text="Submit"
              onClick={handleLogic}
              size="large"
              theme="primary"
            />
          </div>
        </form>
      </div>
    </Suspense>
  );
};

export default mintnft;
