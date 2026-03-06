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
    <div className="rounded-xl bg-card border border-border p-5 flex items-start gap-4 transition-shadow hover:shadow-md">
      <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        {subtitle && (
          <p className={`text-xs mt-1 font-medium ${trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
