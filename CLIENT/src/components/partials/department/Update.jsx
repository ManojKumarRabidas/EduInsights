import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function Update() {
  const [dept_id, setDeptId] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const getDeptData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/dept-details/${id}`, {
        method: "GET",
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setDeptId(result.doc.dept_id);
          setName(result.doc.name);
          setActive(result.doc.active === 1);
        } else {
          setError(result.msg);
        }
      } else {
        setError("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      setError("We are unable to process now. Please try again later.");
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
    const updateDept = { dept_id, name, active: active ? 1 : 0 };

    try {
      const response = await fetch(`${HOST}:${PORT}/server/dept-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateDept),
        headers: { "Content-Type": "application/json" },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setResponse(result.message);
          setError("");
          setName("");
          setDeptId("");
          setActive(false);
          navigate("/departments/dept-list");
        } else {
          setError(result.msg);
        }
      } else {
        setError("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      setError("We are unable to process now. Please try again later.");
    }

    setTimeout(() => {
      setResponse("");
      setError("");
    }, 3000);
  };

  return (
    <div className="container my-2">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {response && (
        <div className="alert alert-success" role="alert">
          {response}
        </div>
      )}

      <form onSubmit={handleEdit}>
        <div className="mb-3">
          <label className="form-label">Department Id <span className="ei-col-red">*</span></label>
          <input name="dept_id" type="text" className="form-control" aria-describedby="emailHelp" value={dept_id} onChange={(e) => setDeptId(e.target.value)} />   
        </div>
        <div className="mb-3">
          <label className="form-label">Department Name <span className="ei-col-red">*</span></label>
          <input name="name" type="text" className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
          <label className="form-label">Active <span className="ei-col-red">*</span></label>
          <div>
            <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={active} onChange={(e) => setActive(e.target.checked)}/>
            <label className="form-check-label mx-3 " htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}

export default Update;
