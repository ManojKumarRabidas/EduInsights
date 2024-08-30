import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Update() {
  const [dept_id, setDeptId] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [deptData, setDeptData] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  
  const getDeptData = async () => {
    const response = await fetch(
      `${HOST}:${PORT}/server/dept-details/${id}`,
      {method: "GET",}
    );
    if (response){
      const result = await response.json();
      if (response.ok){
        setDeptData(result.doc);
        setDeptId(result.doc.dept_id); 
        setName(result.doc.name);
        setActive(result.doc.active);
      } else{
        setError(result.msg);
      }
    } else{
      setError("We are unable to process now. Please try again later.")
    }
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 3000);
  };

  useEffect(() => {
    getDeptData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateDept = { dept_id, name, active };
    const response = await fetch(
      `${HOST}:${PORT}/server/dept-update/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateDept),
        headers: {"Content-Type": "application/json"},
      }
    );

    if (response){
      const result = await response.json();
      if (response.ok){
        setResponse(result.message);
        setError("");
        setName("");
        setDeptId("");
        setActive("");
        navigate("/departments/dept-list");
      } else{
        setError(result.msg);
      }
    } else{
      setError("We are unable to process now. Please try again later.")
    }
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 3000);
  };

  return (
    <div className="container my-2">
      {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}

      <form onSubmit={handleEdit}>
        <div className="mb-3">
          <label className="form-label">Department Id</label>
          <input name="dept_id" type="text" className="form-control" aria-describedby="emailHelp" defaultValue={deptData?.dept_id} onChange={(e) => setDeptId(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Department Name</label>
          <input name="name" type="text" className="form-control" aria-describedby="emailHelp" defaultValue={deptData?.name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Active</label>
          <input name="active" type="number" className="form-control" defaultValue={deptData?.active} onChange={(e) => setActive(e.target.value)}/>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
export default Update;