import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HDNode } from "ethers/lib/utils";
import Image from "next/image";
import { Button } from "web3uikit";
import { useAddress } from "@thirdweb-dev/react";
import OwnerBid from "../../components/OwnerBid";
import PlaceBid from "../../components/PlaceBid";
const post = () => {
  const account = useAddress();
  const [tokenId, setTokenId] = useState();
  const [tokenName, setTokenName] = useState();
  const [address, setAddress] = useState();
  const [description, setDescription] = useState();
  const [imageUri, setImageUri] = useState();
  const [capacity, setCapacity] = useState();
  const [location, setLocation] = useState();
  const [type, setType] = useState();
  const [showBidModal, setBidShowModal] = useState(false);
  const [showPlaceModal, setPlaceShowModal] = useState(false);
  const [auctionData, setAuctionData] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const router = useRouter();
  async function updateUi(data) {
    setAddress(data.address);
    const requestURL = data.tokenUri.replace(
      "ipfs://",
      "https://ipfs.io/ipfs/"
    );
    const tokenResponse = await (await fetch(requestURL)).json();
    setTokenName(tokenResponse.name);
    setDescription(tokenResponse.description);
    const image = tokenResponse.image;
    const imageurl = image[0].replace("ipfs://", "https://ipfs.io/ipfs/");
    setImageUri(imageurl);
    setCapacity(tokenResponse.attributes[0].value);
    setLocation(tokenResponse.attributes[1].value);
    setType(tokenResponse.attributes[2].value);
  }
  useEffect(() => {
    if (router.isReady) {
      async function handle() {
        const tokenId = router.query.tokenId;
        setTokenId(tokenId);
        await fetch(`http://127.0.0.1:8000/nft/${tokenId}`)
          .then((res) => res.json())
          .then((data) => {
            updateUi(data);
          });
      }
      handle();
    }
  }, [router]);

  const handlebid = () => {
    setBidShowModal(true);
  };
  const handlePlaceBid = () => {
    setPlaceShowModal(true);
  };
  const hideBidModal = () => setBidShowModal(false);
  const hidePlaceModal = () => setPlaceShowModal(false);
  const isOwnedByUser = address === account || address === undefined;
  useEffect(() => {
    fetchAuctionData();

    const interval = setInterval(() => {
      // console.log("chekc data");
      checkAuctionDuration();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  let auctiondata;
  const fetchAuctionData = async () => {
    const token = await router.query.tokenId;
    console.log(typeof token);
    await fetch(`http://127.0.0.1:8000/auction/${token}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAuctionData(data);
        auctiondata = data;
        if (data != {}) {
          setIsDisabled(true);
        }
      });
  };
  const checkAuctionDuration = async () => {
    const TokenId = await router.query.tokenId;
    const CurrentTime = Date.now() / 1000;
    // console.log(auctiondata);
    if (auctiondata && TokenId.toString() === auctiondata.tokenId) {
      console.log("hello");
      const { tokenId, duration, startTimeStamp } = auctiondata;
      console.log(duration, startTimeStamp);
      if (CurrentTime >= startTimeStamp + duration) {
        deleteAuctionValue(TokenId);
      }
    }
  };
  const deleteAuctionValue = async (tokenId) => {
    await fetch(`http://127.0.0.1:8000/auction/${tokenId}`, {
      method: "DELETE",
    });
    setIsDisabled(false);
  };
  return (
    <div>
      {imageUri ? (
        <>
          <div className="flex flex-row justify-center mt-10 gap-10">
            <div>
              <Image
                src={imageUri}
                alt={description}
                width={350}
                height={540}
              />
            </div>
            <div>
              <h2 className="mt-5 font-bold text-3xl">
                AssetName : {tokenName}
              </h2>
              <div className="mt-5 border-2 border-solid">
                <h3 className="mt-1 font-bold text-2xl">Description</h3>
                <p className="mt-2">{description}</p>
              </div>
              <div>
                <p className="mt-7 text-l">
                  <span className="font-bold text-xl">Location:</span>{" "}
                  {location}
                </p>
              </div>
              <div>
                <p className="mt-7 text-l">
                  <span className="font-bold text-xl">Capacity:</span>{" "}
                  {capacity}
                </p>
              </div>
              <div>
                <p className="mt-7 text-l">
                  <span className="font-bold text-xl">Energy Type:</span> {type}
                </p>
              </div>
              <div>
                <p className="mt-7 text-l">
                  <span className="font-bold text-xl mr-2">Previous Bid:</span>1
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t-2 border-solid">
            {isOwnedByUser ? (
              <div className=" mt-5 flex flex-row justify-evenly gap-10">
                <OwnerBid
                  address={address}
                  tokenId={tokenId}
                  isVisible={showBidModal}
                  onClose={hideBidModal}
                />
                <Button
                  type="button"
                  text="Start Auction"
                  onClick={handlebid}
                  size="large"
                  theme="primary"
                  disabled={isDisabled}
                />
                <Button
                  type="button"
                  text="Get Bids"
                  // onClick={handlePlaceBid}
                  size="large"
                  theme="primary"
                />
                <Button
                  type="button"
                  text="Cancel Listing"
                  // onClick={handlePlaceBid}
                  size="large"
                  theme="primary"
                />
              </div>
            ) : (
              <div className="mt-5 flex flex-row justify-center">
                <PlaceBid
                  address={address}
                  tokenId={tokenId}
                  isVisible={showPlaceModal}
                  onClose={hidePlaceModal}
                />
                <Button
                  type="button"
                  text="Place Bid"
                  onClick={handlePlaceBid}
                  size="large"
                  theme="primary"
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div> loading</div>
      )}
    </div>
  );
};

export default post;
