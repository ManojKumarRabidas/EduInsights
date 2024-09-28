import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');

function Update() {
  const [area_for, setAreaFor] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const getImproveData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/area-of-improvement-details/${id}`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setAreaFor(result.doc.area_for);
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
    getImproveData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateAreaOfImprovement = { area_for, name, active: active ? 1 : 0 };
    if ((updateAreaOfImprovement.name=="") || (updateAreaOfImprovement.area_for=="")){
      setError("Please enter all the required values.");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/area-of-improvement-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateAreaOfImprovement),
        headers: { "Content-Type": "application/json", 'authorization': `Bearer ${token}` },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setResponse(result.message);
          setError("");
          setName("");
          setAreaFor("");
          setActive(false);
          navigate("/areas-of-improvement/area-of-improvement-list");
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

      <form onSubmit={handleEdit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
        <div className="mb-3">
          <label className="form-label">Area For <span className="ei-col-red">*</span></label>
          <select className="form-select" aria-label="Default select example" name="area_for" value={area_for} onChange={(e) => setAreaFor(e.target.value)}>
              <option defaultValue>--Select area for--</option>
              <option value="TEACHER">TEACHER</option>
              <option value="STUDENT">STUDENT</option>
          </select> 
        </div>
        <div className="mb-3">
          <label className="form-label"> Name <span className="ei-col-red">*</span></label>
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
