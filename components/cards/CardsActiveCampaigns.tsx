// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import ViewCampaign from "../dashboard/ViewCampaign";
import WhitelistInfluencer from "../dashboard/WhitelistInfluencer";
import { ethers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useIsInfluencer } from "@/store";
import ReferalCode from "@/components/dashboard/ReferalCode";

import {
  counterContractAbi,
  counterContractAddress,
  tokenContractAbi,
  tokenContractAddress,
  referFactoryContractAddress,
  referFactoryContractAbi,
  campaignContractAbi,
} from "@/ethers/contractConfig";
import appwriteService from "@/appwrite/config";

const CardsActiveCampaigns = ({
  address,
  campaign,
  campaigndesc,
  // number,
  balance,
  total,
}: {
  address: string;
  campaign: string;
  campaigndesc: string;
  // number: any;
  balance: any;
  total: any;
}) => {
  const [view, setView] = useState(true);
  const [whitelist, setWhitelist] = useState(true);
  const [totalBalance, setTotalBalence] = useState();
  const [remainingBalance, setRemainingBalance] = useState();
  const [allBrands, setAllBrands] = useState();
  const [allInfluencers, setAllInfluencers] = useState();
  const isInfluencer = useIsInfluencer.getState().isInfluencer;
  const { primaryWallet } = useDynamicContext();
  const { user } = useDynamicContext();

  const getProvider = async () => {
    return await primaryWallet?.connector.ethers?.getWeb3Provider();
  };
  async function updateAllUsersData() {
    const allBrands = await appwriteService.getAllBrands();
    setAllBrands(allBrands);
    console.log(allBrands);
    const allInfluencers = await appwriteService.getAllInfluencers();
    setAllInfluencers(allInfluencers);
    console.log(allInfluencers?.documents);
  }

  const getAmountData = async () => {
    const provider = await getProvider();
    //  console.log(provider);
    const contract = new ethers.Contract(
      address,
      campaignContractAbi,
      provider
    );
    try {
      const tx = await contract.getTotalEscrowAmount();
      //await tx.wait();
      console.log(Number(String(tx)));
      setTotalBalence(Number(String(tx)));
    } catch (error) {
      console.error("Total amount fetch error:", error);
      return false;
    }
    try {
      const tx = await contract.getRemainingEscrowAmount();
      //await tx.wait();
      console.log(Number(String(tx)));
      setRemainingBalance(Number(String(tx)));
    } catch (error) {
      console.error("Remaining amount fetch erro:", error);
      return false;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAmountData();
      updateAllUsersData();
    };

    fetchData();
  }, []);
  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2 p-4 text-white bg-[#00B24F] rounded-t-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{campaign}</h2>
          <div className="">
            <div className="py-1 text-white flex justify-center items-center w-[60%] gap-1 rounded-full">
              <div className="rounded-full border border-white p-[8px] bg-[#52FF00]"></div>
              <p>Live</p>
            </div>
          </div>
        </div>

        <div className="w-[85%]">
          <p className="text-sm">{campaigndesc}</p>
        </div>

        {/* <div>
          <p className="text-sm">{number} influencers</p>
        </div> */}
      </div>

      <div className="flex items-center justify-between px-8 text-sm w-full py-3 text-white bg-black rounded-b-xl">
        <div className="flex gap-2 justify-center items-center">
          <div className="rounded-full border border-white p-[10px] bg-[#27E0A6]"></div>
          <div>
            <p className="text-[#777777]">BALANCE</p>
            <p>
              ${remainingBalance} of ${totalBalance} remaining
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {!isInfluencer ? (
            <button
              className={`text-[#27E0A6]`}
              onClick={() => {
                setWhitelist(false);
              }}
            >
              Whitelist Influencer
            </button>
          ) : (
            <ReferalCode address={address}></ReferalCode>
          )}
          <button
            className={`text-[#27E0A6]`}
            onClick={() => {
              setView(false);
            }}
          >
            View Campaign
          </button>
        </div>
      </div>
      {view ? "" : <ViewCampaign />}
      {whitelist ? (
        ""
      ) : (
        <WhitelistInfluencer
          addresses={allInfluencers}
          camapignAddresses={address}
        />
      )}
    </div>
  );
};

export default CardsActiveCampaigns;
