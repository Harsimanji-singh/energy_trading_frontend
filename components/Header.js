import React from "react";
import Link from "next/link";
import { ConnectWallet } from "@thirdweb-dev/react";
import { ConnectButton } from "web3uikit";
const Header = () => {
  /*
    1. Landing Page
    2. Energy Listing Page
    3. Asset Details Page
    4. My Bids Page
    5. My Assets Page
    6. Nft Minting Page
    7. Account Managment
    */
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl">Energy Trading</h1>
      <div className="flex flex-row items-center">
        <Link href="/" legacyBehavior>
          <a className="mr-4 p-6">Energy Nfts</a>
        </Link>
        <Link href="/energy-listing" legacyBehavior>
          <a className="mr-4 p-6">Energy Listing</a>
        </Link>
        <Link href="/mint-nft" legacyBehavior>
          <a className="mr-4 p-6">Mint Nft</a>
        </Link>
        {/* <ConnectButton moralisAuth={false} /> */}
        <ConnectWallet modalTitle="Login" />
        {/* <ConnectButton /> */}
      </div>
    </nav>
  );
};

export default Header;
