// @ts-nocheck
import { useState } from "react";
import React from "react";
import Image from "next/image";
import CardsWhitelistInfluencer from "../cards/CardsWhitelistInfluencer";

function WhitelistInfluencer({
  allInfluencers,
  camapignAddresses,
  remainingBalance,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  // console.log("from whilelist page");
  //  console.log(addresses.addresses.documents[0].name);
  //console.log(addresses.documents);
  // console.log(allInfluencers);
  // console.log("remaining balance is ", remainingBalance);
  // allInfluencers?.documents.map((infAdd) => console.log(infAdd.publicKey));
  const filteredInfluencers = allInfluencers?.documents.filter((influencer) =>
    influencer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <div className="w-[98%] flex flex-col gap-10 py-6 pl-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-white text-5xl font-semibold">Whitelist Influencers</h2>
          <p className="text-[#909090] text-sm font-medium">
            Allot upfront budget to influencers you like and we will send them request to join the campaign
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[#909090] text-xl">Search</p>
          <div className="flex">
            <div className="flex items-center text-white border-white w-[60%] bg-[#27292D] rounded-xl px-2 gap-3">
              <Image
                src="/search.svg"
                width="252"
                height="300"
                className="w-[5%]"
                alt="Ref3r logo"
              />
              <input
                type="text"
                placeholder="Enter influencer’s name or wallet address"
                className="text-white h-[2.5rem] w-[90%] rounded-xl border-white bg-[#27292D] px-2 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-white text-lg font-semibold">
            <div className="flex gap-4">
              <p>Sort by:</p>
              <p>Popularity</p>
            </div>
            <div>
              <p>Saved Influencers</p>
            </div>
          </div>

          <div className="bg-[#27292D] w-full rounded-xl flex flex-col gap-4">
            <div className="w-full bg-[#2D2D2D] px-6 py-4 flex justify-between items-center rounded-t-xl">
              <div className="">
                <p className="text-white text-lg font-semibold">NAME</p>
              </div>
              <div className="">
                <p className="text-gray-400 font-semibold">
                  Remaining Budget -{" "}
                  <span className="text-white text-lg font-semibold">
                    ${remainingBalance}
                  </span>
                </p>
              </div>
            </div>
            {filteredInfluencers?.map((infAdd) => (
              <div key={infAdd.publicKey}>
                <CardsWhitelistInfluencer
                  key={infAdd.publicKey}
                  campaignAddress={camapignAddresses}
                  influencerAddress={infAdd.publicKey}
                  image={infAdd.profile_img}
                  name={infAdd.name}
                />
              </div>
            ))}

            <div className="w-full bg-[#2D2D2D] px-6 py-3 flex items-center justify-center text-center rounded-b-xl">
              <p className="text-gray-400">Showing {filteredInfluencers?.length} of {allInfluencers?.documents.length} people</p>
            </div>
          </div>

          <div className="w-full">
            <div className="w-full flex justify-end items-center gap-4">
              {/* <button className="text-white text-sm">Back</button>
              <button className="text-sm py-2 px-4 rounded-xl text-white bg-[#00B24F]">
                Create Campaign
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WhitelistInfluencer;
