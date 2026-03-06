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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">Employee Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">Workforce analytics and management</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-success/15 text-success text-[10px] sm:text-xs font-semibold whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              {activeCount} Active
            </span>
            <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-muted text-muted-foreground text-[10px] sm:text-xs font-semibold whitespace-nowrap">
              {totalEmployees} Total
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4">
          <StatCard title="Employees" value={totalEmployees} icon={Users}  trend="up" />
          <StatCard title="Avg Salary" value={`$${avgSalary.toLocaleString()}`} icon={DollarSign} />
          <StatCard title="Avg Rating" value={`${avgRating}/5`} icon={Star} trend="up" />
          <StatCard title="Projects" value={employees.reduce((s, e) => s + e.projectsCompleted, 0)} icon={TrendingUp} />
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

      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Made by{" "}
            <a
              href="https://www.linkedin.com/in/vaibhav-singhvi-p16102001/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
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
