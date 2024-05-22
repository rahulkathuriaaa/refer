import React from "react";
import Image from "next/image";

const CardsBrandsForInfluencers = ({
  image,
  name,
  description,
}: {
  image: any;
  name: string;
  description: string;
}) => {
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
        <button className="text-white bg-[#00B24F] py-1 px-4 rounded-lg w-[50%]">
          View
        </button>
      </div>
    </div>
  );
};

export default CardsBrandsForInfluencers;
