// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import React from "react";
import CardsBrandsForInfluencers from "../cards/CardsBrandsForInfluencers";
import appwriteService from "@/appwrite/config";
import Image from "next/image";
import { useInfluencerData } from "@/store";

function Brands() {
  const [allBrands, setAllBrands] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const fetchAllInfluencers = async () => {
    const allBrands = await appwriteService.getAllBrands();
    setAllBrands(allBrands?.documents);
    console.log(allBrands);
  };
  useEffect(() => {
    fetchAllInfluencers();
  }, []);
  const filteredBrands = allBrands?.filter((brand) =>
    brand.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="w-[98%] flex flex-col pt-10 pb-6 gap-6">
      <div className="text-white flex justify-between">
        <p className="text-3xl font-semibold">Brands Portfolio</p>
        <div className="w-[40%] flex justify-end">
          <div className="flex justify-center items-center text-white border-white w-[50%] bg-black rounded-full px-2">
            <Image
              src="/search.svg"
              width="252"
              height="300"
              className="w-[15%]"
              alt="Ref3r logo"
            />
            <input
              type="text"
              placeholder="Search Influencers"
              className="text-white h-[2.5rem] w-[90%] rounded-full border-white bg-black px-2 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-6 flex-wrap">
        {filteredBrands?.map((e) => (
          <CardsBrandsForInfluencers
            key={e.key}
            image={e.profile_img}
            name={e.name}
            description={e.description}
            currentUserDocumentId={useInfluencerData.getState().documentId}
            cardDocumentId={e.$id}
            cardUserKey={e.key}
          />
        ))}
      </div>
    </div>
  );
}

export default Brands;
