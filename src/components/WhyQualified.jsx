import { Lightbulb, Eye, AlertCircle } from "lucide-react";

export default function WhyQualified() {
  const data = [
    {
      icon: <Lightbulb className="text-[#8C5EAD] w-6 h-6" />,
      title: "Your freeze when answering",
      desc: "The pressure hits and your mind goes blank, leaving you stumbling for words.",
    },
    {
      icon: <Eye className="text-[#8C5EAD] w-6 h-6" />,
      title: "You look nervous on camera",
      desc: "Micro-expressions and body language betray your confidence without you realizing it.",
    },
    {
      icon: <AlertCircle className="text-[#8C5EAD] w-6 h-6" />,
      title: "No one tells you what went wrong",
      desc: "Rejections come with generic emails, leaving you guessing how to improve.",
    },
  ];

  return (
    <section className="py-28 bg-[#F8F8FF] text-center">
      
      <div className="max-w-[1200px] mx-auto px-6">

        <h2 className="text-[34px] md:text-[48px] font-bold mb-4 leading-tight">
          Why Qualified Candidates Fail ?
        </h2>

        <p className="text-gray-500 mb-16 max-w-[650px] mx-auto text-[17px] leading-relaxed">
          You're not alone. These are the struggles every candidate faces before their interview
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="
                bg-white 
                p-10
                min-h-[320px]
                rounded-[28px] 
                border border-gray-100
                shadow-[0_10px_30px_rgba(0,0,0,0.05)]
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]
                hover:-translate-y-3
                transition-all 
                duration-300
                flex flex-col
                items-center
                justify-start
              "
            >
             
              <div className="w-16 h-16 flex items-center justify-center bg-[#F3EAFB] rounded-2xl mb-7">
                {item.icon}
              </div>

              <h3 className="font-semibold mb-4 text-[22px] leading-snug">
                {item.title}
              </h3>

              <p className="text-[16px] text-gray-500 leading-relaxed">
                {item.desc}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}