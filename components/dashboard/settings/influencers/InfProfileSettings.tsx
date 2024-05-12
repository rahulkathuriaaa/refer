// @ts-nocheck
"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useInfluencerData } from "@/store";
import { updateInfluencerData } from "@/appwrite/utils";
import appwriteService from "@/appwrite/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InfProfileSettings() {
  const [choose, setChoose] = useState(true);
  const [newName, setNewName] = useState(useInfluencerData.getState().name);
  const [newBio, setNewBio] = useState(useInfluencerData.getState().bio);
  const [newNiche, setNewNiche] = useState(useInfluencerData.getState().niche);
  const [newFollowerCount, setNewFollowerCount] = useState(
    useInfluencerData.getState().follower_count
  );
  const [newProfileImg, setNewProfileImg] = useState(
    useInfluencerData.getState().profile_img
  );

  const fileInputRef = useRef(null);
  const showToastMessage = () => {
    toast("Update Sucessfull");
  };

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
    <div className="flex flex-col gap-28">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-2xl text-white font-semibold">Name</label>
          <input
            type="text"
            id="event-name"
            placeholder="Name"
            value={newName}
            className="bg-[#27292D] text-lg rounded-2xl p-4 text-white  w-[50%]"
            onChange={(e) => {
              setNewName(e.target.value);
              console.log(newName);
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-2xl text-white font-semibold">Bio</label>
          <textarea
            placeholder="Description..."
            rows={4}
            className="bg-[#27292D] rounded-2xl p-4 text-white resize-none w-[50%]"
            value={newBio}
            onChange={(e) => {
              setNewBio(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-2xl text-white font-semibold">
            Your Niche
          </label>
          <input
            type="text"
            id="event-name"
            placeholder="Link"
            className="bg-[#27292D] text-lg rounded-2xl p-4 text-white  w-[50%]"
            value={newNiche}
            onChange={(e) => {
              setNewNiche(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 w-[20%]">
          <label className="text-2xl text-white font-semibold cursor-pointer">
            Profile Picture
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
              className="w-[10%] cursor-pointer"
              alt="Ref3r logo"
              onClick={handleImageClick}
            />
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-20">
        {/* <div className="text-2xl text-white font-semibold">
          Profile Visibility
          <div className="mt-10 w-[50%] pl-[7%] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl text-white font-semibold">Public</div>
              {choose ? (
                <Image
                  src="/icons/AllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              ) : (
                <Image
                  src="/icons/NoAllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl text-white font-semibold">Private</div>
              {choose ? (
                <Image
                  src="/icons/NoAllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              ) : (
                <Image
                  src="/icons/AllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl text-white font-bold">Limited</div>
              {choose ? (
                <Image
                  src="/icons/NoAllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              ) : (
                <Image
                  src="/icons/AllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              )}
            </div>
          </div>
        </div>

        <div className="text-2xl text-white font-semibold">
          Partnerships Visibility
          <div className="mt-10 w-[50%] pl-[7%] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl text-white font-semibold">
                Current Partnership
              </div>
              {choose ? (
                <Image
                  src="/icons/NoAllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              ) : (
                <Image
                  src="/icons/AllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl text-white font-semibold">
                Past Partnership
              </div>
              {choose ? (
                <Image
                  src="/icons/AllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              ) : (
                <Image
                  src="/icons/NoAllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl text-white font-bold">Both</div>
              {choose ? (
                <Image
                  src="/icons/NoAllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              ) : (
                <Image
                  src="/icons/AllowSetting.svg"
                  width="252"
                  height="300"
                  className="w-[10%]"
                  alt="Ref3r logo"
                  onClick={handleClick}
                />
              )}
            </div>
          </div>
        </div> */}

        <div className="flex items-center justify-between w-[70%]">
          <div className="text-2xl text-white font-bold">
            Total Follower Counts
          </div>
          <input
            type="text"
            id="event-name"
            placeholder="Link"
            className="bg-[#27292D] text-lg rounded-2xl p-4 text-white  w-[50%]"
            value={newFollowerCount}
            onChange={(e) => {
              setNewFollowerCount(e.target.value);
            }}
          />
        </div>
      </div>
      {/* <div className="flex flex-col w-[65%]">
        <div className="flex justify-between items-center">
          <p className="text-white text-lg">Connect/Disconnect Social Media</p>
          <button className="text-[#00B24F] text-xl font-medium px-4 py-2 border-2 border-[#00B24F] rounded-lg">
            Social Media Accounts
          </button>
        </div>
      </div> */}
      <div className="gap-4 flex ">
        <button
          onClick={async () => {
            useInfluencerData.setState({
              name: newName,
              bio: newBio,
              niche: newNiche,
              follower_count: newFollowerCount,
              profile_img: newProfileImg,
            });
            const res = await updateInfluencerData();
            if (res) {
              showToastMessage();
            }
          }}
          className="bg-[#00B24F] py-2 px-1 text-white rounded-xl min-w-[15%]"
        >
          Save Changes
        </button>
      </div>
      <ToastContainer></ToastContainer>{" "}
    </div>
  );
}

export default InfProfileSettings;
