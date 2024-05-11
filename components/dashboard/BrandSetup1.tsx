
"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import BrandSetup2 from "./BrandSetup2";
import { useBrandData } from "@/store";
import { useDynamicContext } from "@/lib/dynamic";
import appwriteService from "@/appwrite/config";

function BrandSetup1() {
  const [choose, setChoose] = useState(true);
  const [brandName, setBrandName] = useState<string>();
  const [brandDescription, setBrandDescription] = useState<string>();
  const [brandWebsite, setBrandWebsite] = useState<string>();
  const [brandAddress, setBrandAddress] = useState<string>();
  const [brandRegistrationCode, setBrandRegistrationCode] = useState<string>();
  const [newProfileImg, setNewProfileImg] = useState("/LogoUpload.svg");
  const { user, isAuthenticated, setShowAuthFlow, handleLogOut } =
    useDynamicContext();
  const fileInputRef = useRef(null);
  function updateStore() {
    useBrandData.setState({
      name: brandName,
      description: brandDescription,
      website: brandWebsite,
      address: brandAddress,
      business_reg_code: brandRegistrationCode,
      publicKey: user?.verifiedCredentials[0].address,
      profile_img: newProfileImg,
    });
    console.log("store Updated 1");
  }
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    try {
      const res = await appwriteService.uploadProilePic(file);
      console.log(res.href);
      setNewProfileImg(res.href);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <>
      <div
        className={`w-[90%] justify-center gap-10 ${
          choose ? "flex" : "hidden"
        } `}
      >
        <div className="w-[50%] text-white flex flex-col gap-4 my-10">
          <p className="text-3xl font-semibold">Brand Account Setup</p>
          <p>Give your brand details</p>
          <div className="ml-2 flex flex-col gap-4">
            <div className="w-[15%]">
              <label className="mb-2 cursor-pointer">
                Brand Logo
                <input
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  type="file"
                  name=""
                  id=""
                  style={{ display: "none" }}
                />
                <Image
                  src={newProfileImg}
                  width="252"
                  height="300"
                  alt="Ref3r logo"
                  onClick={handleImageClick}
                />
              </label>
            </div>

            <div className="flex flex-col w-[70%]">
              <label className="mb-2">Brand Name</label>
              <input
                type="text"
                id="event-name"
                placeholder="Name"
                className="bg-[#27292D] rounded-xl p-2 outline-none"
                value={brandName}
                onChange={(e) => {
                  setBrandName(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col w-[70%]">
              <label className="mb-2">Brand Description</label>
              <textarea
                value={brandDescription}
                placeholder="Description..."
                rows={4}
                className="bg-[#27292D] rounded-xl p-2 resize-none outline-none"
                onChange={(e) => {
                  setBrandDescription(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col w-[70%]">
              <label className="mb-2">Website Link</label>
              <input
                type="url"
                id="event-name"
                placeholder="Link"
                className="bg-[#27292D] rounded-xl p-2 outline-none"
                value={brandWebsite}
                onChange={(e) => {
                  setBrandWebsite(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col w-[70%]">
              <label className="mb-2">Address (Optional)</label>
              <input
                value={brandAddress}
                onChange={(e) => {
                  setBrandAddress(e.target.value);
                }}
                type="text"
                id="event-name"
                placeholder="Address"
                className="bg-[#27292D] rounded-xl p-2 outline-none"
              />
            </div>

            <div className="flex flex-col w-[70%]">
              <label className="mb-2">
                Business Registration Code (Optional)
              </label>
              <input
                value={brandRegistrationCode}
                onChange={(e) => {
                  setBrandRegistrationCode(e.target.value);
                }}
                type="text"
                id="event-name"
                placeholder="Code"
                className="bg-[#27292D] rounded-xl p-2 outline-none"
              />
            </div>
            <button
              className="bg-[#00B24F] px-4 py-2 text-[0.8rem] text-white rounded-2xl md:rounded-lg w-[30%]"
              onClick={() => {
                setChoose(false);
                updateStore();
              }}
            >
              Save Details
            </button>
          </div>
        </div>

        <div className="w-[50%] h-[94vh] top-[3%] sticky rounded-2xl bg-[#15A145] flex justify-center items-center">
          <Image
            src="/Spaceship.svg"
            width="252"
            height="300"
            className="w-[100%]"
            alt="Ref3r logo"
          />
        </div>
      </div>
      {choose ? "" : <BrandSetup2 />}
    </>
  );
}

export default BrandSetup1;
