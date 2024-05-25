// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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
    if (!room) {
      console.error("Room is not defined");
      return;
    }

    const result = room.replace(/%40/g, "@").split("-");
    console.log("Processed room:", result);

    if (result.length < 3) {
      console.error("Room format is incorrect:", result);
      return;
    }

    const key = result[0];
    const currentUserKey = result[1];
    const otherUserKey = result[2];

    const getMessages = async () => {
      console.log(`${currentUserKey}-${otherUserKey}`);
      try {
        const prevMessages = await appwriteService.getMessages(
          `${currentUserKey}-${otherUserKey}`
        );
        console.log("Previous messages:", prevMessages);
        setMessages(prevMessages?.documents);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [room]);

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
    const result = room.replace(/%40/g, "@").split("-");
    e.preventDefault();
    console.log(`${result[1]}-${result[2]}`);
    const message = e.target.message.value;
    const chatObj = {
      key: key,
      room: `${result[1]}-${result[2]}`,
      messages: message,
    };
    setCurrMessage("");

    try {
      const res = await appwriteService.createChat(chatObj);
      console.log("Message sent:", res);
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

const ChatPop = ({ room, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { nameID, messages, currMessage, setCurrMessage, sendMessage } =
    useChat(room);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const key = usePublicKey.getState().publicKey;

  return (
    <div className="">
      <button onClick={togglePopup} className="">
        <Image
          src="/icons/Message.svg"
          width="30"
          height="65"
          alt="home fill"
          className=""
        />
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex justify-end items-end z-10 right-[2.5%]">
          <div className="flex flex-col w-[50%] justify-center items-center shadow-lg">
            <div className="flex justify-between items-center w-full bg-[#323439] border border-[#DFE0EB] rounded-t-xl">
              <div className="text-white text-lg font-semibold py-4 px-3 flex items-center gap-3">
                <Image
                  src={"/profile.svg"}
                  width={30}
                  height={30}
                  alt="go"
                  className="rounded-full"
                />
                <div className="flex flex-col justify-start items-start">
                  <p>{name}</p>
                </div>
              </div>
              <button
                onClick={togglePopup}
                className="text-white font-bold py-2 px-4"
              >
                Close Chat
              </button>
            </div>

            <div className="h-[60vh] bg-black flex flex-col w-full py-4 gap-10">
              <div className="h-[40vh] overflow-auto flex justify-center w-full">
                <div className="flex flex-col items-center w-[75%] gap-6">
                  {messages?.map((message, index) => (
                    <div
                      key={index}
                      className={`w-full flex ${
                        message.key === key ? "justify-end" : "justify-start"
                      } gap-4`}
                    >
                      {message.key !== key && (
                        <Image
                          src={"/profile.svg"}
                          width={30}
                          height={30}
                          alt="go"
                          className="rounded-full"
                        />
                      )}
                      <p
                        className={`text-start p-2 max-w-[50%] border ${
                          message.key !== key
                            ? "border-[#00B24F] bg-[#00B24F] text-white"
                            : "border-[#C6FFE6] bg-[#27292D] text-[#00B24F]"
                        } rounded-xl text-sm`}
                      >
                        {message.messages}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center items-center">
                <form
                  onSubmit={sendMessage}
                  className="flex justify-between text-start p-2 w-[70%] border border-[#C6FFE6] bg-[#27292D] rounded-xl text-sm text-[#00B24F]"
                >
                  <input
                    value={currMessage}
                    onChange={(e) => setCurrMessage(e.target.value)}
                    type="text"
                    name="message"
                    placeholder="Type Your Message......"
                    className="pl-2 max-w-[50%] text-[#DBDBDB] bg-transparent outline-none"
                  />
                  <button type="submit">Send</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPop;
