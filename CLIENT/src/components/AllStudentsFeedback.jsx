import { useState, useEffect, useMemo } from "react" ;
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
import toastr from "toastr";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');

function Users () {
    const [data, setData] = useState([]);
    const [userType, setUserType] = useState("")
    const [searchFilter, setSearchFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [teacherFilter,setTeacherFilter] = useState("");
    const [studentFilter, setStudentFilter] = useState("");
    const [monthOfRatingFilter,setmonthOfRatingFilter] = useState("");
    const [subjectCodeFilter, setsubjectCodeFilter] = useState("");
    const [departments, setdepartments] = useState([]); 
    const [teachers ,setTeachers] = useState([]);
    const [students, setStudents] = useState([]); 
    const [monthOfRatings, setMonthOfRating] = useState([]); 
    const [subjectCodes, setSubjectCodes] = useState([]); 
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
          const response = await fetch(`${HOST}:${PORT}/server/students-feedback-list`, {
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
              const uniqueTeachers= new Set();
              const uniqueDepartments = new Set()
              const uniqueStudents = new Set()
              const uniqueMonthsOfRating = new Set()
              const uniqueSubjectCodes = new Set()
              result.docs.forEach((doc) => {
                if (doc.teacher) {
                  uniqueTeachers.add(doc.teacher);
                }
                if (doc.department) {
                  uniqueDepartments.add(doc.department);
                }
                if (doc.teacher) {
                  uniqueStudents.add(doc.student);
                }
                if (doc.month_of_rating) {
                  uniqueMonthsOfRating.add(doc.month_of_rating);
                }
                if (doc.subject) {
                  uniqueSubjectCodes.add(doc.subject);
                }
              });
              setTeachers(Array.from(uniqueTeachers));
              setdepartments(Array.from(uniqueDepartments));
              setStudents(Array.from(uniqueStudents));
              setMonthOfRating(Array.from(uniqueMonthsOfRating));
              setSubjectCodes(Array.from(uniqueSubjectCodes));
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
        ()=> {
            const baseColumns = [
            {
                header: "Month Of Rating",
                accessorKey: "month_of_rating",
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
              header: "Department",
              accessorKey: "department",
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
              header: "Student Reg Number",
              accessorKey: "student_reg_number",
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
                header: "Subject Code",
                accessorKey: "subject",
                sortingFn: "alphanumeric",
                enableSorting: true,
            },
            {
                header: "Clarity Of Explanation",
                accessorKey: "clarity_of_explanation",
                sortingFn: "alphanumeric",
                enableSorting: true,
            },
            {
                header: "Subject Knowledge",
                accessorKey: "subject_knowledge",
                sortingFn: "alphanumeric",
                enableSorting: true,
            },
            {
                header: "Encouragement Of Question",
                accessorKey: "encouragement_of_question",
                sortingFn: "alphanumeric",
                enableSorting: true,
            },
            {
                header: "Maintains Discipline",
                accessorKey: "maintains_discipline",
                sortingFn: "alphanumeric",
                enableSorting: true,
            },
            {
                header: "Fairness In Treatment",
                accessorKey: "fairness_in_treatment",
                sortingFn: "alphanumeric",
                enableSorting: true,
            },
            {
                header: "Approachability",
                accessorKey: "approachability",
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
                header: "Encouragement And Support",
                accessorKey: "encouragement_and_support",
                sortingFn: "alphanumeric",
                enableSorting: true,
            },
            {
                header: "Overall Teaching Quality",
                accessorKey: "overall_teaching_quality",
                sortingFn: "alphanumeric",
                enableSorting: true,
            }, 
            {
                header: "Provide Study Material",
                accessorKey: "provide_study_material",
                sortingFn: "alphanumeric",
                enableSorting: true,
            },
            {
                header: "Explain With Supportive Analogy",
                accessorKey: "explain_with_supportive_analogy",
                sortingFn: "alphanumeric",
                enableSorting: true,
            },
            {
                header: "Use Of Media",
                accessorKey: "use_of_media",
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
        if (userType != "TEACHER") {
            baseColumns.splice(6, 0, 
              {
                header: "Teacher Name",
                accessorKey: "teacher",
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

            const matchesTeacherFilter = teacherFilter ? row.teacher === teacherFilter : true;
            const matchesStudentFilter = studentFilter ? row.student === studentFilter: true;
            const matchesDepartmentFilter = departmentFilter ? row.department === departmentFilter: true;
            const matchesMonthOfRatingFilter = monthOfRatingFilter ? row.month_of_rating === monthOfRatingFilter: true;
            const matchesSubjectCodeFilter = subjectCodeFilter ? row.subject === subjectCodeFilter: true;
  
          return matchesSearchFilter && matchesTeacherFilter && matchesStudentFilter && matchesDepartmentFilter && matchesMonthOfRatingFilter && matchesSubjectCodeFilter;
        });
      }, [data, searchFilter, teacherFilter, studentFilter, departmentFilter, monthOfRatingFilter, subjectCodeFilter]);
    
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
        const approvedElements = ["clarity_of_explanation","subject_knowledge","encouragement_of_question","maintains_discipline","fairness_in_treatment","approachability","behaviour_and_attitude","encouragement_and_support","overall_teaching_quality","provide_study_material","explain_with_supportive_analogy","use_of_media"]
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

            {(userType !='TEACHER') && (<div className="col">
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
            </div>)}
            <div className="col">
              <div>
                <select className="form-select" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                  <option value="">-- Filter by "Department" --</option>
                    {departments.map((val) => (
                      <option value={val}>{val}</option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col date-field-col">
              <DatePicker selectsRange startDate={dateRange[0]} endDate={dateRange[1]} onChange={(update) => setDateRange(update)} dateFormat="dd/MM/yyyy" className="form-control form-select"/>
            </div>
          </div>
          <div className="row my-3">
            <div className="col">
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
            </div>
            <div className="col">
              <div>
                <select
                  className="form-select"
                  value={monthOfRatingFilter}
                  onChange={(e) => setmonthOfRatingFilter(e.target.value)}
                >
                  <option value="">-- Filter by "Month of Ratting" --</option>
                    {monthOfRatings.map((val) => (
                      <option value={val}>{val}</option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col">
              <div>
                <select
                  className="form-select"
                  value={subjectCodeFilter}
                  onChange={(e) => setsubjectCodeFilter(e.target.value)}
                >
                  <option value="">-- Filter by "Subject Code" --</option>
                    {subjectCodes.map((val) => (
                      <option value={val}>{val}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className="scroll-hidden">
            <table className="table table-striped shadow-sm p-3 mb-5 bg-body-tertiary rounded" style={{ fontSize: "smaller" }}>
              <thead style={{textWrap: "nowrap"}}>
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
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="text-center">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={cell.column.columnDef.cellClassName}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan="22" className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>        
    
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

