// @ts-nocheck
import { useEffect, useState } from "react";
import { appwriteApi } from "@/appwrite/config";
import appwriteService from "@/appwrite/config";
import conf from "@/conf/config";
import { usePublicKey } from "@/store";

export function useChat(room: string) {
  const key = usePublicKey.getState().publicKey;
  const [nameID, setNameID] = useState<string>();
  const [messages, setMessages] = useState<any[]>([]);
  const [currMessage, setCurrMessage] = useState<string>("");

  useEffect(() => {
    const result = room.replace(/%40/g, "@").split("-");
    const key = result[0];
    const currentUserKey = result[1];

    // const updateData = async () => {
    //   try {
    //     if (currentUserKey === result[2]) {
    //       const data = await appwriteService.getInfluencerData(key);
    //       setNameID(data.documents[0].name);
    //     } else if (currentUserKey === result[1]) {
    //       const data = await appwriteService.getBrandData(key);
    //       setNameID(data.documents[0].name);
    //     }
    //     const currentUserData = await appwriteService.getCurrentUser();
    //     console.log(currentUserData);
    //   } catch (error) {
    //     console.error("Error updating data:", error);
    //   }
    // };

    const getMessages = async () => {
      console.log(room);
      const result = room.replace(/%40/g, "@").split("-");
      console.log("get messages called");
      console.log(result[1] + "-" + result[2]);
      try {
        const prevMessages = await appwriteService.getMessages(
          result[1] + "-" + result[2]
        );
        console.log(prevMessages);
        setMessages(prevMessages?.documents);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    // updateData();
    getMessages();
  }, []);

  useEffect(() => {
    const unsubscribe = appwriteApi.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteChatId}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setMessages((prev) => [...prev, response.payload]);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const message = e.target.message.value;
    const chatObj = {
      key: key,
      room: room.replace(/%40/g, "@"),
      messages: message,
    };
    setCurrMessage("");

    try {
      const res = await appwriteService.createChat(chatObj);
      console.log(res);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return {
    nameID,
    messages,
    currMessage,
    setCurrMessage,
    sendMessage,
  };
}
