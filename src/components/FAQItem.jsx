import React, { useLayoutEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer, isOpen, onClick }) {
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : "0px";
    }
  }, [isOpen, answer]);

  return (
    <div
      className="
        bg-[#EEE3FF]
        rounded-[28px]
        overflow-hidden
        transition-all
        duration-500
      "
    >
      {/* Question */}
      <button
        onClick={onClick}
        className="
          w-full
          flex
          items-center
          justify-between
          gap-5
          text-left
          px-6
          py-6
          md:px-8
          md:py-7
        "
      >
        <h3
          className="
            text-[20px]
            md:text-[28px]
            font-bold
            leading-snug
            text-black
          "
        >
          {question}
        </h3>

        <ChevronDown
          className={`
            min-w-[28px]
            min-h-[28px]
            transition-transform
            duration-500
            ease-in-out
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Answer */}
      <div
        ref={contentRef}
        className="
          transition-all
          duration-700
          ease-in-out
          overflow-hidden
        "
        style={{
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-6 pb-6 md:px-8 md:pb-8">
          <div
            className="
              bg-white
              rounded-[22px]
              p-5
              md:p-6
              border
              border-[#E8E8E8]
              shadow-sm
            "
          >
            <p
              className="
                text-[16px]
                md:text-[20px]
                leading-relaxed
                text-[#333333]
              "
            >
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
