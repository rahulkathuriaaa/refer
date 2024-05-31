// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import InfluencerSetup3 from "./InfluencerSetup3";
import { useInfluencerData } from "@/store";
import Spline from "@splinetool/react-spline";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { useRouter } from "next/navigation";

function InfluencerSetup2() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [links, setLinks] = useState([]);
  const [choose, setChoose] = useState(true);
  const handleLinkChange = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  function updateStore() {
    const storedInfluencerData = JSON.parse(
      localStorage.getItem("influencerData")
    );
    useInfluencerData.setState({
      ...storedInfluencerData,
      links: String(links),
    });
  }
  const handleContinue = () => {
    console.log(String(links));
    updateStore();

    setChoose(false);
    router.push("./infsetup2/infsetup3");
  };
  useEffect(() => {
    if (session?.user?.username) {
      handleLinkChange(3, "https://x.com/" + session.user.username);
    }
  }, [session]);

  return (
    <>
      <div className="bg-[#111111] min-h-screen flex justify-center items-center">
        <div
          className={`w-[90%] justify-center gap-10 ${
            choose ? "flex" : "hidden"
          } `}
        >
          <div className="w-[50%] text-white flex flex-col my-10 gap-4">
            <p className="text-3xl font-semibold">Connect Your Social</p>

            <div className="ml-2 flex flex-col gap-4">
              <div className="flex flex-col gap-4 overflow-auto h-[70vh]">
                <div className="flex flex-col gap-3 w-[80%] bg-[#27292D] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/twitter.svg"
                        width="252"
                        height="300"
                        className="w-[50%]"
                        alt="Ref3r logo"
                      />
                      <p>Twitter</p>
                    </div>
                    {session ? (
                      <>
                        <Link href="/api/auth/signout?callbackUrl=/dashboard/signup/infsetup1/infsetup2">
                          Remove
                        </Link>
                        <button className="bg-[#00B24F] px-4 py-2 text-white rounded-2xl w-[30%]">
                          {session.user.username}
                        </button>
                      </>
                    ) : (
                      <Link href="/api/auth/signin?callbackUrl=/dashboard/signup/infsetup1/infsetup2">
                        <button className="bg-[#00B24F] px-4 py-2 text-white rounded-2xl w-[30%]">
                          Authorise
                        </button>
                      </Link>
                    )}
                  </div>
                  <p className="text-[#909090]">
                    Real-time conversations, breaking news, and cultural pulse -
                    connect directly with your audience.
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-[80%] bg-[#27292D] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/instagram.svg"
                        width="252"
                        height="300"
                        className="w-[50%]"
                        alt="Ref3r logo"
                      />
                      <p>Instagram</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Paste Link"
                      className="bg-[#27292D] text-lg border-white border-2 rounded-2xl p-4 text-white w-[50%]"
                      onChange={(e) => handleLinkChange(0, e.target.value)}
                    />
                  </div>
                  <p className="text-[#909090]">
                    Captivate your audience with visually stunning stories and
                    build deeper connections.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-[80%] bg-[#27292D] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/facebook.svg"
                        width="252"
                        height="300"
                        className="w-[50%]"
                        alt="Ref3r logo"
                      />
                      <p>Facebook</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Paste Link"
                      className="bg-[#27292D] text-lg border-white border-2 rounded-2xl p-4 text-white w-[50%]"
                      onChange={(e) => handleLinkChange(1, e.target.value)}
                    />
                  </div>
                  <p className="text-[#909090]">
                    Targeted advertising, massive user base, and diverse
                    engagement tools for building communities.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-[80%] bg-[#27292D] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/tiktok.svg"
                        width="252"
                        height="300"
                        className="w-[50%]"
                        alt="Ref3r logo"
                      />
                      <p>Tiktok</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Paste Link"
                      className="bg-[#27292D] text-lg border-white border-2 rounded-2xl p-4 text-white w-[50%]"
                      onChange={(e) => handleLinkChange(3, e.target.value)}
                    />
                  </div>
                  <p className="text-[#909090]">
                    Unleash viral potential & real connections through creative,
                    bite-sized content.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-[80%] bg-[#27292D] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/linkedin.svg"
                        width="252"
                        height="300"
                        className="w-[50%]"
                        alt="Ref3r logo"
                      />
                      <p>LinkedIn</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Paste Link"
                      className="bg-[#27292D] text-lg border-white border-2 rounded-2xl p-4 text-white w-[50%]"
                      onChange={(e) => handleLinkChange(4, e.target.value)}
                    />
                  </div>
                  <p className="text-[#909090]">
                    Connect with professionals, build thought leadership, and
                    access targeted B2B audiences.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-[80%] bg-[#27292D] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/youtube.svg"
                        width="252"
                        height="300"
                        className="w-[50%]"
                        alt="Ref3r logo"
                      />
                      <p>Youtube</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Paste Link"
                      className="bg-[#27292D] text-lg border-white border-2 rounded-2xl p-4 text-white w-[50%]"
                      onChange={(e) => handleLinkChange(5, e.target.value)}
                    />
                  </div>
                  <p className="text-[#909090]">
                    Connecting you with professionals in your industries,
                    fostering thought leadership, and driving B2B opportunities.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-[80%] bg-[#27292D] rounded-xl p-4">
                  {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Image
                      src="/icons/champ.svg"
                      width="252"
                      height="300"
                      className="w-[50%]"
                      alt="Ref3r logo"
                    />
                    <p>Mailchamp</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Paste Link"
                    className="bg-[#27292D] text-lg border-white border-2 rounded-2xl p-4 text-white w-[50%]"
                    onChange={(e) => handleLinkChange(0, e.target.value)}
                  />
                </div> */}
                  <p className="text-[#909090]">
                    Connecting you with professionals in your industries,
                    fostering thought leadership, and driving B2B opportunities.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-[80%] bg-[#27292D] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/beehive.svg"
                        width="252"
                        height="300"
                        className="w-[50%]"
                        alt="Ref3r logo"
                      />
                      <p>Beehiive</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Paste Link"
                      className="bg-[#27292D] text-lg border-white border-2 rounded-2xl p-4 text-white w-[50%]"
                      onChange={(e) => handleLinkChange(6, e.target.value)}
                    />
                  </div>
                  <p className="text-[#909090]">
                    Connecting you with professionals in your industries,
                    fostering thought leadership, and driving B2B opportunities.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-[80%] bg-[#27292D] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/medium.svg"
                        width="252"
                        height="300"
                        className="w-[50%]"
                        alt="Ref3r logo"
                      />
                      <p>Medium</p>
                    </div>

                    <input
                      type="text"
                      placeholder="Paste Link"
                      className="bg-[#27292D] text-lg border-white border-2 rounded-2xl p-4 text-white w-[50%]"
                      onChange={(e) => handleLinkChange(7, e.target.value)}
                    />
                  </div>

                  <p className="text-[#909090]">
                    Connecting you with professionals in your industries,
                    fostering thought leadership, and driving B2B opportunities.
                  </p>
                </div>
              </div>

              <button
                className="bg-[#00B24F] px-4 py-2 text-white rounded-2xl md:rounded-lg w-[30%]"
                onClick={() => {
                  handleContinue();
                }}
              >
                Continue
              </button>
            </div>
          </div>

          <div className="w-[50%] h-[94vh] top-[3%] sticky rounded-2xl bg-black flex justify-center items-center">
            {/* <Image
            src="/User.svg"
            width="252"
            height="300"
            className="w-[100%]"
            alt="Ref3r logo"
          /> */}
            <Spline scene="https://prod.spline.design/2rLQrhjlogSapElU/scene.splinecode" />
          </div>
        </div>
      </div>
    </>
  );
}

export default InfluencerSetup2;
