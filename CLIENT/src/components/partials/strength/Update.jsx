import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
const token = sessionStorage.getItem('token');
import toastr from 'toastr';

function Update() {
  const [name, setName] = useState("");
  const [strength_for, setStrengthFor] = useState("");
  const [active, setActive] = useState(false);
  const [strengthData, setStrengthData] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  
  const getStrengthData = async () => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/server/strength-details/${id}`,{
          method: "GET",
          headers: { 'authorization': `Bearer ${token}` },
        }
      );
      if (response){
        const result = await response.json();
        if (response.ok){
          setStrengthData(result.doc);
          setStrengthFor(result.doc.strength_for); 
          setName(result.doc.name);
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
    getStrengthData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateStrength = {strength_for, name, active: active ? 1 : 0 };
    if (!strength_for || !name){
      toastr.error("Please enter all the required values.");
      return;
    }
    try{
      const response = await fetch(
        `${HOST}:${PORT}/server/strength-update/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateStrength),
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
          setName("");
          setStrengthFor("");
          setActive(false);
          navigate("/strengths/strength-list");
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
          <label className="form-label">Strength For <span className="ei-col-red">*</span></label>
          <select className="form-select" aria-label="Default select example" name="strength_for" value={strength_for} onChange={(e) => setStrengthFor(e.target.value)}>
              <option defaultValue>--Select strength for--</option>
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
            <label className="form-check-label mx-3 " htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}
export default Update;