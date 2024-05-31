"use client";
import SettingsNavBar from "@/components/dashboard/settings/SettingsNavBar";
import AccountSetting from "@/components/dashboard/settings/AccountSetting";
import ProfileSetting from "@/components/dashboard/settings/ProfileSetting";
import PaymentSetting from "@/components/dashboard/settings/PaymentSetting";
import NotificationSetting from "@/components/dashboard/settings/NotificationSetting";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";


function BrandSettings() {

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
      return <AccountSetting />;
    }
    if (activePage == "ProfilePage") {
      return <ProfileSetting />;
    }
    if (activePage == "PaymentPage") {
      return <PaymentSetting />;
    }
    if (activePage == "NotificationPage") {
      return <NotificationSetting />;
    }
  }

  function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="w-full flex items-center flex-col gap-6 bg-[#1E2023] min-h-screen py-20">
        <div className="w-full px-10">
          <Link href="/dashboard">
            <Image
              src="/icons/Arrow.svg"
              width="100"
              height="100"
              className="w-[4%] rounded-full bg-[#00B24F] px-4 py-5 rotate-180 flex justify-start"
              alt="Ref3r logo"
            />
          </Link>
        </div>
        <div className="w-[80%] flex flex-col gap-16">
          <div className="text-white text-6xl font-semibold">Settings</div>
          <SettingsNavBar
            setActivePage={setActivePage}
            activePage={activePage}
          />
          {children}
        </div>
      </div>
    );
  }
}

export default BrandSettings;
