// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import ActiveCampaigns from "./ActiveCampaigns";
import PastCampaigns from "./PastCampaigns";
import CreateCampaign from "./CreateCampaign";
import { ethers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useIsInfluencer } from "@/store";
import {
  tokenContractAbi,
  tokenContractAddress,
  referFactoryContractAddress,
  referFactoryContractAbi,
} from "@/ethers/contractConfig";
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
import { getChain } from "@dynamic-labs/utils";

const Campaigns = () => {
  const [choose, setChoose] = useState(false);
  const [create, setCreate] = useState(true);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [referTokenBalance, setReferTokenBalance] = useState("Loading ...");

  const { primaryWallet } = useDynamicContext();
  const { user } = useDynamicContext();
  const walletAddress = user?.verifiedCredentials[0].address;
  const isInfluencer = useIsInfluencer.getState().isInfluencer;
  console.log("is actually influencer", isInfluencer);
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

  const getBrandCampaigns = async () => {
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
        functionName: "fetchBrandCampaign",
        args: [walletAddress],
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
  const getJoinedCampaigns = async () => {
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
        functionName: "fetchJoinedCampaign",
        args: [walletAddress],
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error reading joined campaigns", error);
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

  const getBrandCampaignsT = async () => {
    const provider = await getProvider();
    console.log(provider);
    const contract = new ethers.Contract(
      referFactoryContractAddress,
      referFactoryContractAbi,
      provider
    );
    try {
      const tx = await contract.fetchBrandCampaign(
        "0x063145aa5f16FAD2C8179c1E0Ff1a1a39D95AF9d"
      );
      //await tx.wait();
      console.log(tx);
      return tx;
    } catch (error) {
      console.error("Transaction failed:", error);
      return false;
    }
  };
  const getJoinedCampaignsT = async () => {
    const provider = await getProvider();
    //  console.log(provider);
    const contract = new ethers.Contract(
      referFactoryContractAddress,
      referFactoryContractAbi,
      provider
    );
    try {
      const tx = await contract.fetchJoinedCampaign(walletAddress);
      //await tx.wait();
      console.log(tx);
      return tx;
    } catch (error) {
      console.error("Transaction failed:", error);
      return false;
    }
  };

  const approveReferSpender = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const signer = await getSigner();
    console.log(signer);

    try {
      const data = await signer.writeContract({
        address: tokenContractAddress,
        abi: tokenContractAbi,
        functionName: "approve",
        args: [
          referFactoryContractAddress,
          ethers.utils.parseUnits("6000", 18), // Convert the amount to wei
        ],
        gas: 3000000,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error approving refercontract as spender", error);
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
  const mintReferToken = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const signer = await getSigner();
    console.log(signer);

    try {
      const data = await signer.writeContract({
        address: tokenContractAddress,
        abi: tokenContractAbi,
        functionName: "mintTo",
        args: [walletAddress],
        gas: 3000000,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error minting refer tokens", error);
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
  const getReferTokenBalance = async () => {
    if (!primaryWallet) {
      console.log("primary wallet error");
    } else {
      console.log(primaryWallet);
    }

    const provider = await getProvider();
    console.log(provider);

    try {
      const data = await provider.readContract({
        address: tokenContractAddress,
        abi: tokenContractAbi,
        functionName: "balanceOf",
        args: [
          walletAddress, // Convert the amount to wei
        ],
      });
     // console.log(Number(String(data)));
      return Number(String(data));
    } catch (error) {
      console.log("error minting refer tokens", error);
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
  const handleMintAndApprove = async () => {
    const res1 = await approveReferSpender();
    const res2 = await mintReferToken();

    console.log(res1);
    console.log(res2);
  };
  const toggleCreate = () => {
    setCreate(!create);
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      const res3 = await getReferTokenBalance();
      setReferTokenBalance(res3);
      console.log("is the user influencer", isInfluencer);
      if (isInfluencer) {
        const allCampaigns = await getJoinedCampaigns();
        console.log(allCampaigns);
        setAllCampaigns(allCampaigns);
      } else {
        const allCampaigns = await getBrandCampaigns();
        setAllCampaigns(allCampaigns);
      }
    };
    //readFromContract();
    fetchCampaigns();
    const intervalId = setInterval(fetchCampaigns, 2000); 

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <>
      <div
        className={`w-[98%] flex flex-col pt-10 pb-6 gap-10 pl-4 ${
          create ? "flex" : "hidden"
        } `}
      >
        <div className="flex justify-between items-center">
          <p className="text-5xl font-semibold text-white">Campaigns</p>
          <p className="text-xl font-semibold text-white">
            Balance:{referTokenBalance}
          </p>
          <button
            className="py-2 px-3 bg-[#00B24F] text-white text-sm rounded-lg cursor-pointer"
            onClick={() => {
              handleMintAndApprove();
            }}
          >
            Get Test Tokens
          </button>
          {!isInfluencer ? (
            <button
              className="py-2 px-3 bg-[#00B24F] text-white text-sm rounded-lg cursor-pointer"
              onClick={() => {
                toggleCreate();
              }}
            >
              Create Campaign
            </button>
          ) : (
            <></>
          )}
        </div>

        <div className="w-[30%] flex justify-center items-center gap-2">
          <button
            className={`flex justify-center items-center p-1 w-[50%] rounded-full text-sm ${
              choose
                ? "bg-[#909090] text-black font-medium"
                : "bg-[#00B24F] text-white"
            }`}
            onClick={() => setChoose(false)}
          >
            Active Campaigns
          </button>
          <button
            className={`flex justify-center items-center p-1 w-[50%] rounded-full text-sm ${
              choose
                ? "bg-[#00B24F] text-white"
                : "bg-[#909090] text-black font-medium"
            }`}
            onClick={() => setChoose(true)}
          >
            Past Campaigns
          </button>
        </div>

        {allCampaigns && (
          <div className="w-[85%]">
            {choose ? (
              <PastCampaigns />
            ) : (
              <ActiveCampaigns campaigns={allCampaigns} />
            )}
          </div>
        )}
      </div>

      {create ? (
        ""
      ) : (
        <CreateCampaign toggleCreate={toggleCreate} create={create} />
      )}

      {/* comment out line 62 to see View Campaign & Chat UI */}
      {/* <ViewCampaign /> */}
    </>
  );
};

export default Campaigns;
