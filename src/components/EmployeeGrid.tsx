import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  ValueFormatterParams,
  ICellRendererParams,
  GridReadyEvent,
  GridApi,
  IHeaderParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { RotateCcw, Mail, MapPin, Briefcase, DollarSign, Calendar, User, Star, FolderKanban, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
    <div className="flex items-center gap-1 min-w-0 w-full" style={{ maxWidth: "100%", overflow: "hidden" }}>
      {skills.slice(0, 2).map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium shrink max-w-[60px] truncate"
          title={skill}
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {skill}
        </span>
      ))}
      {skills.length > 2 && (
        <span className="text-[10px] text-muted-foreground font-medium shrink-0 whitespace-nowrap">+{skills.length - 2}</span>
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

const HeaderWithTooltip = (params: IHeaderParams) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (headerRef.current) {
        const element = headerRef.current;
        setIsTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkTruncation();
    const resizeObserver = new ResizeObserver(checkTruncation);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const displayName = params.displayName || params.colDef?.headerName || "";

  const headerText = (
    <div
      ref={headerRef}
      className="ag-header-cell-text truncate"
      style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
    >
      {displayName}
    </div>
  );

  if (isTruncated) {
    return (
      <div className="ag-header-cell-label" style={{ width: "100%" }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div style={{ width: "100%", cursor: "help" }}>
              {headerText}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{displayName}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="ag-header-cell-label" style={{ width: "100%" }}>
      {headerText}
    </div>
  );
};

const EmployeeGrid = () => {
  const gridRef = useRef<AgGridReact<Employee>>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              if (params.data) {
                setSelectedEmployee(params.data);
                setIsDialogOpen(true);
              }
            }}
          >
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
        minWidth: 120,
        flex: 0.8,
        cellRenderer: RatingRenderer,
      },
      {
        headerName: "Projects",
        field: "projectsCompleted",
        minWidth: 80,
        flex: 0.5,
        type: "numericColumn",
        cellStyle: { fontWeight: 600, fontFeatureSettings: "'tnum'" },
      },
      {
        headerName: "Skills",
        field: "skills",
        minWidth: 120,
        flex: 1,
        maxWidth: 150,
        cellRenderer: SkillsRenderer,
        sortable: false,
        filter: false,
        cellStyle: { overflow: "hidden", padding: "0 12px" },
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
      headerComponent: HeaderWithTooltip,
      cellStyle: { overflow: "hidden" },
    }),
    []
  );

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  const onGridSizeChanged = useCallback((params: { api: GridApi }) => {
    params.api.sizeColumnsToFit();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-2">
      {isFiltered && (
        <div className="flex items-center justify-end">
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-semibold transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filter
          </button>
        </div>
      )}
      <div className="ag-theme-alpine ag-theme-custom w-full h-[620px] rounded-xl border border-border overflow-hidden bg-card shadow-sm">
        <AgGridReact<Employee>
          ref={gridRef}
          rowData={employees}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onGridSizeChanged={onGridSizeChanged}
          onFilterChanged={onFilterChanged}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Employee Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="h-16 w-16 rounded-full bg-primary/8 flex items-center justify-center border-2 border-primary/15">
                  <span className="text-2xl font-bold text-primary">
                    {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.email}</p>
                </div>
                <div className="ml-auto">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      selectedEmployee.isActive
                        ? "bg-success/12 text-success"
                        : "bg-destructive/12 text-destructive"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${selectedEmployee.isActive ? "bg-success" : "bg-destructive"}`} />
                    {selectedEmployee.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Position</p>
                    <p className="text-sm font-semibold text-foreground">{selectedEmployee.position}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Department</p>
                    <p className="text-sm font-semibold text-foreground">{selectedEmployee.department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Location</p>
                    <p className="text-sm font-semibold text-foreground">{selectedEmployee.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Salary</p>
                    <p className="text-sm font-semibold text-foreground">
                      ${selectedEmployee.salary.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Hire Date</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDate(selectedEmployee.hireDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Age</p>
                    <p className="text-sm font-semibold text-foreground">{selectedEmployee.age} years</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Star className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Performance Rating</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedEmployee.performanceRating.toFixed(1)} / 5.0
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <FolderKanban className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Projects Completed</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedEmployee.projectsCompleted}
                    </p>
                  </div>
                </div>
              </div>

              {selectedEmployee.manager && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Manager</p>
                  <p className="text-sm font-semibold text-foreground">{selectedEmployee.manager}</p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeGrid;
