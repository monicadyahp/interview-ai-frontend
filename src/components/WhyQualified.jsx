import { Lightbulb, Eye, AlertCircle } from "lucide-react";

export default function WhyQualified() {
  const data = [
    {
      icon: <Lightbulb className="text-[#8C5EAD]" />,
      title: "Your freeze when answering",
      desc: "The pressure hits and your mind goes blank, leaving you stumbling for words.",
    },
    {
      icon: <Eye className="text-[#8C5EAD]" />,
      title: "You look nervous on camera",
      desc: "Micro-expressions and body language betray your confidence without you realizing it.",
    },
    {
      icon: <AlertCircle className="text-[#8C5EAD]" />,
      title: "No one teels you what went wrong",
      desc: "Rejections come with generic emails, leaving you guessing how to improve.",
    },
  ];

  return (
    <section className="pb-24 bg-[#FAFAFA] text-center">
      <div className="max-w-[1350px] mx-auto px-6">

        <h2 className="text-[54px] leading-[1.1] font-bold mb-5 tracking-[-1px]">
          Why Qualified Candidates Fail ?
        </h2>

        <p className="text-[28px] leading-[1.4] text-black max-w-[980px] mx-auto mb-16 font-medium">
          You're not alone. These are the struggles every candidate
          faces before their interview
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {data.map((item, index) => (
            <div
              key={index}
              className="
                bg-white
                rounded-[24px]
                border border-[#ECECEC]
                p-8
                text-left
                shadow-[0_4px_14px_rgba(0,0,0,0.05)]
                hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]
                transition-all
                duration-300
              "
            >

              <div className="w-[58px] h-[58px] rounded-[16px] bg-[#F3EAFB] flex items-center justify-center mb-6">
                {item.icon}
              </div>

              <h3 className="text-[24px] font-bold leading-[1.3] mb-4">
                {item.title}
              </h3>

              <p className="text-[18px] leading-[1.6] text-[#555]">
                {item.desc}
              </p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}