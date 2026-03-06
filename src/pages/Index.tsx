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
      <header className="relative overflow-hidden border-b border-border/60">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/6 via-background to-purple-600/4 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 right-0 w-72 h-72 bg-purple-500/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* Brand */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight truncate">
                  FactWise{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Insights
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                  Workforce analytics &amp; people management
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-semibold whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {activeCount} Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/70 text-slate-600 text-xs font-semibold whitespace-nowrap">
                {inactiveCount} Inactive
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold whitespace-nowrap">
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
            <StatCard title="Employees"   value={totalEmployees}                             icon={Users}       color="blue"   />
            <StatCard title="Avg Salary"  value={`$${avgSalary.toLocaleString()}`}           icon={DollarSign}  color="green"  />
            <StatCard title="Avg Rating"  value={`${avgRating}/5`}                           icon={Star}        color="amber"  trend="up" />
            <StatCard title="Projects"    value={totalProjects}                              icon={TrendingUp}  color="purple" />
            <StatCard title="Departments" value={departments}                               icon={Briefcase}   color="teal"   />
            <StatCard title="Locations"   value={locations}                                 icon={MapPin}      color="rose"   />
          </div>
        </div>

        {/* Employee Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
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
