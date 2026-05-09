import {
  Lightbulb,
  Frown,
  MessageCircleWarning,
} from "lucide-react";

export default function WhyQualified() {
  const data = [
    {
      icon: <Lightbulb size={28} className="text-[#7C3AED]" />,
      title: "Your freeze when answering",
      desc: "The pressure hits and your mind goes blank, leaving you stumbling for words.",
    },
    {
      icon: <Frown size={28} className="text-[#7C3AED]" />,
      title: "You look nervous on camera",
      desc: "Micro-expressions and body language betray your confidence without you realizing it.",
    },
    {
      icon: (
        <MessageCircleWarning
          size={28}
          className="text-[#7C3AED]"
        />
      ),
      title: "No one teels you what went wrong",
      desc: "Rejections come with generic emails, leaving you guesing how to improve.",
    },
  ];

  return (
    <section className="pb-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
    
        <h2 className="text-center text-[56px] leading-[1.1] font-bold text-black mb-5">
          Why Qualified Candidates Fail ?
        </h2>

        <p className="text-center text-[24px] leading-[1.5] text-black max-w-[950px] mx-auto mb-16">
          You're not alone. These are the struggles every candidate
          faces before their interview
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="border border-[#E8E8E8] rounded-[24px] p-8 shadow-sm"
            >

              <div className="mb-6">
                {item.icon}
              </div>

              <h3 className="text-[22px] leading-[1.3] font-bold text-black mb-4">
                {item.title}
              </h3>

              <p className="text-[18px] leading-[1.6] text-[#5F5F5F]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}