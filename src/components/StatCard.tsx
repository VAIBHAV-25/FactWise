import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

const StatCard = ({ title, value, icon: Icon, subtitle, trend }: StatCardProps) => {
  return (
    <div className="rounded-xl bg-card border border-border p-3 sm:p-4 md:p-5 flex items-start gap-2 sm:gap-3 md:gap-4 transition-shadow hover:shadow-md">
      <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2 md:p-2.5 shrink-0">
        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">{title}</p>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-0.5 sm:mt-1 truncate">{value}</p>
        {subtitle && (
          <p className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-medium ${trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"} truncate`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
