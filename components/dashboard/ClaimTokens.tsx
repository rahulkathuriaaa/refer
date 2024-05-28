// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";

import { Account, Chain, Transport, WalletClient, PublicClient } from "viem";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { campaignContractAbi } from "@/ethers/contractConfig";
import { getDiscountCodeUpdate } from "../../utils";
import appwriteService from "@/appwrite/config";

const ClaimTokens = ({
  address,
  codee,
  campaignAddress,
  referTokenBalance,
}) => {
  const [codeUsageCount, setCodeUsageCount] = useState();
  const [code, setCode] = useState();
  const [referalsAlreadyClaimed, setReferalsAlreadyClaimed] = useState();

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

    try {
      const data = await signer.writeContract({
        address: campaignAddress,
        abi: campaignContractAbi,
        functionName: "releaseClaimedFundsToInfluencer",
        args: [alreadyGeneratedCode, codeUsageCount],
        gas: 3000000,
      });
      return data;
    } catch (error) {
      console.log(
        "error making claim for refer code :",
        alreadyGeneratedCode,
        error
      );
    }
  };

  const getDiscountCodeUpdated = async (shopifyToken, shopifyStore, code) => {
    const res = await getDiscountCodeUpdate(
      20,
      code,
      shopifyToken,
      shopifyStore
    );

    console.log("discount code update", res.usageCount);

    setCodeUsageCount(Number(String(res.usageCount)));
    return res;
  };

  const webStoreData = async () => {
    console.log("address passed to appwrite", address);
    const res = await appwriteService.getBrandWebStoreKey(address);
    console.log(res);
    console.log(res.documents[0].api_key);
    const data = {
      shopifyToken: res.documents[0].api_key,
      shopifyStore: res.documents[0].website,
    };
    console.log(data);
    return data;
  };

  const checkCurrentClaimStatus = async (alreadyGeneratedCode) => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const provider = await getProvider();
    console.log(provider);
    console.log("code passed for checking claim status", code);

    try {
      const data = await provider.readContract({
        address: campaignAddress,
        abi: campaignContractAbi,
        functionName: "returnCodeToTimesClaimed",
        args: [alreadyGeneratedCode],
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error getting number of times code is used ", error);
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

  useEffect(() => {
    const fetchData = async () => {
      const { shopifyToken, shopifyStore } = await webStoreData();

      const alreadyGeneratedCode = await checkAlreadyGeneratedCode();
      setCode(alreadyGeneratedCode);
      const noOfTimesAlreadyClaimed = await checkCurrentClaimStatus(
        alreadyGeneratedCode
      );
      const updatedClaimTimes = await getDiscountCodeUpdated(
        shopifyToken,
        shopifyStore,
        alreadyGeneratedCode
      );
      setReferalsAlreadyClaimed(Number(String(noOfTimesAlreadyClaimed)));
      console.log(
        "already claimed referals: ",
        Number(String(noOfTimesAlreadyClaimed)),
        updatedClaimTimes
      );
    };

    fetchData();
  }, [referTokenBalance]);

  return (
    <div className="">
      <button
        onClick={() => {
          makeClaim();
        }}
        className="px-4 py-2 border rounded-lg"
      >
        {codeUsageCount
          ? "Claim " +
            String(codeUsageCount - referalsAlreadyClaimed) +
            " referals"
          : "Loading ..."}
      </button>
    </div>
  );
};

export default ClaimTokens;
