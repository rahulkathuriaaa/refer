// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import {
  referFactoryContractAddress,
  referFactoryContractAbi,
  campaignContractAbi,
} from "@/ethers/contractConfig";

const CardsWhitelistInfluencer = ({
  campaignAddress,
  influencerAddress,
  image,
  name,
}: {
  campaignAddress: string;
  influencerAddress: string;
  image: any;
  name: string;
}) => {
  const [isInfluencerWhitelisted, setIsInfluencerWhitelisted] = useState(false);
  const [isInfluencerEligibleToClaim, setIsInfluencerEligibleToClaim] =
    useState(false);
  const { primaryWallet } = useDynamicContext();
  const { user } = useDynamicContext();
  const walletAddress = user?.verifiedCredentials[0].address;
  // const isInfluencer = useIsInfluencer.getState().isInfluencer;
  console.log("wallet ", walletAddress);
  console.log("campaign address", campaignAddress);
  console.log("influencer address", influencerAddress);
  const getSigner = async () => {
    return await primaryWallet.connector.getSigner<
      WalletClient<Transport, Chain, Account>
    >();
  };
  const getProvider = async () => {
    return await primaryWallet.connector.getPublicClient<PublicClient>();
  };
  // const getCampaignIdT = async () => {
  //   const provider = await getProvider();
  //   //  console.log(provider);
  //   const contract = new ethers.Contract(
  //     referFactoryContractAddress,
  //     referFactoryContractAbi,
  //     provider
  //   );
  //   try {
  //     const tx = await contract.campaignToId(campaignAddress);
  //     //await tx.wait();
  //     console.log(tx);
  //     return Number(String(tx));
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //     return false;
  //   }
  // };
  const getCampaignId = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const provider = await getProvider();
    console.log(provider);

    try {
      const data = await provider.readContract({
        address: referFactoryContractAddress,
        abi: referFactoryContractAbi,
        functionName: "campaignToId",
        args: [campaignAddress],
      });
      console.log("ID for camaoign address", campaignAddress, "is", data);
      return data;
    } catch (error) {
      console.log("error getting campaign ID", error);
    }
  };
  // const isWhitelistedT = async () => {
  //   const provider = await getProvider();
  //   //  console.log(provider);
  //   const contract = new ethers.Contract(
  //     campaignAddress,
  //     campaignContractAbi,
  //     provider
  //   );
  //   try {
  //     const tx = await contract.isWhitelisted(influencerAddress);
  //     //await tx.wait();
  //     console.log(tx);
  //     return tx;
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //     return false;
  //   }
  // };
  const isWhitelisted = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }
    console.log(influencerAddress);
    const provider = await getProvider();
    console.log(provider);

    try {
      const data = await provider.readContract({
        address: campaignAddress,
        abi: campaignContractAbi,
        functionName: "isWhitelisted",
        args: [influencerAddress],
      });
      console.log("Influencer whitelist status");
      console.log(data);
      if (data) {
        console.log(influencerAddress);
        setIsInfluencerWhitelisted(data);
      }
      return data;
    } catch (error) {
      console.log("error getting if whitelisted", error);
    }
  };
  setInterval(isWhitelisted, 10000);

  // const isEligibleToClaim = async () => {
  //   const provider = await getProvider();
  //   //  console.log(provider);
  //   const contract = new ethers.Contract(
  //     campaignAddress,
  //     campaignContractAbi,
  //     provider
  //   );
  //   try {
  //     const tx = await contract.isWhitelisted(influencerAddress);
  //     //await tx.wait();
  //     console.log(tx);
  //     return tx;
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //     return false;
  //   }
  // };
  const isEligibleToClaim = async () => {
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
        functionName: "isEligibleToClaim",
        args: [influencerAddress],
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error getting if eligible to claim ", error);
    }
  };
  // const whitelistInfluencerT = async () => {
  //   console.log("campaign add :", campaignAddress);
  //   const campaignId = await getCampaignId();
  //   const functionName = "whitelistUsers";
  //   const functionArguments = [campaignId, influencerAddress];
  //   const signer = await getSigner();

  //   const contract = new ethers.Contract(
  //     referFactoryContractAddress,
  //     referFactoryContractAbi,
  //     signer
  //   );
  //   try {
  //     const tx = await contract[functionName](...functionArguments, {
  //       gasLimit: ethers.utils.hexlify(1000000), // Set a manual gas limit
  //     });
  //     await tx.wait();
  //     return tx.hash;
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //     return false;
  //   }
  // };
  const whitelistInfluencer = async () => {
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
        functionName: "whitelistUsers",
        args: [campaignId, influencerAddress],
        gas: 3000000,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error whiteListing influencer ", error);
    }
  };
  // const makeInfluencerEligibleToClaimT = async () => {
  //   console.log("campaign add :", campaignAddress);
  //   const campaignId = await getCampaignId();
  //   const functionName = "markAsEligibleToClaim";
  //   const functionArguments = [campaignId, influencerAddress];
  //   const signer = await getSigner2();

  //   const contract = new ethers.Contract(
  //     referFactoryContractAddress,
  //     referFactoryContractAbi,
  //     signer
  //   );
  //   try {
  //     const tx = await contract[functionName](...functionArguments, {
  //       gasLimit: ethers.utils.hexlify(1000000), // Set a manual gas limit
  //     });
  //     await tx.wait();
  //     return tx.hash;
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //     return false;
  //   }
  // };
  const makeInfluencerEligibleToClaim = async () => {
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
        functionName: "markAsEligibleToClaim",
        args: [campaignId, influencerAddress],
        gas: 3000000,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error making eligible to claim influencer ", error);
    }
  };

  useEffect(() => {
    const res = async () => {
      const res = await isWhitelisted();
      setIsInfluencerWhitelisted(res);
    };
    const res2 = async () => {
      const res2 = await isEligibleToClaim();
      console.log(res2);
      setIsInfluencerEligibleToClaim(res2);
    };

    res();
    res2();
  }, []);

  //console.log(campaignAddress)
  console.log(influencerAddress);
  return (
    <div className="w-full flex flex-col">
      <div className="h-[1px] w-full bg-[#909090]"></div>
      <div className="w-full flex justify-between items-center px-12">
        <div className="">
          <div className="flex items-center gap-6 pt-4">
            <div>
              <Image
                src={image}
                width="40"
                height="65"
                alt="home fill"
                className="rounded-full"
              />
            </div>

            <div>
              <p className="text-white font-semibold">{name}</p>
              {/* <p className="text-[#909090] text-sm">Truncated Description</p> */}
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center pt-4">
          {isInfluencerWhitelisted ? (
            // <div>
            //   {!isInfluencerEligibleToClaim ? (
            //     <button
            //       onClick={() => {
            //         makeInfluencerEligibleToClaim();
            //       }}
            //       className="text-sm py-2 px-4 rounded-xl text-white bg-[#00B24F]"
            //     >
            //       Make Eligible To claim
            //     </button>
            //   ) : (
            //     <button className="text-sm py-2 px-4 rounded-xl text-white bg-[#00B24F]">
            //       Eligible To Claim
            //     </button>
            //   )}
            // </div>
            <button className="text-sm py-2 px-4 rounded-xl text-white bg-[#00B24F]">
              Whitelisted
            </button>
          ) : (
            <button
              onClick={() => {
                whitelistInfluencer();
              }}
              className="text-sm py-2 px-4 rounded-xl text-white bg-[#00B24F]"
            >
              Whitelist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardsWhitelistInfluencer;
