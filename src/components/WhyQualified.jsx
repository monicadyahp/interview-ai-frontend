export default function WhyQualified() {
  const data = [
    {
      icon: "/icons/qualified1.png",
      title: "Your freeze when answering",
      desc: "The pressure hits and your mind goes blank, leaving you stumbling for words.",
    },
    {
      icon: "/icons/qualified2.png",
      title: "You look nervous on camera",
      desc: "Micro-expressions and body language betray your confidence without you realizing it.",
    },
    {
      icon: "/icons/qualified3.png",
      title: "No one teels you what went wrong",
      desc: "Rejections come with generic emails, leaving you guesing how to improve.",
    },
  ];

  return (
    <section className="py-[54px] bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-[1280px] mx-auto px-6">

        {/* HEADING */}
        <h2 className="text-center text-[28px] md:text-[36px] leading-[1.15] font-bold text-[#000000] mb-4">
          Why Qualified Candidates Fail ?
        </h2>

        {/* SUBTITLE */}
        <p className="text-center text-[16px] md:text-[18px] leading-[1.6] text-[#020617] max-w-[600px] mx-auto mb-12">
          You're not alone. These are the struggles every candidate faces before their interview
        </p>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="border border-[#E7E7E7] rounded-[28px] p-8 shadow-sm bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            >
              <img src={item.icon} alt={item.title} className="w-[40px] h-[40px] mb-6" />
              <h3 className="text-[18px] md:text-[20px] leading-[1.3] font-bold text-[#020617] mb-3">
                {item.title}
              </h3>
              <p className="text-[15px] md:text-[16px] leading-[1.6] text-[#020617]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
