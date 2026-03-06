import { useMemo, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  ValueFormatterParams,
  ICellRendererParams,
  GridReadyEvent,
  GridApi,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { employees, Employee } from "@/data/employees";

const StatusRenderer = (params: ICellRendererParams<Employee>) => {
  const active = params.value;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        active
          ? "bg-success/15 text-success"
          : "bg-destructive/15 text-destructive"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-success" : "bg-destructive"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
};

const RatingRenderer = (params: ICellRendererParams<Employee>) => {
  const rating = params.value as number;
  const percentage = (rating / 5) * 100;
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor:
              rating >= 4.5
                ? "hsl(var(--success))"
                : rating >= 4.0
                ? "hsl(var(--primary))"
                : "hsl(var(--warning))",
          }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-7">{rating}</span>
    </div>
  );
};

const SkillsRenderer = (params: ICellRendererParams<Employee>) => {
  const skills = params.value as string[];
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {skills.slice(0, 2).map((skill) => (
        <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-medium">
          {skill}
        </span>
      ))}
      {skills.length > 2 && (
        <span className="text-[11px] text-muted-foreground font-medium">+{skills.length - 2}</span>
      )}
    </div>
  );
};

const DepartmentRenderer = (params: ICellRendererParams<Employee>) => {
  const dept = params.value as string;
  const colorMap: Record<string, string> = {
    Engineering: "bg-info/15 text-info",
    Marketing: "bg-[hsl(280_60%_50%/0.15)] text-[hsl(280_60%_50%)]",
    Sales: "bg-success/15 text-success",
    HR: "bg-warning/15 text-warning",
    Finance: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${colorMap[dept] || "bg-muted text-muted-foreground"}`}>
      {dept}
    </span>
  );
};

const EmployeeGrid = () => {
  const gridRef = useRef<AgGridReact<Employee>>(null);

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      {
        headerName: "Employee",
        field: "firstName",
        minWidth: 180,
        flex: 1.5,
        valueGetter: (p) => `${p.data?.firstName} ${p.data?.lastName}`,
        cellRenderer: (params: ICellRendererParams<Employee>) => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">
                {params.data?.firstName?.[0]}{params.data?.lastName?.[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{params.value}</p>
              <p className="text-[11px] text-muted-foreground truncate">{params.data?.email}</p>
            </div>
          </div>
        ),
      },
      {
        headerName: "Department",
        field: "department",
        minWidth: 130,
        flex: 1,
        cellRenderer: DepartmentRenderer,
        filter: true,
      },
      {
        headerName: "Position",
        field: "position",
        minWidth: 160,
        flex: 1.2,
      },
      {
        headerName: "Location",
        field: "location",
        minWidth: 120,
        flex: 0.8,
      },
      {
        headerName: "Salary",
        field: "salary",
        minWidth: 110,
        flex: 0.8,
        type: "numericColumn",
        valueFormatter: (p: ValueFormatterParams) =>
          p.value != null ? `$${p.value.toLocaleString()}` : "",
      },
      {
        headerName: "Rating",
        field: "performanceRating",
        minWidth: 140,
        flex: 1,
        cellRenderer: RatingRenderer,
      },
      {
        headerName: "Projects",
        field: "projectsCompleted",
        minWidth: 90,
        flex: 0.6,
        type: "numericColumn",
      },
      {
        headerName: "Skills",
        field: "skills",
        minWidth: 180,
        flex: 1.5,
        cellRenderer: SkillsRenderer,
        sortable: false,
      },
      {
        headerName: "Status",
        field: "isActive",
        minWidth: 110,
        flex: 0.7,
        cellRenderer: StatusRenderer,
      },
      {
        headerName: "Hire Date",
        field: "hireDate",
        minWidth: 110,
        flex: 0.8,
        valueFormatter: (p: ValueFormatterParams) =>
          p.value ? new Date(p.value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      },
      {
        headerName: "Manager",
        field: "manager",
        minWidth: 140,
        flex: 1,
        valueFormatter: (p: ValueFormatterParams) => p.value || "—",
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      suppressMovable: false,
    }),
    []
  );

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  const onGridSizeChanged = useCallback((params: { api: GridApi }) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div className="ag-theme-alpine ag-theme-custom w-full h-[600px] rounded-xl border border-border overflow-hidden bg-card">
      <AgGridReact<Employee>
        ref={gridRef}
        rowData={employees}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onGridSizeChanged={onGridSizeChanged}
        animateRows
        rowSelection="multiple"
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50]}
        suppressCellFocus
        enableCellTextSelection
        domLayout="normal"
      />
    </div>
  );
};

export default EmployeeGrid;
