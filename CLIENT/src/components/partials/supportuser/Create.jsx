import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
const token = sessionStorage.getItem('token');

function Create() {
  const [user_type, setUserType] = useState("");
  const [employee_id, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [login_id, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [repeat_password, setRepeatPassword] = useState("");
  const [isLoginIdInvalid, setIsLoginIdInvalid] = useState(null);
  const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const checkLoginIdAvailability = async (id) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/check-login-id/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      
      if (response.ok) {
        setIsLoginIdAvailable(result.available); // Assuming the API returns { available: true/false }
      } else {
        setError(result.msg);
        setIsLoginIdAvailable(null); // Reset availability state in case of error
      }
    } catch (error) {
      console.error("Error checking login ID availability:", error);
      setIsLoginIdAvailable(null); // Reset availability state in case of error
    }
  };

  const handleLoginIdChange = (e) => {
    const id = e.target.value;
    setLoginId(id);

    // Check login ID availability after user stops typing for a short duration (debounce)
    if (id.length > 0 && (id.length < 4 || id.length>10)) { // Only check if the ID length is greater than 2
      setIsLoginIdInvalid(true);
      setIsLoginIdAvailable(null);
    } else if(id.length >= 4){
      setIsLoginIdInvalid(false);
      checkLoginIdAvailability(id);
    } else {
      setIsLoginIdInvalid(false);
      setIsLoginIdAvailable(null); // Reset availability state if less than 3 characters
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 5000);
    const supportUserData = {user_type, employee_id, name, phone, email, address, pin, login_id, password, active: active ? "1" : "0" };
    if (!user_type || !employee_id || !name || !phone || !email || !address || !pin || !login_id || !password || !repeat_password){
      setError("Please enter all the required values.");
      return;
    }
    if (password !== repeat_password) {
        setError("Please enter the same password.");
        return;
      }
      if (isLoginIdAvailable === false) {
        setError("Login ID is not available. Please choose another.");
        return;
      }
    const response = await fetch(`${HOST}:${PORT}/server/support-user-create`, {
      method: "POST",
      body: JSON.stringify(supportUserData),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        setResponse(result.msg);
        navigate("/support-users/support-user-list");
      } else{
        setError(result.msg);
      }
    } else{
      setError("We are unable to process now. Please try again later.")
    }
  };

  return (
    <div className="container my-2">
      {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}

      <form onSubmit={handleSubmit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
        <div className="row">
          <div className="col mb-3">
              <label className="form-label">User Type <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="user_type" value={user_type} onChange={(e) => setUserType(e.target.value)}>
                  <option defaultValue>--Select user type--</option>
                  {/* <option value="ADMIN">ADMIN</option> */}
                  <option value="SUPPORT">SUPPORT</option>
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
        </div>
        <div className="row">  
          <div className="col mb-3">
            <label className="form-label">Pin <span className="ei-col-red">*</span></label>
            <input name="pin" type="text" maxLength={6} className="form-control" aria-describedby="emailHelp" value={pin} onChange={(e) => setPin(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Login Id <span className="ei-col-red">*</span></label>
            <input name="login_id" type="text" maxLength={20} className="form-control" aria-describedby="emailHelp" value={login_id} onChange={handleLoginIdChange}/>
            {isLoginIdAvailable !== null && (
                  <small className={isLoginIdAvailable ? "text-success" : "text-danger"}> 
                    {isLoginIdAvailable ? "Login ID is available" : "Login ID is not available"}
                  </small>
                )}
                {isLoginIdInvalid !== null && (
                  <small className={isLoginIdInvalid ? "text-danger" : "text-success"}> 
                    {isLoginIdInvalid ? "Login ID must contain at least 4 and maximum 20 character" : ""}
                  </small>
                )}
          </div>
        </div>
        <div className="row">  
          <div className="col mb-3">
            <label className="form-label">Password <span className="ei-col-red">*</span></label>
            <input name="password" type="password" maxLength={20} className="form-control" aria-describedby="emailHelp" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Repeat Password <span className="ei-col-red">*</span></label>
            <input name="repeat_password" type="password" maxLength={20} className="form-control" aria-describedby="emailHelp" value={repeat_password} onChange={(e) => setRepeatPassword(e.target.value)}/>
          </div>
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