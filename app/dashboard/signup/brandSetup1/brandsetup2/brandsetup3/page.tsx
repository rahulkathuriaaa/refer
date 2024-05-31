"use client";
import { useState } from "react";
import Image from "next/image";
import DashboardComponent from "@/components/dashboard/DashboardComponent";
import Dashboard from "@/app/dashboard/page";
import { useBrandData } from "@/store";
import { createBrand } from "@/appwrite/utils";
import Spline from "@splinetool/react-spline";
import { useRouter } from "next/navigation";
import { usePublicKey } from "@/store";
import Script from "next/script";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

function BrandSetup3() {
  const { user, isAuthenticated, setShowAuthFlow, handleLogOut } =
    useDynamicContext();
  const router = useRouter();
  const [choose, setChoose] = useState(true);
  const [brandEcommercePlatform, setBrandEcommercePlatform] =
    useState<string>();
  const [brandApiKey, setBrandApiKey] = useState<string>();
  const [brandIndustryCategory, setBrandIndustryCategory] = useState<string>();
  function updateStore() {
    usePublicKey.setState({ publicKey: user?.email });
    useBrandData.setState({
      ecommerce_platform: brandEcommercePlatform,
      api_key: brandApiKey,
      industry: brandIndustryCategory,
    });
    console.log("store Updated 1");
  }
  return (
    <>
      <div className="bg-[#111111] min-h-screen flex justify-center items-center">
        <div
          className={`w-[90%] flex justify-center items-center gap-10 my-6 ${
            choose ? "flex" : "hidden"
          } `}
        >
          <div className="w-[50%] text-white flex flex-col gap-4">
            <p className="text-3xl font-semibold mb-10">
              Give Your Brand Details
            </p>
            <div className="ml-2 flex flex-col gap-4">
              <div className="flex flex-col w-[70%]">
                <label className="mb-2">Your Ecommerce Platform</label>
                <input
                  value={brandEcommercePlatform}
                  onChange={(e) => {
                    setBrandEcommercePlatform(e.target.value);
                  }}
                  type="text"
                  id="event-name"
                  //   placeholder="Name"
                  className="bg-[#27292D] rounded-xl p-2 outline-none"
                />
              </div>

              <div className="flex flex-col w-[70%]">
                <label className="mb-2">Enter your API key from store</label>
                <textarea
                  value={brandApiKey}
                  onChange={(e) => {
                    setBrandApiKey(e.target.value);
                  }}
                  //   placeholder="Description..."
                  className="bg-[#27292D] rounded-xl p-2 outline-none resize-none"
                />
              </div>

              <div className="flex flex-col w-[70%]">
                <label className="mb-2">Industry Category</label>
                <input
                  value={brandIndustryCategory}
                  onChange={(e) => {
                    setBrandIndustryCategory(e.target.value);
                  }}
                  type="text"
                  id="event-name"
                  //   placeholder="Link"
                  className="bg-[#27292D] rounded-xl p-2 outline-none"
                />
              </div>
              <button
                className="bg-[#00B24F] px-4 py-2 text-white rounded-xl w-[30%]"
                onClick={() => {
                  updateStore();
                  createBrand();
                  router.push("/dashboard");
                  setChoose(false);
                }}
              >
                Finish Onboarding
              </button>
            </div>
          </div>
          <div className="w-[50%] h-[90vh] top-[3%] sticky rounded-2xl bg-black flex justify-center items-center">
            {/* <Image
            src="/Spaceship.svg"
            width="252"
            height="300"
            className="w-[70%]"
            alt="Ref3r logo"
          /> */}
            <Spline scene="https://prod.spline.design/wcIrbxSDkSMSlT-h/scene.splinecode" />
          </div>
        </div>
      </div>
      {/* {choose ? "" : <DashboardComponent />} */}
    </>
  );
}

export default BrandSetup3;
