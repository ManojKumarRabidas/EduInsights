import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Read() {
  const [data, setData] = useState();
  const [error, setError] = useState("");

  async function getData() {
    const response = await fetch(`${HOST}:${PORT}/user/userlist`, {
      method: "GET",
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error);
    }
    if (response.ok) {
      console.log(result, "result");
      setData(result.data);
      setError("");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(
      `${HOST}:${PORT}/user/deleteuser/${id}`,
      {
        method: "DELETE",
      }
    );
    const result = await response.json();

    if (!response.ok) {
      setError(result.error);
    }
    if (response.ok) {
      setError("Delete Successfully");

      setTimeout(() => {
        setError("");
        getData();
      }, 2000);
    }
  };


  return (
    <div className="container my-2">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <h2 className="text-center">User List</h2>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Age</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((data) => (
            <tr key={data._id}>
              <th scope="row">1</th>
              <td>{data?.name}</td>
              <td>{data?.email}</td>
              <td>{data?.age}</td>
              <td>
                <Link to={`/update/${data?._id}`} className="card-link m-2">
                  Edit
                </Link>
                <a
                  href=""
                  className="card-link m-2"
                  onClick={() => handleDelete(data?._id)}
                >
                  Delete
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Read;
