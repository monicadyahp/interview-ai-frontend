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
      title: "No one tells you what went wrong",
      desc: "Rejections come with generic emails, leaving you guessing how to improve.",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F8FF] text-center">
      
      <div className="max-w-[1100px] mx-auto px-6">

        {/* TITLE */}
        <h2 className="text-[28px] md:text-[34px] font-bold mb-2 leading-tight">
          Why Qualified Candidates Fail ?
        </h2>

        {/* SUBTITLE */}
        <p className="text-gray-500 mb-14 max-w-[520px] mx-auto text-[15px] leading-relaxed">
          You're not alone. These are the struggles every candidate faces before their interview
        </p>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-100 
              shadow-[0_10px_30px_rgba(0,0,0,0.05)]
              hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]
              hover:-translate-y-2 transition-all duration-300"
            >
              {/* ICON */}
              <div className="w-10 h-10 flex items-center justify-center bg-[#F3EAFB] rounded-lg mb-4 mx-auto">
                {item.icon}
              </div>

              {/* TITLE */}
              <h3 className="font-semibold mb-2 text-[16px]">
                {item.title}
              </h3>

              {/* DESC */}
              <p className="text-[14px] text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}