// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import {
  Account,
  Chain,
  Hex,
  Transport,
  WalletClient,
  PublicClient,
  parseEther,
  getContract,
} from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
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
import { getProductsForBrand } from "../utils";

export function useFetchBrandProducts() {
  console.log("use fetch brands products");
  const [storeUrl, setStoreUrl] = useState("");
  const [products, setProducts] = useState();
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [approvedByBrands, setApprovedByBrands] = useState([]);
  const { primaryWallet } = useDynamicContext();
  const { user } = useDynamicContext();
  const walletAddress = user?.verifiedCredentials[0].address;

  const getSigner = async () => {
    return await primaryWallet?.connector.getSigner<
      WalletClient<Transport, Chain, Account>
    >();
  };

  const getProvider = async () => {
    return await primaryWallet?.connector.getPublicClient<PublicClient>();
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
  };

  const webStoreData = async () => {
    if (!approvedByBrands.length) return;

    console.log(approvedByBrands[0]);
    const res = await appwriteService.getBrandWebStoreKey(approvedByBrands[0]);
    const data = {
      shopifyToken: res?.documents[0].api_key,
      shopifyStore: res?.documents[0].website,
    };
    return data;
  };

  const getProducts = async () => {
    const { shopifyToken, shopifyStore } = await webStoreData();
    setStoreUrl(shopifyStore);
    const res = await getProductsForBrand(shopifyToken, shopifyStore);
    console.log(res);
    return res;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const allCampaigns = await getJoinedCampaigns();
      console.log(allCampaigns);
      setAllCampaigns(allCampaigns);

      const brandHosts = allCampaigns.map((campaign) => campaign._host);
      setApprovedByBrands(brandHosts);
      console.log("Influencer is approved by these brands", brandHosts);
    };

    fetchProducts();
  }, [primaryWallet]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (approvedByBrands.length) {
        const res = await getProducts();
        setProducts(res);
        console.log(res);
      }
    };

    fetchProducts();
  }, [approvedByBrands]);

  return { storeUrl, products };
}
