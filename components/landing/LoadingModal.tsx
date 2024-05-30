"use client";
import Lottie from "lottie-react";
import Loading from "@/public/Loading.json";

export default function LoadingModal({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <div className="flex fixed inset-0 items-center justify-center overflow-hidden bg-black bg-opacity-95 z-10">
        <Lottie
          animationData={Loading}
          loop={true}
          style={{
            height: 450,
            width: 450,
            marginRight: "auto",
            marginLeft: "auto",
          }}
        />
      </div>
    );
  }
  return <></>;
}
