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
    <section className="pb-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* HEADING */}
        <h2 className="text-center text-[56px] leading-[1.15] font-bold text-[#000000] mb-6">
          Why Qualified Candidates Fail ?
        </h2>

        {/* SUBTITLE */}
        <p className="text-center text-[32px] leading-[1.4] font-normal text-[#020617] max-w-[1100px] mx-auto mb-20">
          You're not alone. These are the struggles every candidate
          faces before their interview
        </p>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {data.map((item, index) => (
            <div
              key={index}
              className="border border-[#E7E7E7] rounded-[28px] p-10 shadow-sm bg-white"
            >

              {/* ICON */}
              <img
                src={item.icon}
                alt={item.title}
                className="w-[42px] h-[42px] mb-8"
              />

              {/* TITLE */}
              <h3 className="text-[28px] leading-[1.3] font-bold text-[#020617] mb-5">
                {item.title}
              </h3>

              {/* DESC */}
              <p className="text-[18px] leading-[1.6] font-normal text-[#020617]">
                {item.desc}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}