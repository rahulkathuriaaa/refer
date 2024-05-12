"use client";
import React from "react";
import { useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import DashHome from "./DashHome";
import Products from "./Products";
import Influencers from "./Influencers";
import Reports from "./Reports";
import Campaigns from "./Campaigns";
import Settings from "./Settings";

function DashboardComponent() {
  const [activePage, setActivePage] = useState("DashHomePage");

  const RenderPage = useMemo(() => {
    switch (activePage) {
      case "DashHomePage":
        return <DashHome />;
      case "ProductsPage":
        return <Products />;
      case "InfluencersPage":
        return <Influencers />;
      case "ReportsPage":
        return <Reports />;
      case "CampaignsPage":
        return <Campaigns />;
      case "SettingsPage":
        return <Settings />;
      default:
        return null;
    }
  }, [activePage]);

  return (
    <Layout setActivePage={setActivePage} activePage={activePage}>
      <div className="bg-[#1E2023] w-[80%] min-h-screen overflow-y-auto flex">
        {RenderPage}
      </div>
    </Layout>
  );
}

const Layout = React.memo(
  ({
    children,
    setActivePage,
    activePage,
  }: {
    children: React.ReactNode;
    setActivePage: Function;
    activePage: string;
  }) => {
    return (
      <div className="w-full flex">
        <div className="bg-[#1E2023] w-[20%]">
          <Sidebar setActivePage={setActivePage} activePage={activePage} />
        </div>
        {children}
      </div>
    );
  }
);

export default DashboardComponent;
