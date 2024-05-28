import React from "react";
import CardsPastCampaigns from "../cards/CardsPastCampaigns";

function PastCampaigns() {
  return (
    <div className="flex flex-col gap-4">
      <CardsPastCampaigns
        campaign="Campaign 1"
        campaigndesc="some descripton"
        number={"30"}
        balance={"200"}
        total={"200"}
      />
    </div>
  );
}

export default PastCampaigns;
