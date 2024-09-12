import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function Users() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [sorting, setSorting] = useState([]);

  async function getData() {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/user-list`, {
        method: "GET",
      });

      const result = await response.json();
      if (response.ok) {
        setData(result.docs);
        setError("");
      } else {
        setError(result.msg);
      }
    } catch (err) {
      setError("We are unable to process now. Please try again later.");
    }
  }

  useEffect(() => {
    getData();
  }, []);


  const handleActiveChange = async (id, isActive) => {
    console.log(id, isActive);
    
    try {
      const response = await fetch(`${HOST}:${PORT}/server/user-update-active/${id}`, {
        method: "PUT",
        body: JSON.stringify({ active: isActive ? "1" : "0" }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      console.log(result);
      
      if (response.ok) {
        setResponse("User status updated successfully");
        getData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("We are unable to process now. Please try again later.");
    }
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 5000);
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
    [ pageIndex, pageSize]
  );

  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((row) => {
      const lowercasedFilter = globalFilter.toLowerCase();
      return (
        (row.user_type && row.user_type.toLowerCase().includes(lowercasedFilter)) ||
        (row.name && row.name.toLowerCase().includes(lowercasedFilter)) ||
        (row.email && row.email.toLowerCase().includes(lowercasedFilter)) ||
        (row.phone && row.phone.toString().toLowerCase().includes(lowercasedFilter)) ||
        (row.address && row.address.toLowerCase().includes(lowercasedFilter)) ||
        (row.department && row.department.toLowerCase().includes(lowercasedFilter)) ||
        (row.registration_year && row.registration_year.toString().toLowerCase().includes(lowercasedFilter)) ||
        (row.registration_number && row.registration_number.toString().toLowerCase().includes(lowercasedFilter)) ||
        (row.is_verified && row.is_verified.toLowerCase().includes(lowercasedFilter))
      );
    });
  }, [data, globalFilter]);

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
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
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

      <input
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="form-control mb-3"
      />

      <table className="table table-striped shadow-sm p-3 mb-5 bg-body-tertiary rounded" style={{ fontSize: "smaller" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={header.column.columnDef.headerClassName}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
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

      <div className="d-flex justify-content-between my-3">
        <button
          className="btn btn-primary"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          className="btn btn-primary"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Users;
