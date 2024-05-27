// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import DashHomeInfuencers from "../cards/DashHomeInfuencers";
import CardsInfluencersForBrands from "../cards/CardsInfluencersForBrands";
import CardsProductForBrands from "../cards/CardsProductForBrands";
import { checkUserType } from "@/appwrite/utils";
import appwriteService from "@/appwrite/config";
import { useBrandProducts } from "@/hooks/useBrandProducts";
import {
  useBrandData,
  useInfluencerData,
  useIsInfluencer,
  usePublicKey,
} from "@/store";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const TopSellingProducts = () => {
  const { storeUrl, products } = useBrandProducts();
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);
  const [productArray, setProductArray] = useState([]);
  useEffect(() => {
    if (products) {
      setIsProductsLoaded(true);
      setProductArray(products.products);
    }
  }, [products]);
  return (
    <div className="bg-[#111111] p-6 flex flex-col rounded-lg w-full gap-20">
      <div className="flex justify-between items-center bg-[#232528] text-white py-2 px-8 rounded-full">
        <p>Top Selling Product</p>
        <p>View all products &#62;</p>
      </div>
      <div className="flex gap-4 flex-wrap">
        {isProductsLoaded ? (
          productArray.map((e) => (
            <CardsProductForBrands
              key={e.handle}
              image={e.image.src}
              name={e.title}
              link={"https://" + storeUrl + "/products/" + e.handle}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const BrandInfluencerProfiles = ({
  isInfluencer,
  allBrands,
  allInfluencers,
  currentUserDocumentId,
}) => {
  return (
    <div className="bg-[#111111] p-6 w-full rounded-xl flex flex-col gap-6">
      <div className="flex justify-between items-center bg-[#232528] text-white py-2 px-8 rounded-full">
        <p>Brand Influencer Profile</p>
        <p>View other profiles &#62;</p>
      </div>
      <div className="flex gap-6 flex-wrap">
        {!isInfluencer &&
          allInfluencers &&
          (allInfluencers ? (
            allInfluencers.documents.length > 0 ? (
              allInfluencers.documents.map((e) => (
                <DashHomeInfuencers
                  key={e.$id}
                  image={e.profile_img}
                  name={e.name}
                  currentUserDocumentId={currentUserDocumentId}
                  cardDocumentId={e.$id}
                  cardUserKey={e.key}
                />
              ))
            ) : (
              <p>No influencers found.</p>
            )
          ) : (
            <p>Invalid data format for influencers.</p>
          ))}
        {isInfluencer &&
          allBrands &&
          (allInfluencers ? (
            allBrands.documents.length > 0 ? (
              allBrands.documents.map((e) => (
                <DashHomeInfuencers
                  image={e.profile_img}
                  name={e.name}
                  currentUserDocumentId={currentUserDocumentId}
                  cardDocumentId={e.$id}
                  key={e.$id}
                  cardUserKey={e.key}
                />
              ))
            ) : (
              <p>No influencers found.</p>
            )
          ) : (
            <p>Invalid data format for influencers.</p>
          ))}
      </div>
    </div>
  );
};

const DashHome = () => {
  const isInfluencer = useIsInfluencer((state) => state.isInfluencer);
  const key = usePublicKey.getState().publicKey;
  const [name, setName] = useState<string>();
  const [userDescription, setUserDescription] = useState<string>();
  const [userLinks, setUserLinks] = useState(["a", ""]);
  const [profileImg, setProfileImg] = useState<string>(
    "/icons/ProfileIcon.svg"
  );
  const [loading, setLoading] = useState(false);
  const [allBrands, setAllBrands] = useState();
  const [allInfluencers, setAllInfluencers] = useState();
  const [currentUserDocumentId, setCurrentUserDocumentId] = useState<string>();
  const [balance, setBalance] = useState(0);

  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    const fetchBalance = async () => {
      if (primaryWallet) {
        const value = await primaryWallet.connector.getBalance();
        setBalance(value);
        console.log(value);
      }
    };
    fetchBalance();
  }, [primaryWallet]);

  const splitString = useCallback((str) => {
    const wordsArray = str.trim().split(",");
    const trimmedArray = wordsArray.map((word) => word.trim());
    return trimmedArray;
  }, []);

  const updateData = useCallback(
    async (key: string) => {
      const userType = await checkUserType(key);
      if (userType == "brand") {
        setName(useBrandData.getState().name);
        setUserDescription(useBrandData.getState().description);
        setCurrentUserDocumentId(useBrandData.getState().documentId);
        setProfileImg(useBrandData.getState().profile_img);
        console.log("brand links are",splitString(useBrandData.getState().links))
        setUserLinks(splitString(useBrandData.getState().links));
      }
      if (userType == "influencer") {
        setName(useInfluencerData.getState().name);
        setUserDescription(useInfluencerData.getState().bio);
        setCurrentUserDocumentId(useInfluencerData.getState().documentId);
        setProfileImg(useInfluencerData.getState().profile_img);
        setUserLinks(splitString(useInfluencerData.getState().links));
      }

      const allBrands = await appwriteService.getAllBrands();
      setAllBrands(allBrands);
      const allInfluencers = await appwriteService.getAllInfluencers();
      setAllInfluencers(allInfluencers);
    },
    [splitString]
  );

  useEffect(() => {
    updateData(key);
  }, [key, updateData]);

  const memoizedAllBrands = useMemo(() => allBrands, [allBrands]);
  const memoizedAllInfluencers = useMemo(
    () => allInfluencers,
    [allInfluencers]
  );

  const { user } = useDynamicContext();
  if (loading) return <>Fetching....</>;
  const walletAddress = user?.verifiedCredentials[0]?.address;

  return (
    <div className="flex w-[98%] py-4">
      <div className="flex flex-col justify-center items-center gap-8 w-full">
        <div className="flex justify-center items-center gap-10 w-full">
          <div className="flex flex-col justify-center items-center gap-4 w-[75%]">
            <div className="bg-[#111111] p-6 flex flex-col rounded-lg w-full gap-4">
              <div className="flex justify-between items-center">
                <Image
                  src={profileImg}
                  width="225"
                  height="100"
                  alt="home fill"
                  className="w-[13%]"
                />

                <div className="flex justify-center items-center gap-4">
                  <Image
                    src={`/icons/send.svg`}
                    width="20"
                    height="100"
                    alt="home fill"
                  />
                  <Image
                    src={`/icons/connect.svg`}
                    width="20"
                    height="100"
                    alt="home fill"
                  />
                  <Image
                    src={`/icons/menu.svg`}
                    width="20"
                    height="100"
                    alt="home fill"
                  />
                </div>
              </div>

              <p className="text-white text-2xl font-medium">
                {key ? name : "Name"}
              </p>

              <p className="text-[#909090]">Wallet Address: {walletAddress}</p>
              <p className="text-[#909090]">
                Matic Balance:
                {balance ? Number(balance).toFixed(5) : ""}
              </p>
              <p className="text-[#909090]">
                {key ? userDescription : "Description"}
              </p>

              <div className="flex items-center gap-8 bg-[#232528] py-2 px-6 rounded-full w-fit">
                <a href={userLinks[0]} target="blank">
                  <Image
                    src={`/icons/instagram.svg`}
                    width="25"
                    height="100"
                    alt="home fill"
                  />
                </a>
                <a href={userLinks[1]} target="blank">
                  <Image
                    src={`/icons/facebook.svg`}
                    width="25"
                    height="100"
                    alt="home fill"
                  />
                </a>
                <a href={userLinks[4]} target="blank">
                  <Image
                    src={`/icons/linkedin.svg`}
                    width="25"
                    height="100"
                    alt="home fill"
                  />
                </a>
                <a href={userLinks[3]} target="blank">
                  <Image
                    src={`/icons/twitter.svg`}
                    width="25"
                    height="100"
                    alt="home fill"
                  />
                </a>
                <a href={userLinks[2]} target="blank">
                  <Image
                    src={`/icons/tiktok.svg`}
                    width="25"
                    height="100"
                    alt="home fill"
                  />
                </a>
                {!isInfluencer ? (
                  <a
                    href={"https://" + useBrandData.getState().website}
                    target="blank"
                  >
                    <Image
                      src={`/icons/WebsiteUrl.svg`}
                      width="25"
                      height="100"
                      alt="home fill"
                    />
                  </a>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {!isInfluencer ? <TopSellingProducts /> : <></>}
          </div>

          <div className="w-[25%] h-full">
            <Image
              src={`/TotalSales.svg`}
              width="425"
              height="100"
              alt="home fill"
            />
            <Image
              src={`/HiredCharts.svg`}
              width="450"
              height="100"
              alt="home fill"
            />
          </div>
        </div>

        <BrandInfluencerProfiles
          isInfluencer={isInfluencer}
          allBrands={memoizedAllBrands}
          allInfluencers={memoizedAllInfluencers}
          currentUserDocumentId={currentUserDocumentId}
        />
      </div>
    </div>
  );
};

export default DashHome;
