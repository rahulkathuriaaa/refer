import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  useBrandData,
  useInfluencerData,
  useIsInfluencer,
  usePublicKey,
} from "@/store";
import { checkUserType } from "@/appwrite/utils";
import appwriteService from "@/appwrite/config";
import { useRouter } from "next/navigation";
import ChatPop from "../dashboard/ChatPop";

const CardsBrandsForInfluencers = ({
  image,
  name,
  description,
  currentUserDocumentId,
  cardDocumentId,
  cardUserKey,
}: {
  image: any;
  name: string;
  description: string;
  currentUserDocumentId: string;
  cardDocumentId: string;
  cardUserKey: string;
}) => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [roomId, setRoomId] = useState("");

  const currentUserKey = usePublicKey.getState().publicKey;

  useEffect(() => {
    const fetchConnections = async () => {
      const userType = await checkUserType(currentUserKey);
      const connections =
        userType === "brand"
          ? useBrandData.getState().connections
          : useInfluencerData.getState().connections;
      setIsConnected(connections?.includes(cardUserKey));
    };
    fetchConnections();
  }, [currentUserKey, cardUserKey]);

  const updateConnections = async () => {
    setIsLoading(true);

    const updateUserConnections = async (
      documentId: string,
      key: string,
      otherUserKey: string
    ) => {
      const userType = await checkUserType(key);
      const updateFn =
        userType === "brand"
          ? appwriteService.updateBrandConnection
          : appwriteService.updateInfluencerConnection;
      await updateFn(
        documentId,
        useBrandData.getState().connections + `,${otherUserKey}`
      );
    };

    try {
      await updateUserConnections(
        currentUserDocumentId,
        currentUserKey,
        cardUserKey
      );
      await updateUserConnections(cardDocumentId, cardUserKey, currentUserKey);
      setIsConnected(true);
    } catch (error) {
      console.error("Error updating connections:", error);
    }

    setIsLoading(false);
  };

  const handleMessageClick = () => {
    let chatUrl = useIsInfluencer.getState().isInfluencer
      ? `${currentUserKey}-${cardUserKey}-${currentUserKey}`
      : `${currentUserKey}-${currentUserKey}-${cardUserKey}`;
    setRoomId(chatUrl);
    console.log("chat url", chatUrl);
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="text-white w-[23%] p-3 rounded-lg bg-[#111111] flex flex-col gap-3">
      <div className="rounded-full">
        <Image
          src={image}
          width="65"
          height="65"
          alt="home fill"
          className="rounded-full"
        />
      </div>
      <p className="text-xl font-semibold">{name}</p>
      <p>{description}</p>
      <div className="bg-white h-[1px] rounded-full"></div>
      <div>
        {isConnected ? (
          <>
            <button
              onClick={handleMessageClick}
              className="text-white bg-black py-1 px-4 rounded-lg w-[50%]"
            >
              <ChatPop name={name} room={roomId} />
            </button>
          </>
        ) : (
          <button
            onClick={updateConnections}
            className="rounded bg-[#00B24F] text-white px-2 py-1 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "..." : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CardsBrandsForInfluencers;
