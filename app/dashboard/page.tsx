"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import BrandSetup1 from "@/components/dashboard/BrandSetup1";
import InfluencerSetup1 from "@/components/dashboard/InfluencerSetup1";
import DashboardComponent from "@/components/dashboard/DashboardComponent";
import { useBrandData, useInfluencerData, usePublicKey } from "@/store";
import {
  createUser,
  checkUserExist,
  getInfluencerData,
  getBrandData,
  checkUserSetup,
} from "../../utils";
import { useDynamicContext } from "@/lib/dynamic";

function Dashboard() {
  const { user, isAuthenticated } = useDynamicContext();
  const key = user?.email;

  const [choose, setChoose] = useState(true);
  const [brand, setBrand] = useState(false);
  const [influencer, setInfluencer] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("setup data");
  console.log(useBrandData.getState().key);
  console.log(useInfluencerData.getState().key);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("user payload data", user?.email);

      usePublicKey.setState({ publicKey: user?.email });
      const key = usePublicKey.getState().publicKey;
      console.log(key);

      const userCheck = async () => {
        console.log("key being added", key);
        const user = await checkUserExist(key);
        const setup = await checkUserSetup(key);
        console.log(user);
        console.log(setup);
        if (user) {
          if (useBrandData.getState().key || useInfluencerData.getState().key) {
            setLoggedInUser(true);
          }
        }
        setLoading(false);
      };

      userCheck();
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="bg-[#111111] h-screen flex items-center justify-center">
          <p className="text-white text-2xl">Loading...</p>
        </div>
      ) : (
        <>
          {loggedInUser ? (
            <DashboardComponent />
          ) : (
            <>
              <div
                className={`bg-[#111111] h-screen flex-col items-center justify-center gap-10 ${
                  choose ? "flex" : "hidden"
                }`}
              >
                <div className="text-center text-white flex flex-col gap-2">
                  <div className="text-4xl font-semibold">
                    Who do you want to sign up as?
                  </div>
                  <p>
                    We&apos;ll personalize your setup experience accordingly.
                  </p>
                </div>
                <div className="flex w-[50%] justify-center items-center gap-[20%]">
                  <div
                    onClick={() => {
                      setBrand(true);
                      setChoose(false);
                    }}
                    className="flex flex-col md:py-8 py-8 border-[2px] border-transparent hover:border-[#00B24F] rounded-2xl items-center gap-2 bg-[#2D2D2D] w-full cursor-pointer"
                  >
                    <Image
                      src="/DashboardBrand.svg"
                      width="252"
                      height="300"
                      className="w-[50%] h-[50%] object-contain p-2"
                      alt="Ref3r logo"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-white text-3xl leading-[23.4px] mb-1 text-center">
                        Brand
                      </p>
                      <p className="font-normal text-center text-white text-dimWhite text-[15px] leading-[20px] p-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setInfluencer(true);
                      setChoose(false);
                    }}
                    className="flex flex-col md:py-8 py-8 border-[2px] border-transparent hover:border-[#00B24F] rounded-2xl items-center gap-2 bg-[#2D2D2D] w-full cursor-pointer"
                  >
                    <Image
                      src="/DashboardAffiliate.svg"
                      width="252"
                      height="300"
                      className="w-[50%] h-[50%] object-contain p-2"
                      alt="Ref3r logo"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-white text-3xl leading-[23.4px] mb-1 text-center">
                        Influencer
                      </p>
                      <p className="font-normal text-center text-white text-dimWhite text-[15px] leading-[20px] p-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`bg-[#111111] min-h-screen flex justify-center items-center ${
                  choose ? "hidden" : "flex"
                }`}
              >
                {brand && <BrandSetup1 />}
                {influencer && <InfluencerSetup1 />}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Dashboard;
