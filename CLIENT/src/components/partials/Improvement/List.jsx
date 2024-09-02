import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function List() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [sorting, setSorting] = useState([]); // State to manage sorting

  async function getData() {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/improve-list`, {
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/improve-delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        setResponse("Area of improvement deleted successfully");
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
    }, 3000);
  };

  const handleActiveChange = async (id, isActive) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/improve-update-active/${id}`, {
        method: "PUT",
        body: JSON.stringify({ active: isActive ? "1" : "0" }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (response.ok) {
        setResponse("Area of improvement status updated successfully");
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

  // Define table columns with proper accessorKeys
  const columns = useMemo(
    () => [
      {
        header: "Sl No",
        accessorFn: (row, i) => i + 1 + pageIndex * pageSize,
        id: "slNo",
        enableSorting: false,
      },
      {
        header: "Improvement Area",
        accessorKey: "area",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Improvement Name",
        accessorKey: "name",
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
              checked={row.original.active === 1}
              onChange={(e) =>
                handleActiveChange(row.original._id, e.target.checked)
              }
            />
          </div>
        ),
      },
      {
        header: "Action",
        id: "action",
        enableSorting: false,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => (
          <div style={{ textAlign: "center" }}>
            <button type="button" className="btn btn-outline-light m-1" style={{ backgroundColor: "ghostwhite" }}>
              <Link
                to={`/improvements/improve-update/${row.original._id}`}
                className="card-link m-2"
              >
                Edit
              </Link>
            </button>
            <button
              type="button"
              className="btn btn-outline-light m-1"
              style={{ color: "blue", backgroundColor: "ghostwhite" }}
              onClick={() => handleDelete(row.original._id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, pageIndex, pageSize] // Include pageIndex and pageSize as dependencies
  );

  // Apply global filtering before pagination
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((row) => {
      const lowercasedFilter = globalFilter.toLowerCase();
      return (
        row.area.toString().toLowerCase().includes(lowercasedFilter) ||
        row.name.toLowerCase().includes(lowercasedFilter)
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
      {error && <div className="alert alert-danger">{error}</div>}
      {response && <div className="alert alert-success">{response}</div>}

      <input
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="form-control mb-3"
      />

      <table className="table table-striped">
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
              <td colSpan="5" className="text-center">
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