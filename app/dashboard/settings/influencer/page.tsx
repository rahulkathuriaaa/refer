"use client";
import React, { useState } from "react";
import InfluencersNavbar from "@/components/dashboard/settings/influencers/InfluencersNavbar";
import InfAccountSettings from "@/components/dashboard/settings/influencers/InfAccountSettings";
import InfProfileSettings from "@/components/dashboard/settings/influencers/InfProfileSettings";
import InfPaymentSettings from "@/components/dashboard/settings/influencers/InfPaymentSettings";
import InfNotificationSettings from "@/components/dashboard/settings/influencers/InfNotificationSettings";
import ReferalCode from "@/components/dashboard/ReferalCode";

function InfluencerSettings() {
  const [activePage, setActivePage] = useState("ProfilePage");
  return (
    <Layout>
      <div className="">
        <RenderPage />
      </div>
    </Layout>
  );

  function RenderPage() {
    if (activePage == "AccountPage") {
      return <InfAccountSettings />;
    }
    if (activePage == "ProfilePage") {
      return <InfProfileSettings />;
    }
    if (activePage == "PaymentPage") {
      return <InfPaymentSettings />;
    }
    if (activePage == "NotificationPage") {
      return <InfNotificationSettings />;
    }
  }

  function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="w-full flex items-center flex-col gap-6 bg-[#1E2023] min-h-screen py-20">
        <div className="w-[80%] flex flex-col gap-16">
          <div className="text-white text-6xl font-semibold">Settings</div>
          <InfluencersNavbar
            setActivePage={setActivePage}
            activePage={activePage}
          />
          {children}
        </div>
  
      </div>
    );
  }
}

export default InfluencerSettings;
