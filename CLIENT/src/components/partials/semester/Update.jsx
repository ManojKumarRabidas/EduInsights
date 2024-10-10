import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
const token = sessionStorage.getItem('token');
import toastr from 'toastr';

function Update() {
  const [department, setDepartment] = useState("");
  const [registration_year, setStudentRegYear] = useState("");
  const [active, setActive] = useState(false);
  const [semesterData, setSemesterData] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  
  const getSemesterData = async () => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/server/semester-details/${id}`,{
          method: "GET",
          headers: { 'authorization': `Bearer ${token}` },
        }
      );
      if (response){
        const result = await response.json();
        if (response.ok){
          setSemesterData(result.doc);
          setStudentRegYear(result.doc.strength_for); 
          setDepartment(result.doc.name);
          setActive(result.doc.active);
        } else{
          toastr.error(result.msg);
        }
      } else{
        toastr.error("We are unable to process now. Please try again later.")
      }
    } catch(err) {
      toastr.error("We are unable to process now. Please try again later.")
    }
  };

  useEffect(() => {
    getSemesterData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateSemester = {registration_year, department, active: active ? 1 : 0 };
    if (!registration_year || !department){
      toastr.error("Please enter all the required values.");
      return;
    }
    try{
      const response = await fetch(
        `${HOST}:${PORT}/server/semester-update/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateSemester),
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          }
        }
      );
  
      if (response){
        const result = await response.json();
        if (response.ok){
          toastr.success(result.message);
          setDepartment("");
          setStudentRegYear("");
          setActive(false);
          navigate("/semester/semester-list");
        } else{
          toastr.error(result.msg);
        }
      } else{
        toastr.error("We are unable to process now. Please try again later.")
      }
    } catch(err){
      toastr.error("We are unable to process now. Please try again later.")
    }
  };

  return (
    <div className="container my-2">
      <form onSubmit={handleEdit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
        <div className="mb-3">
          <label className="form-label">Registration Year <span className="ei-col-red">*</span></label>
          <select className="form-select" aria-label="Default select example" name="registration_year" value={registration_year} onChange={(e) => setStudentRegYear(e.target.value)}>
              <option defaultValue>--Select Registration Year--</option>
              <option value="TEACHER">TEACHER</option>
              <option value="STUDENT">STUDENT</option>
          </select>        
        </div>
        <div className="mb-3">
          <label className="form-label">Department <span className="ei-col-red">*</span></label>
          <input name="department" type="text" className="form-control" aria-describedby="emailHelp" value={department} onChange={(e) => setDepartment(e.target.value)}/>
        </div>
        <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
          <label className="form-label">Active <span className="ei-col-red">*</span></label>
          <div>
            <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={active} onChange={(e) => setActive(e.target.checked)}/>
            <label className="form-check-label mx-3 " htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}
export default Update;