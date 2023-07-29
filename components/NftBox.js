import React, { useEffect, useState } from "react";
import { Account, useConnectionStatus, useAddress } from "@thirdweb-dev/react";
import { Card } from "web3uikit";
import Image from "next/image";
import Link from "next/link";
const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

const NftBox = ({ tokenId, address, tokenUri, createAt }) => {
  const [tokenName, setTokenName] = useState();
  const [imageUri, setImageUri] = useState();
  const [description, setDescription] = useState();
  const [attributes, setAttributes] = useState();

  const connetionStatus = useConnectionStatus();
  const addresss = useAddress();

  async function updateUi() {
    const requestURL = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
    const tokenResponse = await (await fetch(requestURL)).json();
    setTokenName(tokenResponse.name);
    setDescription(tokenResponse.description);
    const image = tokenResponse.image;
    const imageurl = image[0].replace("ipfs://", "https://ipfs.io/ipfs/");
    setImageUri(imageurl);
    setAttributes(tokenResponse.attributes);
  }
  useEffect(() => {
    updateUi();
  }, [connetionStatus]);

  const isOwnedByUser = address === addresss || address === undefined;
  const formattedSellerAddress = isOwnedByUser
    ? "you"
    : truncateStr(address || "", 15);

  return (
    <div>
      <div>
        {imageUri ? (
          <div>
            <Link href={`/nft/${tokenId}`}>
              <Card title={tokenName} description={description}>
                <div className="p-2">
                  <div className="flex flex-col items-end gap-2">
                    <div>#{tokenId}</div>
                    <div className="italic text-sm">
                      Owned by {formattedSellerAddress}
                    </div>
                    <Image
                      src={imageUri}
                      height="200"
                      width="200"
                      alt={description}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ) : (
          <div> Loading ...</div>
        )}
      </div>
    </div>
  );
};

export default NftBox;
