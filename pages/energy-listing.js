import React from "react";
import NftBox from "../components/NftBox";
import { useAddress, useConnectionStatus } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
const energyListing = () => {
  const account = useAddress();
  const connectionStatus = useConnectionStatus();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/nft")
      .then((response) => response.json())
      .then((data) => {
        // setData(data);
        console.log(data);
        console.log(account);
        const newData = data.filter((entry) => entry.address === account);
        console.log(newData);
        setData(newData);
        setLoading(false);
      });
  }, [account]);
  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {connectionStatus === "connected" ? (
          loading ? (
            <div> Loading....</div>
          ) : (
            data?.map((nft) => (
              // console.log(nft.tokenId)
              <NftBox
                tokenId={nft.tokenId}
                address={nft.address}
                tokenUri={nft.tokenUri}
                createdAt={nft.created_At}
                key={nft.tokenId}
              />
            ))
          )
        ) : (
          <div>not connected</div>
        )}
      </div>
    </div>
  );
};

export default energyListing;
