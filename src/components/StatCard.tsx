import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  color?: "blue" | "green" | "purple" | "amber" | "rose" | "teal";
}

const colorMap = {
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   bar: "from-blue-400 to-blue-600",   ring: "ring-blue-100"   },
  green:  { bg: "bg-green-50",  icon: "text-green-600",  bar: "from-green-400 to-emerald-500",ring: "ring-green-100"  },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", bar: "from-purple-400 to-indigo-500",ring: "ring-purple-100" },
  amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  bar: "from-amber-400 to-orange-400", ring: "ring-amber-100"  },
  rose:   { bg: "bg-rose-50",   icon: "text-rose-600",   bar: "from-rose-400 to-pink-500",    ring: "ring-rose-100"   },
  teal:   { bg: "bg-teal-50",   icon: "text-teal-600",   bar: "from-teal-400 to-cyan-500",    ring: "ring-teal-100"   },
};

const StatCard = ({ title, value, icon: Icon, subtitle, trend, color = "blue" }: StatCardProps) => {
  const c = colorMap[color];
  return (
    <div className="group relative rounded-2xl bg-card border border-border/70 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-border overflow-hidden cursor-default">
      {/* Gradient bottom accent bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${c.bar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Icon */}
      <div className={`rounded-xl ${c.bg} ring-1 ${c.ring} p-2.5 sm:p-3 shrink-0 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${c.icon}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-widest truncate">
          {title}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 truncate tabular-nums">
          {value}
        </p>
        {subtitle && (
          <p className={`text-[10px] sm:text-xs mt-1 font-medium ${
            trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground"
          } truncate`}>
            {trend === "up" ? "↑ " : trend === "down" ? "↓ " : ""}{subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
