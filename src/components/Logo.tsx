interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

/** RI Library mark (open book + code mark + brass bookmark) with a typeset wordmark. */
const Logo = ({ size = 36, className = "", showText = true }: LogoProps) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <img
      src={`${import.meta.env.BASE_URL}logo.svg`}
      alt={showText ? "" : "RI Library"}
      width={size}
      height={size}
      style={{ height: size, width: size }}
      className="select-none rounded-[22%] object-contain"
      draggable={false}
    />
    {showText && (
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] font-semibold tracking-tight text-foreground">
          RI <span className="text-gradient">Library</span>
        </span>
        <span className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Computer Science · Open Shelf
        </span>
      </span>
    )}
  </span>
);

export default Logo;
