// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// const HOST = import.meta.env.VITE_HOST
// const PORT = import.meta.env.VITE_PORT

// function List() {
//   const [data, setData] = useState();
//   const [error, setError] = useState("");
//   const [response, setResponse] = useState("");

//   async function getData() {
//     const response = await fetch(`${HOST}:${PORT}/server/dept-list`, {
//       method: "GET",
//     });

//     if (response){
//       const result = await response.json();
//       if (response.ok){
//         setData(result.docs);
//         setError("");
//       } else{
//         setError(result.error);
//       }
//     } else{
//       setError("We are unable to process now. Please try again later.")
//     }
//   }

//   useEffect(() => {
//     getData();
//   }, []);

//   const handleDelete = async (id) => {
//     const response = await fetch(
//       `${HOST}:${PORT}/server/dept-delete/${id}`,
//       {method: "DELETE"}
//     );

//     if (response){
//       const result = await response.json();
//       if (response.ok){
//         setResponse("Department deleted successfully");
//         setTimeout(() => {
//           getData();
//         }, 2000);
//       } else{
//         setError(result.error);
//       }
//     } else{
//       setError("We are unable to process now. Please try again later.")
//     }
//     setTimeout(() => {
//       setResponse("");
//       setError("");
//     }, 9000);
//   };


//   return (
//     <div className="container my-2">
//       {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
//       {response && (<div className="alert alert-success" role="alert">{response}</div>)}

//       <table className="table">
//         <thead>
//           <tr>
//             <th scope="col">Sl No</th>
//             <th scope="col">Department Id</th>
//             <th scope="col">Department Name</th>
//             <th scope="col">Active</th>
//             <th scope="col" style={{ textAlign: 'center' }}>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//         {data && data.length > 0 ? (
//           data?.map((item, index) => (
//             <tr key={item._id}>
//               <td>{index+1}</td>
//               <td>{item?.dept_id}</td>
//               <td>{item?.name}</td>
//               <td>{item?.active}</td>
//               <td style={{ textAlign: 'center' }}>
//                 <button type="button" class="btn btn-outline-light m-1"><Link to={`/departments/dept-update/${item?._id}`} className="card-link m-2">Edit</Link></button>
//                 <button type="button" class="btn btn-outline-light m-1"><a href="" className="card-link m-2" onClick={() => handleDelete(item?._id)}>Delete</a></button>
//                 {/* <Link to={`/departments/dept-update/${item?._id}`} className="card-link m-2">Edit</Link>
//                 <a href="" className="card-link m-2" onClick={() => handleDelete(item?._id)}>Delete</a> */}
//               </td>
//             </tr>
//           ))):(
//             <tr><td colSpan="5" className="text-center">No data available</td></tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
// export default List;


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

  async function getData() {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/dept-list`, {
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
      const response = await fetch(`${HOST}:${PORT}/server/dept-delete/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (response.ok) {
        setResponse("Department deleted successfully");
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
        accessorFn: (row, i) => i + 1,
        id: "slNo",
      },
      { header: "Department Id", accessorKey: "dept_id" },
      { header: "Department Name", accessorKey: "name" },
      { header: "Active", accessorKey: "active" },
      {
        header: "Action",
        id: "action",
        className: "ei-text-center-imp",
        cell: ({ row }) => (
          <div style={{ textAlign: "center" }}>
            <button type="button" className="btn btn-outline-light m-1"><Link to={`/departments/dept-update/${row.original._id}`} className="card-link m-2">Edit</Link></button>
            <button type="button" className="btn btn-outline-light m-1" onClick={() => handleDelete(row.original._id)}><a href="#" style={{ textColor: "blue" }}>Delete</a></button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
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
    </div>
  );
}

export default List;


