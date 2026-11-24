import type { ReactNode } from "react";

interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

const SectionHeader = ({ index, eyebrow, title, description, action }: SectionHeaderProps) => (
  <div className="reveal mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl">
      <div className="eyebrow mb-5">
        <span className="text-primary">{index}</span>
        <span className="h-px w-8 bg-border" />
        {eyebrow}
      </div>
      <h2 className="text-4xl font-semibold leading-[1.05] text-foreground md:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default SectionHeader;
