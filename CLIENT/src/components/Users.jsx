import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import toastr from 'toastr';

const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');

function Users() {
  const [data, setData] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState(""); 
  const [departments, setDepartments] = useState([]); 
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);

  async function getData() {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/user-list`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });

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
      } else {
        toastr.error(result.msg);
      }
    } catch (err) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleActiveChange = async (id, isActive) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/user-update-active/${id}`, {
        method: "PUT",
        body: JSON.stringify({ active: isActive ? "1" : "0" }),
        headers: { 
          "Content-Type": "application/json",
          'authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();
      if (response.ok) {
        toastr.success("User status updated successfully");
        getData();
      } else {
        toastr.error(result.error);
      }
    } catch (err) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "User Type",
        accessorKey: "user_type",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Email Id",
        accessorKey: "email",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Address",
        accessorKey: "address",
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
        header: "Reg Year",
        accessorKey: "registration_year",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Reg Number",
        accessorKey: "registration_number",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Verification",
        accessorKey: "is_verified",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Active",
        accessorKey: "active",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="form-switch">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              id={`activeSwitch-${row.id}`}
              checked={row.original.active == 1}
              onChange={(e) =>
                handleActiveChange(row.original._id, e.target.checked)
              }
            />
          </div>
        ),
      },
    ],
    [pageIndex, pageSize]
  );

  // Apply all filters together using useMemo
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearchFilter = searchFilter
        ? Object.values(row).some((value) =>
            value?.toString().toLowerCase().includes(searchFilter.toLowerCase())
          )
        : true;

      const matchesUserTypeFilter = userTypeFilter
        ? row.user_type === userTypeFilter
        : true;

      const matchesVerificationFilter = verificationFilter
        ? row.is_verified === verificationFilter
        : true;

      const matchesDepartmentFilter = departmentFilter
        ? row.department === departmentFilter
        : true;

      return matchesSearchFilter && matchesUserTypeFilter && matchesVerificationFilter && matchesDepartmentFilter;
    });
  }, [data, searchFilter, userTypeFilter, verificationFilter, departmentFilter]);

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
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
            >
              <option value="">-- Filter by "User Type" --</option>
              <option value="TEACHER">TEACHER</option>
              <option value="STUDENT">STUDENT</option>
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
        <select className="form-select mx-2" style={{maxWidth: "fit-content"}} value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>Show {size}</option>
          ))}
        </select>
        <span className="text-nowrap mx-2 text-center">
          Page{" "}<strong>{pageIndex + 1} of {table.getPageCount()}</strong>
        </span>
        <div className="btn-group mx-2">
          <button className="btn btn-secondary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
          <button className="btn btn-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Users;
