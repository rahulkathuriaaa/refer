"use client";
import SidebarItems from "./SidebarItems";
import Link from "next/link";
import { useBrandData, useIsInfluencer } from "@/store";
import { useState } from "react";
import Image from "next/image";

const Sidebar = (props: any) => {
  const isInfluencer = useIsInfluencer.getState().isInfluencer;
  return (
    <div id="sidebar" className="bg-[#111111] h-[94vh] sticky top-[3%] mx-5">
      <div className="flex flex-col justify-around">
        <div className="text-white px-4 pt-4 relative">
          <Link href="/">
            <Image
              src="/icons/Arrow.svg"
              width="100"
              height="100"
              className="w-[20%] rounded-full bg-[#00B24F] px-2 py-3 mb-4 rotate-180 flex justify-start"
              alt="Ref3r logo"
            />
          </Link>
          <span
            onClick={() => props.setActivePage("DashHomePage")}
            className="cursor-pointer"
          >
            <SidebarItems
              icon_name="Dash_Home"
              section_name="Dashboard"
              page_name="home"
              isActive={props.activePage == "DashHomePage"}
            />
          </span>

          {!isInfluencer ? (
            <span
              onClick={() => props.setActivePage("ProductsPage")}
              className="cursor-pointer"
            >
              <SidebarItems
                icon_name="Dash_Product"
                section_name="Products"
                page_name="products"
                isActive={props.activePage == "ProductsPage"}
              />
            </span>
          ) : (
            <></>
          )}
          {!isInfluencer ? (
            <span
              onClick={() => props.setActivePage("InfluencersPage")}
              className="cursor-pointer"
            >
              <SidebarItems
                icon_name="Dash_Influencers"
                section_name="Influencers"
                page_name="influencers"
                isActive={props.activePage == "InfluencersPage"}
              />
            </span>
          ) : (
            <span
              onClick={() => props.setActivePage("BrandsPage")}
              className="cursor-pointer"
            >
              <SidebarItems
                icon_name="Dash_Influencers"
                section_name="Brands"
                page_name="Brands"
                isActive={props.activePage == "BrandsPage"}
              />
            </span>
          )}

          <span
            onClick={() => props.setActivePage("ReportsPage")}
            className="cursor-pointer"
          >
            <SidebarItems
              icon_name="Dash_Reports"
              section_name="Reports"
              page_name="reports"
              isActive={props.activePage == "ReportsPage"}
            />
          </span>

          <span
            onClick={() => props.setActivePage("CampaignsPage")}
            className="cursor-pointer"
          >
            <SidebarItems
              icon_name="Dash_Campaigns"
              section_name="Campaigns"
              page_name="campaigns"
              isActive={props.activePage == "CampaignsPage"}
            />
          </span>

          {isInfluencer ? (
            <Link href="/dashboard/settings/influencer">
              <span
                onClick={() => props.setActivePage("SettingsPage")}
                className="cursor-pointer"
              >
                <SidebarItems
                  icon_name="Dash_Settings"
                  section_name="Admin Settings"
                  page_name="settings"
                  isActive={props.activePage == "SettingsPage"}
                />
              </span>
            </Link>
          ) : (
            <Link href="/dashboard/settings/brand">
              <span
                onClick={() => props.setActivePage("SettingsPage")}
                className="cursor-pointer"
              >
                <SidebarItems
                  icon_name="Dash_Settings"
                  section_name="Admin Settings"
                  page_name="settings"
                  isActive={props.activePage == "SettingsPage"}
                />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
