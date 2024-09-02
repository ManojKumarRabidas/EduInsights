import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function Update() {
  const [area, setArea] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const getImproveData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/improve-details/${id}`, {
        method: "GET",
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setArea(result.doc.area);
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
    const updateImprove = { area, name, active: active ? 1 : 0 };
    if ((updateImprove.name=="") || (updateImprove.area=="")){
      setError("Please enter all the required values.");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/improve-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateImprove),
        headers: { "Content-Type": "application/json" },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setResponse(result.message);
          setError("");
          setName("");
          setArea("");
          setActive(false);
          navigate("/improvements/improve-list");
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
          <label className="form-label">Area of Improvement <span className="ei-col-red">*</span></label>
          <input name="area" type="text" className="form-control" aria-describedby="emailHelp" value={area} onChange={(e) => setArea(e.target.value)} />   
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
