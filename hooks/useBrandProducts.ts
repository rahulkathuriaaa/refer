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
export function useBrandProducts() {
  const [storeUrl, setStoreUrl] = useState("");
  const [products, setProducts] = useState();
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
  const webStoreData = async () => {
    const res = await appwriteService.getBrandWebStoreKey(walletAddress);
    // console.log(res);
    // console.log(res?.documents[0].api_key);
    const data = {
      shopifyToken: res?.documents[0].api_key,
      shopifyStore: res?.documents[0].website,
    }; //api_key website
    // console.log(data);
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
    const products = async () => {
      const res = await getProducts();
      setProducts(res);
      console.log(res);
    };
    products();
  }, []);
  return { storeUrl, products };
}
