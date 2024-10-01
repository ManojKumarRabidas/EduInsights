import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');
import toastr from 'toastr';
function Update() {
    const [user_type, setUserType] = useState("");
    const [employee_id, setEmployeeId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [pin, setPin] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

  const getSupportUserData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/support-user-details/${id}`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });
      if (response) {
        const result = await response.json();
        if (response.ok) {
            setUserType(result.doc.user_type);
            setEmployeeId(result.doc.employee_id);
            setName(result.doc.name);
            setPhone(result.doc.phone);
            setEmail(result.doc.email);
            setAddress(result.doc.address);
            setPin(result.doc.pin);
            // setActive(result.doc.active === 1);
        } else {
          toastr.error(result.msg);
        }
      } else {
        log
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  useEffect(() => {
    getSupportUserData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateSupportUser  = {user_type, employee_id, name, phone, email, address, pin };
    if (!user_type || !employee_id || !name || !phone || !email || !address || !pin){
      toastr.error("Please enter all the required values.");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/support-user-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateSupportUser),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          toastr.success("User details updated successfully.");
            navigate("/support-users/support-user-list");
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
        <div className="row">
          <div className="col mb-3">
              <label className="form-label">User Type <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="user_type" value={user_type} onChange={(e) => setUserType(e.target.value)}>
                  <option>--Select user type--</option>
                  {/* <option value="ADMIN">ADMIN</option> */}
                  <option defaultValue value="SUPPORT">SUPPORT</option>
              </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">Employee Id <span className="ei-col-red">*</span></label>
            <input name="employee_id" type="text" maxLength={20} className="form-control" aria-describedby="emailHelp" value={employee_id} onChange={(e) => setEmployeeId(e.target.value)}/>
          </div>
        </div>
        <div className="row">  
          <div className="col mb-3">
            <label className="form-label">Name <span className="ei-col-red">*</span></label>
            <input name="name" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Phone <span className="ei-col-red">*</span></label>
            <input name="phone" type="text" maxLength={10} className="form-control" aria-describedby="emailHelp" value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </div>
        </div>
        <div className="row">  
          <div className="col mb-3">
            <label className="form-label">Email Id <span className="ei-col-red">*</span></label>
            <input name="email" type="email" maxLength={70} className="form-control" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Address <span className="ei-col-red">*</span></label>
            <input name="address" type="text" maxLength={255} className="form-control" aria-describedby="emailHelp" value={address} onChange={(e) => setAddress(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Pin <span className="ei-col-red">*</span></label>
            <input name="pin" type="text" maxLength={6} className="form-control" aria-describedby="emailHelp" value={pin} onChange={(e) => setPin(e.target.value)}/>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}

export default Update;
