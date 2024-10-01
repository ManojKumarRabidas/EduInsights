
import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');

function Users() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [semesterOfRatingFilter, setSemesterOfRatingFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState(""); 
  const [departments, setDepartments] = useState([]); 
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);

  async function getData() {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/teachers-feedback-list`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          'authorization': `Bearer ${token}` 
        },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setData(result.docs);
          const uniqueDepartments = new Set();
          result.docs.forEach((doc) => {
          if (doc.department) {
            uniqueDepartments.add(doc.department);
          }
      });
      setDepartments(Array.from(uniqueDepartments));
        setError("");
        } else {
          setError(result.msg);
        }
      } else {
        setError("We are unable to process now. Please try again later.");
      }
    } catch (err) {
      console.log(err);
      setError("We are unable to process now. Please try again later.");
    }
  }

  useEffect(() => {
    getData();
  }, []);


  const columns = useMemo(
    () => [
      {
        header: "Semester Of Rating",
        accessorKey: "semester_of_rating",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Date Of Rating",
        accessorKey: "date_of_rating",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Teacher Name",
        accessorKey: "teacher",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Student Name",
        accessorKey: "student",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Student Registration No",
        accessorKey: "student_reg_year",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Department",
        accessorKey: "department",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Subject Code",
        accessorKey: "subject",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Class Participation",
        accessorKey: "class_participation",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Homework Or Assignments",
        accessorKey: "homework_or_assignments",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Quality Of Work",
        accessorKey: "quality_of_work",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Timeliness",
        accessorKey: "timeliness",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Probelm Solving Skills",
        accessorKey: "problem_solving_skills",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Behaviour And Attitude",
        accessorKey: "behaviour_and_attitude",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Responsibility",
        accessorKey: "responsibility",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Participation And Engagement",
        accessorKey: "participation_and_engagement",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Group Work",
        accessorKey: "group_work",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Overall Student Quality",
        accessorKey: "overall_student_quality",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Strength Names",
        accessorKey: "strength_names",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Area Of Improvement",
        accessorKey: "area_of_improvement_names",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Additional Comments",
        accessorKey: "additional_comments",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
    ],
    [pageIndex, pageSize]
  );

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearchFilter = searchFilter
        ? Object.values(row).some((value) =>
            value?.toString().toLowerCase().includes(searchFilter.toLowerCase())
          )
        : true;

      const matchesSemesterOfRatingFilter = semesterOfRatingFilter
        ? row.semester_of_rating === semesterOfRatingFilter
        : true;

      const matchesVerificationFilter = verificationFilter
        ? row.is_verified === verificationFilter
        : true;

      const matchesDepartmentFilter = departmentFilter
        ? row.department === departmentFilter
        : true;

      return matchesSearchFilter && matchesSemesterOfRatingFilter && matchesVerificationFilter && matchesDepartmentFilter;
    });
  }, [data, searchFilter, semesterOfRatingFilter, verificationFilter, departmentFilter]);

  const sortedData = useMemo(() => {
    if (!sorting.length) return filteredData;
    const [{ id, desc }] = sorting;
    return [...filteredData].sort((a, b) => {
      const aValue = a[id];
      const bValue = b[id];
      if (aValue === bValue) return 0;
      if (desc) {
        return aValue > bValue ? -1 : 1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
  }, [filteredData, sorting]);

  const paginatedData = useMemo(() => {
    const startRow = pageIndex * pageSize;
    const endRow = startRow + pageSize;
    return sortedData.slice(startRow, endRow);
  }, [sortedData, pageIndex, pageSize]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    pageCount: Math.ceil(filteredData.length / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <div className="container my-2">
      {error && <div className="alert alert-danger">{error}</div>}
      {response && <div className="alert alert-success">{response}</div>}

      <div className="row my-3">
        <div className="col">
          <input
            value={searchFilter || ""}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by any value of table"
            className="form-control"
          />
        </div>
        <div className="col">
          <div>
            <select
              className="form-select"
              value={semesterOfRatingFilter}
              onChange={(e) => setSemesterOfRatingFilter(e.target.value)}
            >
              <option value="">-- Filter by "Semester Of Rating" --</option>
              <option value="1st">1st sem</option>
                <option value="2nd">2nd sem</option>
                <option value="3rd">3rd sem</option>
                <option value="4th">4th sem</option>
                <option value="5th">5th sem</option>
                <option value="6th">6th sem</option>
                <option value="7th">7th sem</option>
                <option value="8th">8th sem</option>
            </select>
          </div>
        </div>
        <div className="col">
          <div>
            <select
              className="form-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">-- Filter by "Department" --</option>
                {departments.map((dept) => (
                  <option value={dept}>{dept}</option>
                ))}
            </select>
          </div>
        </div>
        <div className="col">
          <div>
            <select
              className="form-select"
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
            >
              <option value="">-- Filter by "Verification Status" --</option>
              <option value="Verified">Verified</option>
              <option value="Not Verified">Not Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <table
        className="table table-striped shadow-sm p-3 mb-5 bg-body-tertiary rounded"
        style={{ fontSize: "smaller" }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={header.column.columnDef.headerClassName}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mb-3">
        <select
          className="form-select mx-2"
          style={{maxWidth: "fit-content"}}
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
        <span className="text-nowrap mx-2 text-center">
          Page{" "}
          <strong>
            {pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <div className="btn-group mx-2">
          <button
            className="btn btn-secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Users;

