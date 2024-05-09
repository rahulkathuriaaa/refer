// @ts-nocheck
"use client";
import { useState } from "react";
import WhitelistInfluencer from "./WhitelistInfluencer";
import { ethers } from "ethers";
import { useIsInfluencer } from "@/store";

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
import { useEmbeddedWallet } from "@dynamic-labs/sdk-react-core";
import {
  counterContractAbi,
  counterContractAddress,
  tokenContractAbi,
  tokenContractAddress,
  referFactoryContractAddress,
  referFactoryContractAbi,
} from "@/ethers/contractConfig";

function CreateCampaign() {
  const [campaignName, setCampaignName] = useState("");
  const [campaignDesc, setCampaignDesc] = useState("");
  const [campaignTerm, setCampaignTerm] = useState(0);
  const [campaignAmount, setCampaignAmount] = useState(0);
  const [campaignClaimRate, setCampaignClaimRate] = useState(0);
  let allowedAmount = 1;
  const { primaryWallet } = useDynamicContext();
  const { user } = useDynamicContext();
  const walletAddress = user?.verifiedCredentials[0].address;
  const isInfluencer = useIsInfluencer.getState().isInfluencer;
  console.log("wallet ", walletAddress);
  const getSigner = async () => {
    return await primaryWallet.connector.getSigner<
      WalletClient<Transport, Chain, Account>
    >();
  };
  const getProvider = async () => {
    return await primaryWallet.connector.getPublicClient<PublicClient>();
  };
  const getSigner2 = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return signer;
      } catch (error) {
        console.error("Error requesting accounts:", error);
        return null;
      }
    } else {
      console.error("MetaMask not detected");
      return null;
    }
  };

  const handleCreateCampaign = async () => {
    // returnTokenAllowance();
    const functionName = "createCampaign";
    const functionArguments = [
      campaignName,
      campaignDesc,
      campaignTerm,
      campaignAmount,
      campaignClaimRate,
    ];
    console.log(functionArguments);
    const signer = await getSigner();
    console.log(signer);

    const contract = new ethers.Contract(
      referFactoryContractAddress,
      referFactoryContractAbi,
      signer
    );
    try {
      const tx = await contract[functionName](...functionArguments);
      // const tx = await contract.createCampaign(
      //   campaignName,
      //   campaignDesc,
      //   campaignTerm,
      //   campaignAmount,
      //   campaignClaimRate,
      //   { gasLimit: 10000000 }
      // );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("Transaction failed:", error);
      return false;
    }
  };
  const returnTokenAllowance = async () => {
    // const functionArguments = [13];
    const provider = await getProvider();

    const signer = await getSigner();
    console.log(signer);
    console.log(provider);
    const readContract = new ethers.Contract(
      tokenContractAddress,
      tokenContractAbi,
      provider
    );
    const allowContract = new ethers.Contract(
      tokenContractAddress,
      tokenContractAbi,
      signer
    );
    try {
      const tx = await readContract.allowance(
        walletAddress,
        referFactoryContractAddress
      );
      //await tx.wait();
      console.log(tx);
      allowedAmount = await Number(String(tx._hex));

      //return tx.hash;
    } catch (error) {
      console.error("Transaction failed:", error);
    }
    console.log(allowedAmount);
    if (allowedAmount == 0) {
      const functionName = "approve";
      const functionArguments = [
        referFactoryContractAddress,
        ethers.utils.parseUnits("6000", 18), // Convert the amount to wei
      ];
      try {
        const tx = await allowContract[functionName](...functionArguments);
        await tx.wait();
        console.log(tx);
      } catch (error) {
        console.error("Error Approving spender", error);
        //return false;
      }
    }
  };

  const returnCounterValue = async () => {
    const functionName = "retrieve";
    // const functionArguments = [13];
    const provider = await getProvider();
    //  console.log(provider);
    const contract = new ethers.Contract(
      counterContractAddress,
      counterContractAbi,
      provider
    );
    try {
      const tx = await contract.retrieve();
      //await tx.wait();
      console.log(tx);
      return tx.hash;
    } catch (error) {
      console.error("Transaction failed:", error);
      return false;
    }
  };

  const readFromContract = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const signer = await getSigner();
    console.log(signer);

    try {
      const data = await signer.writeContract({
        address: referFactoryContractAddress,
        abi: referFactoryContractAbi,
        functionName: "createCampaign",
        args: [
          campaignName,
          campaignDesc,
          campaignTerm,
          campaignAmount,
          campaignClaimRate,
        ],
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error reading brand campaigns", error);
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
    <>
      <div className={`w-[98%] flex gap-2 py-6 pl-4`}>
        <div className="w-[50%] text-white flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Create Campaigns</h1>

          <div className="flex flex-col w-[50%] text-sm">
            <label className="mb-2">Campaigns Name</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => {
                setCampaignName(e.target.value);
              }}
              id="event-name"
              placeholder="Name"
              className="bg-[#27292D] rounded-xl p-2 outline-none text-sm"
            />
          </div>

          <div className="flex flex-col w-[50%] text-sm">
            <label className="mb-2">Campaigns Description</label>
            <textarea
              placeholder="Description..."
              value={campaignDesc}
              onChange={(e) => {
                setCampaignDesc(e.target.value);
              }}
              rows={4}
              className="bg-[#27292D] rounded-xl p-2 resize-none outline-none text-sm"
            />
          </div>

          <div className="flex flex-col w-[50%] text-sm">
            <label className="mb-2">Campaigns Budget</label>
            <input
              type="number"
              value={campaignAmount}
              onChange={(e) => {
                setCampaignAmount(e.target.value);
              }}
              name="budget"
              placeholder="$"
              id="campaign-budget"
              className="bg-[#27292D] rounded-xl p-2 outline-none text-sm"
            />
          </div>

          <div className="flex flex-col w-[50%] text-sm">
            <label className="mb-2">Select Campaigns Term</label>
            <input
              type="text"
              value={campaignTerm}
              onChange={(e) => {
                setCampaignTerm(e.target.value);
              }}
              placeholder=""
              id="Niche"
              className="bg-[#27292D] rounded-xl p-2 outline-none text-sm"
            />
          </div>

          <div className="flex flex-col w-[50%] text-sm">
            <label className="mb-2">Commission per affiliate</label>
            <input
              value={campaignClaimRate}
              onChange={(e) => {
                setCampaignClaimRate(e.target.value);
              }}
              type="number"
              name="commission"
              placeholder="$"
              id="campaign-commission"
              className="bg-[#27292D] rounded-xl p-2 outline-none text-sm"
            />
          </div>

          <button
            onClick={async () => {
              const res = await readFromContract();
              console.log(res);
            }}
            className="py-3 bg-[#00B24F] text-white text-sm text-center w-[35%] rounded-lg cursor-pointer"
          >
            Create Campaign
          </button>
        </div>
        <div className="w-[50%] rounded-2xl bg-[#15A145] flex justify-center items-center h-[90vh]"></div>
      </div>
    </>
  );
}

export default CreateCampaign;
