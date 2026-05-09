import React from "react";

export default function CTAImage({ image }) {
  return (
    <div
      className="
        flex
        justify-center
        items-center
        w-full
        lg:w-auto
      "
    >
      <div
        className="
          overflow-hidden
          rounded-[32px]
          w-full
          max-w-[520px]
        "
      >
        <img
          src={image}
          alt="Interview session"
          className="
            w-full
            h-[260px]
            md:h-[360px]
            object-cover
          "
        />
      </div>
    </div>
  );
}
