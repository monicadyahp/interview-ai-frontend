import React, { useEffect, useRef, useState } from "react";
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
