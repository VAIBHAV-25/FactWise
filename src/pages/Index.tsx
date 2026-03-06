import { Users, DollarSign, TrendingUp, Briefcase, Star, MapPin } from "lucide-react";
import StatCard from "@/components/StatCard";
import EmployeeGrid from "@/components/EmployeeGrid";
import { employees } from "@/data/employees";

const Index = () => {
  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.isActive).length;
  const avgSalary = Math.round(employees.reduce((s, e) => s + e.salary, 0) / totalEmployees);
  const avgRating = (employees.reduce((s, e) => s + e.performanceRating, 0) / totalEmployees).toFixed(1);
  const departments = new Set(employees.map((e) => e.department)).size;
  const locations = new Set(employees.map((e) => e.location)).size;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Employee Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Workforce analytics and management</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/15 text-success text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              {activeCount} Active
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold">
              {totalEmployees} Total
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <StatCard title="Employees" value={totalEmployees} icon={Users} subtitle={`${activeCount} active`} trend="up" />
          <StatCard title="Avg Salary" value={`$${avgSalary.toLocaleString()}`} icon={DollarSign} />
          <StatCard title="Avg Rating" value={avgRating} icon={Star} subtitle="out of 5.0" trend="up" />
          <StatCard title="Projects" value={employees.reduce((s, e) => s + e.projectsCompleted, 0)} icon={TrendingUp} subtitle="completed" />
          <StatCard title="Departments" value={departments} icon={Briefcase} />
          <StatCard title="Locations" value={locations} icon={MapPin} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Employee Directory</h2>
          </div>
          <EmployeeGrid />
        </div>
      </main>
    </div>
  );
};

export default Index;
