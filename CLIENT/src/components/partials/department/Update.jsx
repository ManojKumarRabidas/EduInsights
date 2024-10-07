import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
import toastr from 'toastr';
const token = sessionStorage.getItem('token');

function Update() {
  const [dept_id, setDeptId] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const getDeptData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/dept-details/${id}`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setDeptId(result.doc.dept_id);
          setName(result.doc.name);
          setActive(result.doc.active === 1);
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  useEffect(() => {
    getDeptData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateDept = { dept_id, name, active: active ? 1 : 0 };
    if ((updateDept.name=="") || (updateDept.dept_id=="")){
      toastr.error("Please enter all the required values.");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/dept-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateDept),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        }
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          toastr.success("Department details updated successfully.");
          setName("");
          setDeptId("");
          setActive(false);
          navigate("/departments/dept-list");
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  return (
    <div className="container my-2">
      <form onSubmit={handleEdit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
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
