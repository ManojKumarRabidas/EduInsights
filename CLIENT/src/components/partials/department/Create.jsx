import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Create() {
  const [dept_id, setDeptId] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const deptData = { name, dept_id, active };
    if ((deptData.name=="") || (deptData.dept_id=="") || (deptData.active=="")){
      setError("Please enter all the required values.");
      return;
    }
    const response = await fetch(`${HOST}:${PORT}/server/dept-create`, {
      method: "POST",
      body: JSON.stringify(deptData),
      headers: {"Content-Type": "application/json"},
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        setResponse(result.msg);
        setError("");
        setDeptId("");
        setName("");
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
    <div className="container my-5 py-5">
      {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Department Id</label>
          <input name="dept_id" type="text" className="form-control" aria-describedby="emailHelp" value={dept_id} onChange={(e) => setDeptId(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Department Name</label>
          <input name="name" type="text" className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Active</label>
          <input name="active" type="number" className="form-control" value={active} onChange={(e) => setActive(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
export default Create;
