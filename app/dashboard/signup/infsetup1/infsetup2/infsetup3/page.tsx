"use client";
import { useState } from "react";
import Image from "next/image";

import { useInfluencerData, usePublicKey } from "@/store";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createInfluencer } from "@/appwrite/utils";

import Spline from "@splinetool/react-spline";
import { useRouter } from "next/navigation";
import Script from "next/script";

function InfluencerSetup3() {
  const { user, isAuthenticated, setShowAuthFlow, handleLogOut } =
    useDynamicContext();
  const router = useRouter();
  const [choose, setChoose] = useState(true);
  const [niche, setNiche] = useState<string>();
  const [mainPlatform, setMainPlatform] = useState<string>();
  const [noOfFollowers, setNumberOfFollowers] = useState<string>();
  function updateStore() {
    usePublicKey.setState({ publicKey: user?.email });
    useInfluencerData.setState({
      niche: niche,
      main_platform: mainPlatform,
      follower_count: Number(noOfFollowers),
    });
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
              Give Your Niche Details
            </p>
            <div className="ml-2 flex flex-col gap-4">
              <div className="flex flex-col w-[70%]">
                <label className="mb-2">
                  Your preferred niche (select multiple)
                </label>
                <input
                  value={niche}
                  onChange={(e) => {
                    setNiche(e.target.value);
                  }}
                  type="text"
                  id="event-name"
                  className="bg-[#27292D] rounded-xl p-2 outline-none"
                />
              </div>

              <div className="flex flex-col w-[70%]">
                <label className="mb-2">Select your main platform</label>
                <textarea
                  value={mainPlatform}
                  onChange={(e) => {
                    setMainPlatform(e.target.value);
                  }}
                  className="bg-[#27292D] rounded-xl p-2 outline-none resize-none"
                />
              </div>

              <div className="flex flex-col w-[70%]">
                <label className="mb-2">
                  Your follower count on main platform
                </label>
                <input
                  value={noOfFollowers}
                  onChange={(e) => {
                    setNumberOfFollowers(e.target.value);
                  }}
                  type="text"
                  id="event-name"
                  className="bg-[#27292D] rounded-xl p-2 outline-none"
                />
              </div>
              <button
                className="bg-[#00B24F] px-4 py-2 text-white rounded-xl w-[30%]"
                onClick={() => {
                  updateStore();
                  createInfluencer();
                  setChoose(false);
                  router.push("/dashboard");
                }}
              >
                Finish Onboarding
              </button>
            </div>
          </div>
          <div className="w-[50%] h-[90vh] top-[3%] sticky rounded-2xl bg-black flex justify-center items-center">
            {/* <Image
            src="/User.svg"
            width="252"
            height="300"
            className="w-[75%]"
            alt="Ref3r logo"
          /> */}
            <Spline scene="https://prod.spline.design/2rLQrhjlogSapElU/scene.splinecode" />
          </div>
        </div>
      </div>
    </>
  );
}

export default InfluencerSetup3;
