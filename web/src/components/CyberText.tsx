import clsx from "clsx";

interface CyberTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  glitch?: boolean;
  className?: string;
}

export function CyberText({ children, as: Tag = "h1", glitch = false, className }: CyberTextProps) {
  return (
    <Tag
      data-text={glitch ? children : undefined}
      className={clsx(
        "font-[var(--font-display)] tracking-wide",
        glitch && "glitch",
        className
      )}
    >
      {children}
    </Tag>
  );
}
