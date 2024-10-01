import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
const token = sessionStorage.getItem('token');
import toastr from 'toastr';

function Create() {
  const [area_for, setAreaFor] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // const deptData = { name, dept_id, active };
    const areaOfImprovementData = { name, area_for, active: active ? "1" : "0" };
    if (!areaOfImprovementData.name || !areaOfImprovementData.area_for){
      toastr.error("Please enter all the required values.");
      return;
    }
    const response = await fetch(`${HOST}:${PORT}/server/area-of-improvement-create`, {
      method: "POST",
      body: JSON.stringify(areaOfImprovementData),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        toastr.success(result.msg);
        setAreaFor("");
        setName("");
        setActive(false);
        navigate("/areas-of-improvement/area-of-improvement-list");
      } else{
        toastr.error(result.msg);
      }
    } else{
      toastr.error("We are unable to process now. Please try again later.")
    }
  };

  return (
    <div className="container my-2">
      <form onSubmit={handleSubmit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
        <div className="mb-3">
          {/* <label className="form-label">Area For <span className="ei-col-red">*</span></label>
          <input name="area_for" type="text" className="form-control" aria-describedby="emailHelp" value={area_for} onChange={(e) => setAreaFor(e.target.value)}/> */}

          <label className="form-label">Area For <span className="ei-col-red">*</span></label>
          <select className="form-select" aria-label="Default select example" name="area_for" value={area_for} onChange={(e) => setAreaFor(e.target.value)}>
              <option defaultValue>--Select area for--</option>
              <option value="TEACHER">TEACHER</option>
              <option value="STUDENT">STUDENT</option>
          </select>        
        </div>
        <div className="mb-3">
          <label className="form-label">Name <span className="ei-col-red">*</span></label>
          <input name="name" type="text" className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
          <label className="form-label">Active <span className="ei-col-red">*</span></label>
          <div>
            <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={active} onChange={(e) => setActive(e.target.checked)}/>
            <label className="form-check-label mx-3" htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}
export default Create;