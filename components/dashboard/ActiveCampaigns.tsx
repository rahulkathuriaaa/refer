// @ts-nocheck
"use client";
import React from "react";
import CardsActiveCampaigns from "../cards/CardsActiveCampaigns";

function ActiveCampaigns(campaigns: any) {
  console.log(campaigns.campaigns);

  return (
    <div className="flex flex-col gap-4">
      {campaigns.campaigns.map((campaign, index) => (
        <CardsActiveCampaigns
          key={index}
          address={campaign._contract}
          campaign={campaign.name}
          campaigndesc={campaign.description}
          // number={"30"}
          balance={"20"}
          total={"200"}
        />
      ))}
      ;
    </div>
  );
}

export default ActiveCampaigns;
