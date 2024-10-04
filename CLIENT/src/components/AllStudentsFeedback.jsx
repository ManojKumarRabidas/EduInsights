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
    const [semesterOfRatingFilter, setSemesterOfRatingFilter] = useState("");
    const [studentFilter, setStudentFilter] = useState("");
    const [student_name, setStudentName] = useState([]); 
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
              const uniqueStudents= new Set();
              result.docs.forEach((doc) => {
              if (doc.student) {
                uniqueStudents.add(doc.student);
              }
          });
          setStudentName(Array.from(uniqueStudents));
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
    
      // const getUserType = async (token) => {
      //   const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
      //     method: 'GET',
      //     headers: { Authorization: `Bearer1 ${token}` },
      //   });
      //   console.log("response",response)
      //   if (response){
      //     const result = await response.json();
      //     console.log(result)
      //     if (response.ok){
      //       setUserType(result.doc.user_type);
      //     } else{
      //       toastr.error(result.msg);
      //     }
      //   } else{
      //     toastr.error("We are unable to process now. Please try again later.")
      //   }
      // }



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
                header: "Teacher Code",
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
                header: "Student Name",
                accessorKey: "student",
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
        if (userType === "ADMIN") {
            baseColumns.splice(3, 0, // Insert after the third column
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
    
          const matchesStudentFilter = studentFilter
            ? row.student === studentFilter
            : true;
    
          return matchesSearchFilter && matchesSemesterOfRatingFilter && matchesStudentFilter;
        });
      }, [data, searchFilter, semesterOfRatingFilter, studentFilter]);
    
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
                  value={studentFilter}
                  onChange={(e) => setStudentFilter(e.target.value)}
                >
                  <option value="">-- Filter by "Student" --</option>
                    {student_name.map((val) => (
                      <option value={val}>{val}</option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col">
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update)}
              dateFormat="yyyy/MM/dd"
              className="form-control form-select"
            />
            </div>
          </div>
          <div className="scroll-hidden">
            <table className="table table-striped shadow-sm p-3 mb-5 bg-body-tertiary rounded" style={{ fontSize: "smaller" }}>
              <thead style={{textWrap: "nowrap"}}>
                {table.getHeaderGroups().map((headerGroup) => (
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
                    <td colSpan="20" className="text-center">
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

