// @ts-nocheck
"use client";
import React from "react";
import CardsActiveCampaigns from "../cards/CardsActiveCampaigns";

function ActiveCampaigns({ campaigns, referTokenBalance }) {
  console.log("the campaign address", campaigns.campaigns);

  return (
    <div className="flex flex-col gap-4">
      {campaigns.map((campaign, index) => (
        <CardsActiveCampaigns
          key={index}
          address={campaign._host}
          contractAddress={campaign._contract}
          campaign={campaign.name}
          campaigndesc={campaign.description}
          // number={"30"}
          balance={"20"}
          total={"200"}
          referTokenBalance={referTokenBalance}
        />
      ))}
      ;
    </div>
  );
}

export default ActiveCampaigns;
