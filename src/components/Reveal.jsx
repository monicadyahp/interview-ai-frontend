import React, { useEffect, useRef, useState } from "react";

/**
 * Reveal — animasikan elemen saat masuk viewport (scroll reveal).
 *
 * Props:
 *  - direction: "up" | "down" | "left" | "right" | "zoom"  (default "up")
 *  - delay: angka ms untuk efek bertahap (stagger)          (default 0)
 *  - as: tag/komponen pembungkus                            (default "div")
 *  - once: animasi hanya sekali (default true)
 *  - className: kelas tambahan
 *
 * Contoh:
 *  <Reveal direction="up" delay={100}> ...konten... </Reveal>
 */
const Reveal = ({
  children,
  direction = "up",
  delay = 0,
  as: Tag = "div",
  once = true,
  className = "",
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      className={`reveal reveal-${direction} ${visible ? "reveal-visible" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
