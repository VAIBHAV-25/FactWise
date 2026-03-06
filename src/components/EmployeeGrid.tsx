import { useMemo, useCallback, useRef, useState } from "react";
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
        active
          ? "bg-success/12 text-success"
          : "bg-destructive/12 text-destructive"
      }`}
    >
      <span className={`h-[5px] w-[5px] rounded-full ${active ? "bg-success" : "bg-destructive"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
};

const RatingRenderer = (params: ICellRendererParams<Employee>) => {
  const rating = params.value as number;
  const percentage = (rating / 5) * 100;
  const color =
    rating >= 4.5
      ? "hsl(var(--success))"
      : rating >= 4.0
      ? "hsl(var(--primary))"
      : "hsl(var(--warning))";
  return (
    <div className="flex items-center gap-2.5 w-full">
      <div className="flex-1 h-[6px] rounded-full bg-muted/80 overflow-hidden max-w-[80px]">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
};

const SkillsRenderer = (params: ICellRendererParams<Employee>) => {
  const skills = params.value as string[];
  return (
    <div className="flex items-center gap-1.5">
      {skills.slice(0, 2).map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium"
        >
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
  const styles: Record<string, string> = {
    Engineering: "bg-info/10 text-info",
    Marketing: "bg-[hsl(280_55%_55%/0.1)] text-[hsl(280_55%_55%)]",
    Sales: "bg-success/10 text-success",
    HR: "bg-warning/10 text-warning",
    Finance: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide ${styles[dept] || "bg-muted text-muted-foreground"}`}>
      {dept}
    </span>
  );
};

const EmployeeGrid = () => {
  const gridRef = useRef<AgGridReact<Employee>>(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const onFilterChanged = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    const model = api.getFilterModel();
    setIsFiltered(Object.keys(model).length > 0);
  }, []);

  const clearAllFilters = useCallback(() => {
    gridRef.current?.api?.setFilterModel(null);
    setIsFiltered(false);
  }, []);

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      {
        headerName: "Employee",
        field: "firstName",
        minWidth: 220,
        flex: 2,
        valueGetter: (p) => `${p.data?.firstName} ${p.data?.lastName}`,
        cellRenderer: (params: ICellRendererParams<Employee>) => (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/8 flex items-center justify-center shrink-0 border border-primary/15">
              <span className="text-xs font-bold text-primary">
                {params.data?.firstName?.[0]}{params.data?.lastName?.[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground leading-tight truncate">{params.value}</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">{params.data?.email}</p>
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
        minWidth: 170,
        flex: 1.3,
        cellStyle: { color: "hsl(220 25% 18%)", fontWeight: 500 },
      },
      {
        headerName: "Location",
        field: "location",
        minWidth: 110,
        flex: 0.8,
      },
      {
        headerName: "Salary",
        field: "salary",
        minWidth: 110,
        flex: 0.8,
        type: "numericColumn",
        cellStyle: { fontWeight: 600, fontFeatureSettings: "'tnum'" },
        valueFormatter: (p: ValueFormatterParams) =>
          p.value != null ? `$${p.value.toLocaleString()}` : "",
      },
      {
        headerName: "Rating",
        field: "performanceRating",
        minWidth: 150,
        flex: 1,
        cellRenderer: RatingRenderer,
      },
      {
        headerName: "Projects",
        field: "projectsCompleted",
        minWidth: 95,
        flex: 0.6,
        type: "numericColumn",
        cellStyle: { fontWeight: 600, fontFeatureSettings: "'tnum'" },
      },
      {
        headerName: "Skills",
        field: "skills",
        minWidth: 200,
        flex: 1.5,
        cellRenderer: SkillsRenderer,
        sortable: false,
        filter: false,
      },
      {
        headerName: "Status",
        field: "isActive",
        minWidth: 105,
        flex: 0.7,
        cellRenderer: StatusRenderer,
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
    <div className="ag-theme-alpine ag-theme-custom w-full h-[620px] rounded-xl border border-border overflow-hidden bg-card shadow-sm">
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
