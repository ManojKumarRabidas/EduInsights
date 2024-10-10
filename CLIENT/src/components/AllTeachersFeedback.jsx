import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subMonths } from "date-fns";
import toastr from 'toastr';
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');

function Users() {
  const [data, setData] = useState([]);
  const [userType, setUserType] = useState("")
  const [searchFilter, setSearchFilter] = useState("");
  const [semesterOfRatingFilter, setSemesterOfRatingFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [teachers, setTeachers] = useState([]); 
  const [studentFilter, setStudentFilter] = useState("");
  const [students, setStudents] = useState([]); 
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);
  const [dateRange, setDateRange] = useState([subMonths(new Date(), 6), new Date()]);


  async function getData(startDate, endDate) {
    try {
      if (!startDate || !endDate){
        toastr.warning("Both start date and end date must be entered");
        return;
      }
      const response = await fetch(`${HOST}:${PORT}/server/teachers-feedback-list`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          'authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ startDate, endDate })
      });

      if (response) { 
        const result = await response.json();
        if (response.ok) {
          toastr.info("Data retrieved for the mentioned date range.");
          setData(result.docs);
          const uniqueTeachers = new Set();
          result.docs.forEach((doc) => {
          if (doc.teacher) {
            uniqueTeachers.add(doc.teacher);
          }
      });
      setTeachers(Array.from(uniqueTeachers));
        } else {
          toastr.error(result.msg);
        }

        if (response.ok) {
          toastr.info("Data retrieved for the mentioned date range.");
          setData(result.docs);
          const uniqueStudents = new Set();
          result.docs.forEach((doc) => {
          if (doc.student) {
            uniqueStudents.add(doc.student);
          }
      });
      setStudents(Array.from(uniqueStudents));
        } else {
          toastr.error(result.msg);
        }

      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (err) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  }

  const getUserType = async (token) => {
    const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        setUserType(result.doc.user_type);
      } else{
        toastr.error(result.msg);
      }
    } else{
      toastr.error("We are unable to process now. Please try again later.")
    }
  }
  useEffect(() => {
    getData(dateRange[0], dateRange[1]);
    getUserType(token)
  }, [dateRange]);


  const columns = useMemo(
    () => { 
      const baseColumns = [
      {
        header: "Semester",
        accessorKey: "semester_of_rating",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Date",
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
        header: "Strengths",
        accessorKey: "strengths",
        sortingFn: "alphanumeric",
        enableSorting: true,
        headerClassName: "max-min-300",
        cellClassName: "scroll-hidden max-min-300 text-nowrap"
      },
      {
        header: "Areas Of Improvement",
        accessorKey: "areas_of_improvement",
        sortingFn: "alphanumeric",
        enableSorting: true,
        headerClassName: "max-min-300",
        cellClassName: "scroll-hidden max-min-300 text-nowrap"
      },
      {
        header: "Additional Comments",
        accessorKey: "additional_comments",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
    ];

    if (userType === "ADMIN") {
      baseColumns.splice(3, 0, 
        {
          header: "Student Name",
          accessorKey: "student",
          sortingFn: "alphanumeric",
          enableSorting: true,
        },
        {
          header: "Student Reg Year",
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
      );
    }

    return baseColumns;
  },
  [userType, pageIndex, pageSize]
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

      const matchesTeacherFilter = teacherFilter
        ? row.teacher === teacherFilter
        : true;

        const matchesStudentFilter = studentFilter
        ? row.student === studentFilter
        : true;  

      return matchesSearchFilter && matchesSemesterOfRatingFilter && matchesTeacherFilter && matchesStudentFilter;
    });
  }, [data, searchFilter, semesterOfRatingFilter, teacherFilter, studentFilter]);

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

const calculateVisibleAverages = (rows, columns) => {
  const averages = {};
  const approvedElements = ["class_participation", "homework_or_assignments","quality_of_work","timeliness", "problem_solving_skills", "behaviour_and_attitude" ,"responsibility", "participation_and_engagement" ,"group_work" ,"overall_student_quality"]
  columns.forEach((column) => {
    if (approvedElements.indexOf(column.id) !== -1) {
        const total = rows.reduce((sum, row) => {
        const cellValue = row.getValue(column.id);
        return sum + (parseFloat(cellValue) || 0);
      }, 0);
      averages[column.id] = (total / rows.length).toFixed(2);
    } else {
      averages[column.id] = "--";
    }
  });
  return averages;
};

const visibleRows = table.getRowModel().rows;
const averages = calculateVisibleAverages(visibleRows, table.getVisibleFlatColumns());

  return (
    <div className="container my-2">
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
              <option value="">-- Filter by "Semester" --</option>
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
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
            >
              <option value="">-- Filter by "Teacher" --</option>
                {teachers.map((val) => (
                  <option value={val}>{val}</option>
                ))}
            </select>
          </div>
        </div>
        {(userType !='STUDENT') && (<div className="col">
          <div>
            <select
              className="form-select"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
            >
              <option value="">-- Filter by "Student" --</option>
                {students.map((val) => (
                  <option value={val}>{val}</option>
                ))}
            </select>
          </div>
        </div>)}
        <div className="col date-field-col">
          <DatePicker selectsRange startDate={dateRange[0]} endDate={dateRange[1]} onChange={(update) => setDateRange(update)} dateFormat="dd/MM/yyyy" className="form-control form-select"/>
        </div>
      </div>

      <div className="scroll-hidden">
        <table className="table table-striped shadow-sm p-3 mb-5 bg-body-tertiary rounded" style={{ fontSize: "smaller" }}>
          <thead style={{ textWrap: "nowrap" }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <>
                <tr key={headerGroup.id} className="text-center">
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

                {visibleRows.length > 0 && (
                <tr style={{ backgroundColor: "#f2f4f5" }} className="text-center">
                  {table.getVisibleFlatColumns().map((column, colIndex) => (
                    <td key={colIndex} className={column.cellClassName}>
                      {colIndex === 0 ? (
                        <strong>Averages</strong>
                      ) : (
                        averages.hasOwnProperty(column.id) ? averages[column.id] : ''
                      )}
                    </td>
                  ))}
                </tr>
                )}
              </>
            ))}
          </thead>
          <tbody>
          {visibleRows.map((row) => (
            <tr key={row.id} className="text-center">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={cell.column.columnDef.cellClassName}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {visibleRows.length === 0 && (
            <tr><td colSpan="20" className="text-center"> No data available</td></tr>
          )}
        </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <select className="form-select mx-2" style={{maxWidth: "fit-content"}} value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
          {[10, 20, 30, 40, 50].map((size) => (<option key={size} value={size}>Show {size}</option>))}
        </select>
        <span className="text-nowrap mx-2 text-center">Page{" "}<strong>{pageIndex + 1} of {table.getPageCount()}</strong></span>
        <div className="btn-group mx-2">
          <button className="btn btn-secondary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
          <button className="btn btn-secondary" onClick={() => table.nextPage()}disabled={!table.getCanNextPage()}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Users;

