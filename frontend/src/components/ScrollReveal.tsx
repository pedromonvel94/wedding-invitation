import { useEffect, useRef, useState, type ReactNode } from "react";
import { Box } from "@mantine/core";

interface ScrollRevealProps {
  children: ReactNode;
  delayMs?: number;
}

export function ScrollReveal({ children, delayMs = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = domRef.current;
    if (!currentElement) return;

    // Buscar el contenedor con scroll de la carta si existe
    const scrollContainer = currentElement.closest(".envelope-inside-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.12,
      }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  return (
    <Box
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.75s cubic-bezier(0.25, 1, 0.5, 1) ${delayMs}ms, transform 0.75s cubic-bezier(0.25, 1, 0.5, 1) ${delayMs}ms`,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </Box>
  );
}

export default ScrollReveal;
