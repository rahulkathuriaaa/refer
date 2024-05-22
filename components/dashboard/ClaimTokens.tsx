// @ts-nocheck
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Account,
  Chain,
  Hex,
  Transport,
  WalletClient,
  PublicClient,
  parseEther,
  readContract,
  getContract,
} from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import {
  referFactoryContractAddress,
  referFactoryContractAbi,
  campaignContractAbi,
} from "@/ethers/contractConfig";
import { getDiscountCodeUpdate } from "../../utils";
import appwriteService from "@/appwrite/config";

const ClaimTokens = ({ address, codee, campaignAddress }) => {
  // const [isOpen, setIsOpen] = useState(false);

  const [code, setCode] = useState();
  const [referalsAlreadyClaimed, setReferalsAlreadyClaimed] = useState();

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

  const makeClaim = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const signer = await getSigner();
    console.log(signer);

    const alreadyGeneratedCode = await checkAlreadyGeneratedCode();
    console.log(
      "code for which referals are being claimed",
      alreadyGeneratedCode
    );
    console.log("temp 1111111111", campaignAddress);
    console.log("temp 1111111111", campaignContractAbi);
    console.log("temp 1111111111", alreadyGeneratedCode);

    try {
      const data = await signer.writeContract({
        address: campaignAddress,
        abi: campaignContractAbi,
        functionName: "releaseClaimedFundsToInfluencer",
        args: [alreadyGeneratedCode, referalsAlreadyClaimed + 50],
        gas: 5000000,
      });
      //  console.log(data);
      return data;
    } catch (error) {
      console.log(
        "error making claim for refer code :",
        alreadyGeneratedCode,
        error
      );
    }
  };

  const getDiscountCodeUpdated = async (shopifyToken, shopifyStore) => {
    const res = await getDiscountCodeUpdate(
      20,
      code,
      shopifyToken,
      shopifyStore
    );
    console.log("discount code update", res);
  };
  const webStoreData = async () => {
    console.log("address passed to appwrite", address);
    const res = await appwriteService.getBrandWebStoreKey(address);
    console.log(res);
    console.log(res.documents[0].api_key);
    const data = {
      shopifyToken: res.documents[0].api_key,
      shopifyStore: res.documents[0].website,
    }; //api_key website
    console.log(data);
    return data;
  };
  const checkCurrentClaimStatus = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const provider = await getProvider();
    console.log(provider);
    console.log("code passed for checki9ng claim status", code);

    try {
      const data = await provider.readContract({
        address: campaignAddress,
        abi: campaignContractAbi,
        functionName: "returnCodeToTimesClaimed",
        args: [code],
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error getting no of times code is used ", error);
    }
  };
  const checkAlreadyGeneratedCode = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const provider = await getProvider();
    console.log(provider);

    try {
      const data = await provider.readContract({
        address: campaignAddress,
        abi: campaignContractAbi,
        functionName: "returnGeneratedCode",
        args: [walletAddress],
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log(
        "error getting if influencer has already generated code ",
        error
      );
    }
  };

  useState(async () => {
   // console.log(address.address);

    const { shopifyToken, shopifyStore } = await webStoreData();
   // console.log("data passed to handle gen code ", shopifyStore, shopifyToken);
    getDiscountCodeUpdated(shopifyToken, shopifyStore);
    const noOfTimesAlreadyClaimed = await checkCurrentClaimStatus();
    const alreadyGeneratedCode = await checkAlreadyGeneratedCode();
    setCode(alreadyGeneratedCode);
    setReferalsAlreadyClaimed(Number(String(noOfTimesAlreadyClaimed)));
    console.log(
      "alredy claimed referals : ",
      Number(String(noOfTimesAlreadyClaimed))
    );
  }, []);

  return (
    <div className="">
      <button
        onClick={() => {
          makeClaim();
        }}
        className="px-4 py-2 border rounded-lg"
      >
        Claim +50 referals
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
