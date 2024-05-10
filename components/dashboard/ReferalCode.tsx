// @ts-nocheck
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { generateDiscountCode } from "../../utils";
import { useBrandData } from "@/store";
import appwriteService from "@/appwrite/config";
const ReferalCode = (address) => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("Generating ..");

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
    setCode(res.code);
  };
  const webStoreData = async () => {
    const res = await appwriteService.getBrandWebStoreKey(address.address);
    console.log(res)
    console.log(res.documents[0].api_key);
    const data = {
      shopifyToken: res.documents[0].api_key,
      shopifyStore: res.documents[0].website,
    }; //api_key website
    console.log(data)
    return data;
  };

  return (
    <div className="">
      <button
        onClick={() => {
          togglePopup();
        }}
        className="px-4 py-2 border rounded-lg"
      >
        Get Code
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

export default ReferalCode;
