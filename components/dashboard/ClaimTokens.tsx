// @ts-nocheck
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import {
  referFactoryContractAddress,
  referFactoryContractAbi,
  campaignContractAbi,
} from "@/ethers/contractConfig";

const ClaimTokens = ({ campaignAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { primaryWallet } = useDynamicContext();
  const { user } = useDynamicContext();
  const walletAddress = user?.verifiedCredentials[0].address;
  // const isInfluencer = useIsInfluencer.getState().isInfluencer;

  const getSigner = async () => {
    return await primaryWallet.connector.getSigner<
      WalletClient<Transport, Chain, Account>
    >();
  };
  const getProvider = async () => {
    return await primaryWallet.connector.getPublicClient<PublicClient>();
  };

  const getCampaignId = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const provider = await getProvider();
    console.log(provider);
    console.log(campaignAddress);

    try {
      const data = await provider.readContract({
        address: referFactoryContractAddress,
        abi: referFactoryContractAbi,
        functionName: "campaignToId",
        args: [campaignAddress],
      });
      console.log("ID for camaoign address", campaignAddress, "is", data);
      return Number(String(data));
    } catch (error) {
      console.log("error getting campaign ID", error);
    }
  };

  const makeClaim = async (id) => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const signer = await getSigner();
    console.log(signer);
    const campaignId = await getCampaignId();

    try {
      const data = await signer.writeContract({
        address: referFactoryContractAddress,
        abi: referFactoryContractAbi,
        functionName: "claim",
        args: [id],
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error whiteListing influencer ", error);
    }
  };

  const togglePopup = async () => {
    const id = await getCampaignId();
    const res = makeClaim(id);
    console.log(res)
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <button
        onClick={() => {
          togglePopup();
        }}
        className="px-4 py-2 border rounded-lg"
      >
        Claim Tokens
      </button>
      {/* {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-[4px] z-10">
          <div className="bg-[#7EE5A1] px-6 py-10 rounded-[0.6rem] flex flex-col gap-6 w-[50%] justify-center items-center shadow-lg">
            <button
              onClick={togglePopup}
              className="text-[#4F4F4F] text-xl font-bold py-2 px-4 rounded-full bg-[#61BC84]"
            >
              X
            </button>
            <h2 className="text-center text-[#000000B2] text-5xl font-bold">
              Affiliate Code
            </h2>
            <p className="text-center text-[#000000B2]">
              Scan with your phone’s camera or QR code app to view.
            </p>
            <Image
              src={"/QR.svg"}
              width={150}
              height={100}
              alt="QR"
              className=""
            />
            <h1 className="text-center text-[#000000B2] text-5xl font-bold">
              {code}
            </h1>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ClaimTokens;
