import { Lightbulb, Eye, AlertCircle } from "lucide-react";

export default function WhyQualified() {
  const data = [
    {
      icon: <Lightbulb className="text-[#8C5EAD] w-5 h-5" />,
      title: "Your freeze when answering",
      desc: "The pressure hits and your mind goes blank, leaving you stumbling for words.",
    },
    {
      icon: <Eye className="text-[#8C5EAD] w-5 h-5" />,
      title: "You look nervous on camera",
      desc: "Micro-expressions and body language betray your confidence without you realizing it.",
    },
    {
      icon: <AlertCircle className="text-[#8C5EAD] w-5 h-5" />,
      title: "No one teels you what went wrong",
      desc: "Rejections come with generic emails, leaving you guessing how to improve.",
    },
  ];

  return (
    <section className="pb-24 bg-white">
      
      <div className="max-w-[1350px] mx-auto px-6">

        <div className="text-center mb-14">
          <h2 className="text-[32px] md:text-[38px] font-bold leading-tight mb-4 text-black">
            Why Qualified Candidates Fail ?
          </h2>

          <p className="text-[22px] leading-[1.4] text-black font-medium max-w-[900px] mx-auto">
            You're not alone. These are the struggles every candidate faces before their interview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {data.map((item, index) => (
            <div
              key={index}
              className="
                bg-white
                rounded-[24px]
                border
                border-[#ECECEC]
                px-7
                py-7
                shadow-[0_4px_10px_rgba(0,0,0,0.06)]
              "
            >
    
              <div className="w-[54px] h-[54px] rounded-[14px] bg-[#F3EAFB] flex items-center justify-center mb-6">
                {item.icon}
              </div>

              <h3 className="text-[24px] font-bold leading-[1.2] text-black mb-4">
                {item.title}
              </h3>

              <p className="text-[18px] leading-[1.5] text-[#4B4B4B]">
                {item.desc}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}