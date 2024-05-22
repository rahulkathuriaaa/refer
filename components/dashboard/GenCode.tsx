// @ts-nocheck
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { generateDiscountCode } from "../../utils";
import { useBrandData } from "@/store";
import { ethers } from "ethers";
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
  campaignContractAbi,
  counterContractAbi,
  counterContractAddress,
  tokenContractAbi,
  tokenContractAddress,
  referFactoryContractAddress,
  referFactoryContractAbi,
} from "@/ethers/contractConfig";
import appwriteService from "@/appwrite/config";
const GenCode = ({ address, contractAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("Generating ..");
  const { primaryWallet } = useDynamicContext();
  const { user } = useDynamicContext();
  const walletAddress = user?.verifiedCredentials[0].address;
  const getSigner = async () => {
    return await primaryWallet.connector.getSigner<
      WalletClient<Transport, Chain, Account>
    >();
  };
  const getProvider = async () => {
    return await primaryWallet.connector.getPublicClient<PublicClient>();
  };

  const togglePopup = async () => {
    console.log(address.address);
    const { shopifyToken, shopifyStore } = await webStoreData();
    console.log("data passed to handle gen code ", shopifyStore, shopifyToken);
    handleCodeGeneration(shopifyToken, shopifyStore);
    setIsOpen(!isOpen);
  };

  const handleCodeGeneration = async (shopifyToken, shopifyStore) => {
    const res = await generateDiscountCode(
      20,
      "ll",
      shopifyToken,
      shopifyStore
    );
    registerCodeToSmartContract(res.code);
    setCode(res.code);
  };
  const webStoreData = async () => {
    const res = await appwriteService.getBrandWebStoreKey(address.address);
    console.log(res);
    console.log(res.documents[0].api_key);
    const data = {
      shopifyToken: res.documents[0].api_key,
      shopifyStore: res.documents[0].website,
    }; //api_key website
    console.log(data);
    return data;
  };
  const registerCodeToSmartContract = async (newCode) => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const signer = await getSigner();
    console.log(signer);
    console.log(contractAddress, walletAddress, code);

    try {
      const data = await signer.writeContract({
        address: contractAddress,
        abi: campaignContractAbi,
        functionName: "generateReferCode",
        args: [walletAddress, newCode],
        // args: ["something", "some description", 100, 100, 1],
        gas: 3000000,
        // gasLimit: ethers.utils.parseUnits("1000", "gwei"),
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error registering code with smartcontract", error);
    }

    // try {
    //   const data = await readContract({
    //     address: contractAddress as Hex,
    //     abi: abi,
    //     functionName: functionName,
    //     args: [argument],
    //     publicClient: client,
    //   });
    //   console.log(data);
    //   return data;
    // } catch (error) {
    //   console.error("Error reading from contract:", error);
    //   throw error;
    // }
  };

  return (
    <div className="">
      <button
        onClick={() => {
          togglePopup();
        }}
        className="px-4 py-2 border rounded-lg"
      >
        Generate Code
      </button>
      {isOpen && (
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
      )}
    </div>
  );
};

export default GenCode;
