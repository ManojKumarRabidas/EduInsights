import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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

function List() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [sorting, setSorting] = useState([]); // State to manage sorting

  async function getData() {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/pending-verification-user-list`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (response.ok) {
        setData(result.docs);
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

  const handleVerification = async (id, status) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/user-update-verificaton/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_verified: status }),
        headers: { 
          "Content-Type": "application/json",
          'authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();
      if (response.ok) {
        toastr.success("User verification status updated successfully");
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
        header: "Action",
        id: "action",
        enableSorting: false,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => (
          <div style={{ textAlign: "center"}}>
            <button
              type="button"
              className="btn small-btn btn-outline-light"
              onClick={() => handleVerification(row.original._id, "1")}
            >Accept </button>
            <button
              type="button"
              className="btn small-btn btn-outline-light"
              onClick={() => handleVerification(row.original._id, "-1")}
            > Reject</button>
          </div>
        ),
      },
    ],
    [handleVerification, pageIndex, pageSize] // Include pageIndex and pageSize as dependencies
  );

  // Apply global filtering before pagination
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((row) => {
      const lowercasedFilter = globalFilter.toLowerCase();
      return (
        row.user_type.toString().toLowerCase().includes(lowercasedFilter) ||
        row.name.toLowerCase().includes(lowercasedFilter) ||
        row.email.toLowerCase().includes(lowercasedFilter) ||
        row.phone.toString().toLowerCase().includes(lowercasedFilter) ||
        row.address.toLowerCase().includes(lowercasedFilter) ||
        row.department.toLowerCase().includes(lowercasedFilter) ||
        row.registration_year.toString().toLowerCase().includes(lowercasedFilter) ||
        row.registration_number.toString().toLowerCase().includes(lowercasedFilter)
      );
    });
  }, [data, globalFilter]);

  // Apply sorting before pagination
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

  // Apply pagination after sorting
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
      <input
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="form-control my-3"
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
              <td colSpan="9" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
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

export default List;
