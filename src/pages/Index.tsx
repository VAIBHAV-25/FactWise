import { Users, DollarSign, TrendingUp, Briefcase, Star, MapPin, BarChart3 } from "lucide-react";
import StatCard from "@/components/StatCard";
import EmployeeGrid from "@/components/EmployeeGrid";
import { employees } from "@/data/employees";

const Index = () => {
  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.isActive).length;
  const inactiveCount = totalEmployees - activeCount;
  const avgSalary = Math.round(employees.reduce((s, e) => s + e.salary, 0) / totalEmployees);
  const avgRating = (employees.reduce((s, e) => s + e.performanceRating, 0) / totalEmployees).toFixed(1);
  const departments = new Set(employees.map((e) => e.department)).size;
  const locations = new Set(employees.map((e) => e.location)).size;
  const totalProjects = employees.reduce((s, e) => s + e.projectsCompleted, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Hero Header ── */}
      <header className="sticky top-0 z-50 overflow-hidden border-b border-border/60 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* Brand */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 group cursor-pointer">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate text-foreground transition-colors duration-300">
                  FactWise{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    Insights
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate font-medium">
                  Workforce analytics &amp; people management
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-transform hover:scale-105">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                {activeCount} Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-transform hover:scale-105">
                {inactiveCount} Inactive
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-transform hover:scale-105">
                {totalEmployees} Total
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 flex-1">

        {/* Stat Cards */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-0.5">
            Overview
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
              <StatCard title="Employees"   value={totalEmployees}                             icon={Users}       color="blue"   />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "75ms" }}>
              <StatCard title="Avg Salary"  value={`$${avgSalary.toLocaleString()}`}           icon={DollarSign}  color="green"  />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <StatCard title="Avg Rating"  value={`${avgRating}/5`}                           icon={Star}        color="amber"  trend="up" />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "225ms" }}>
              <StatCard title="Projects"    value={totalProjects}                              icon={TrendingUp}  color="purple" />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <StatCard title="Departments" value={departments}                               icon={Briefcase}   color="teal"   />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "375ms" }}>
              <StatCard title="Locations"   value={locations}                                 icon={MapPin}      color="rose"   />
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="animate-fade-in-up" style={{ animationDelay: "450ms" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                Employee Directory
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalEmployees} employees across {departments} departments · {locations} locations
              </p>
            </div>
          </div>
          <EmployeeGrid />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 bg-card/50 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © 2026 FactWise Insights · All rights reserved
          </p>
          <p className="text-xs text-muted-foreground">
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/vaibhav-singhvi-p16102001/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Vaibhav Singhvi
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
