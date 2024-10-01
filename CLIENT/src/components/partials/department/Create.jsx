import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
import toastr from 'toastr';
const token = sessionStorage.getItem('token');

function Create() {
  const [dept_id, setDeptId] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // const deptData = { name, dept_id, active };
    const deptData = { name, dept_id, active: active ? "1" : "0" };
    if ((!name || !dept_id)){
      toastr.error("Please enter all the required values.");
      return;
    }
    const response = await fetch(`${HOST}:${PORT}/server/dept-create`, {
      method: "POST",
      body: JSON.stringify(deptData),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        toastr.success(result.msg);
        setDeptId("");
        setName("");
        setActive(false);
        navigate("/departments/dept-list");
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
          <label className="form-label">Department Id <span className="ei-col-red">*</span></label>
          <input name="dept_id" type="text" className="form-control" aria-describedby="emailHelp" value={dept_id} onChange={(e) => setDeptId(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Department Name <span className="ei-col-red">*</span></label>
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