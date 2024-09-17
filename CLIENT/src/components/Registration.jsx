import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function Registration() {
  const [user_type, setUserType] = useState("");
  const [department, setDepartment] = useState("");
  const [registration_year, setRegistrationYear] = useState("");
  const [registration_number, setRegistrationNumber] = useState("");
  const [teacher_code, setTeacherCode] = useState("");
  const [employee_id, setEmployeeId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [login_id, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [repeat_password, setRepeatPassword] = useState("");
  const [isLoginIdInvalid, setIsLoginIdInvalid] = useState(null);
  const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(null); // For tracking availability
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-departments`);
        const data = await response.json();
        if (response.ok) {
          setDepartments(data.departments);
        } else {
          setError("Failed to load departments.");
        }
      } catch (err) {
        setError("Failed to load departments.");
      }
    };

    fetchDepartments();
  }, []);

  // Function to check login ID availability
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
    if (id.length > 0 && (id.length < 4 || id.length>20)) { // Only check if the ID length is greater than 2
      setIsLoginIdInvalid(true);
      setIsLoginIdAvailable(null);
    } else if(id.length >= 4){
      setIsLoginIdInvalid(false);
      checkLoginIdAvailability(id);
    } else {
      setIsLoginIdInvalid(false);
      setIsLoginIdAvailable(null);
    }
  };

  const changeUserType = async(value) => {
    setUserType(value);
    var element = document.getElementById("user-type-registration-row");
    if (value == "TEACHER"){
      element.classList.remove("registration-row");
      element.classList.add("teacher-registration-row");
    } else if (value == "STUDENT") {
      element.classList.remove("teacher-registration-row");
      element.classList.add("registration-row");
    } else{
      element.classList.remove("teacher-registration-row");
      element.classList.add("registration-row");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 5000);
    if (
      !user_type ||
      !department ||
      !name ||
      !phone ||
      !email ||
      !address ||
      !pin ||
      !login_id ||
      !password ||
      !repeat_password
    ) {
      setError("Please enter all the required values.");
      return;
    }
    if (user_type === "TEACHER" && (!teacher_code || !employee_id || !specialization)) {
      setError("Please enter all the required values.");
      return;
    }
    if (user_type === "STUDENT" && (!registration_number || !registration_year)) {
      setError("Please enter all the required values.");
      return;
    }
    if (password !== repeat_password) {
      setError("'Password' and 'Repeat Password' is different.");
      return;
    }
    if (isLoginIdAvailable === false) {
      setError("Login ID is not available. Please choose another.");
      return;
    }

    const userData = {
      user_type,
      department,
      registration_year,
      registration_number,
      teacher_code,
      employee_id,
      specialization,
      name,
      phone,
      email,
      address,
      pin,
      login_id,
      password,
    };
    const response = await fetch(`${HOST}:${PORT}/server/user-create`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" },
    });

    if (response) {
      const result = await response.json();
      if (response.ok) {
        setResponse(result.msg);
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        setError(result.msg);
      }
    } else {
      setError("We are unable to process now. Please try again later.");
    }

    // setTimeout(() => {
    //   setResponse("");
    //   setError("");
    // }, 5000);
  };

  const clearForm = async()=>{
    setUserType("")
    setDepartment("")
    setRegistrationYear("")
    setRegistrationNumber("")
    setTeacherCode("")
    setEmployeeId("")
    setSpecialization("")
    setName("")
    setPhone("")
    setEmail("")
    setAddress("")
    setPin("")
    setLoginId("")
    setPassword("")
    setRepeatPassword("")
  }

  return (
    <div className="container my-2 shadow-sm p-3 mb-5 bg-body-tertiary rounded">
      <h3 className="text-center mb-5">EduInsights - User Registration</h3>
      {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}

      <form onSubmit={handleSubmit}>
        <div className="form-section ">
          <div className="registration-rows d-flex justify-content-center align-items-center">
            <div id="user-type-registration-row" className="registration-row m-2">
              <label className="form-label">User Type <span className="ei-col-red">*</span>
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="user_type"
                value={user_type}
                // onChange={(e) => setUserType(e.target.value)
                onChange={(e) => changeUserType(e.target.value)}
              >
                <option defaultValue>--Select user type--</option>
                <option value="TEACHER">TEACHER</option>
                <option value="STUDENT">STUDENT</option>
              </select>
            </div>

            {/* Conditional fields for STUDENT */}
            {user_type === "STUDENT" && (
              <>
                <div className="registration-row m-2">
                  <label className="form-label">
                    Registration Year <span className="ei-col-red">*</span>
                  </label>
                  <input
                    name="registration_year"
                    type="text"
                    maxLength={4}
                    className="form-control"
                    value={registration_year}
                    onChange={(e) => setRegistrationYear(e.target.value)}
                  />
                </div>
                
                <div className="registration-row m-2">
                  <label className="form-label">
                    Registration Number <span className="ei-col-red">*</span>
                  </label>
                  <input
                    name="registration_number"
                    type="text"
                    maxLength={20}
                    className="form-control"
                    value={registration_number}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                  />
                </div>
              </>
              )}

            {/* Conditional fields for TEACHER */}
            {user_type === "TEACHER" && (
              <>
                <div className="registration-row teacher-registration-row m-2">
                  <label className="form-label">
                    Teacher Code <span className="ei-col-red">*</span>
                  </label>
                  <input
                    name="teacher_code"
                    type="text"
                    maxLength={20}
                    className="form-control"
                    value={teacher_code}
                    onChange={(e) => setTeacherCode(e.target.value)}
                  />
                </div>
                <div className="registration-row teacher-registration-row m-2">
                  <label className="form-label">
                    Employee Id <span className="ei-col-red">*</span>
                  </label>
                  <input
                    name="employee_id"
                    type="text"
                    maxLength={20}
                    className="form-control"
                    value={employee_id}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                </div>
                <div className="registration-row teacher-registration-row m-2">
                  <label className="form-label">Specialization <span className="ei-col-red">*</span>
                  </label>
                  <input
                    name="specialization"
                    type="text"
                    maxLength={20}
                    className="form-control"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>
              </>
            )}          
          </div>
          <div className="registration-rows d-flex justify-content-center align-items-center">
            {/* Common fields for both TEACHER and STUDENT */}
            <div className="registration-row m-2">
              <label className="form-label">
                Department <span className="ei-col-red">*</span>
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option defaultValue>--Select department--</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="registration-row m-2">
              <label className="form-label">
                Name <span className="ei-col-red">*</span>
              </label>
              <input
                name="name"
                type="text"
                maxLength={70}
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="registration-row m-2">
              <label className="form-label">
                Phone <span className="ei-col-red">*</span>
              </label>
              <input
                name="phone"
                type="text"
                maxLength={10}
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="registration-rows d-flex justify-content-center align-items-center">
            <div className="registration-row m-2">
              <label className="form-label">
                Email <span className="ei-col-red">*</span>
              </label>
              <input
                name="email"
                type="email"
                maxLength={70}
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="registration-row m-2">
              <label className="form-label">
                Address <span className="ei-col-red">*</span>
              </label>
              <input
                name="address"
                type="text"
                maxLength={255}
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="registration-row m-2">
              <label className="form-label">
                PIN <span className="ei-col-red">*</span>
              </label>
              <input
                name="pin"
                type="text"
                maxLength={6}
                className="form-control"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>
          </div>
          <div className="registration-rows d-flex justify-content-center align-items-center">
            <div className="registration-row m-2">
              <label className="form-label">
                Login Id <span className="ei-col-red">*</span>
              </label>
              <input
                name="login_id"
                type="text"
                maxLength={20}
                className="form-control"
                value={login_id}
                onChange={handleLoginIdChange}
              />
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
            <div className="registration-row m-2">
              <label className="form-label">
                Password <span className="ei-col-red">*</span>
              </label>
              <input
                name="password"
                type="password"
                maxLength={20}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="registration-row m-2">
              <label className="form-label">
                Repeat Password <span className="ei-col-red">*</span>
              </label>
              <input
                name="repeat_password"
                type="password"
                maxLength={20}
                className="form-control"
                value={repeat_password}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="buttons-div d-flex justify-content-center align-items-center">
          <Link to="/login"><button className="btn btn-primary m-2">Back to log in</button></Link>
          <button type="submit" className="btn btn-primary m-2">Save</button>
          <button type="reset" className="btn btn-primary m-2" onClick={() => clearForm()}>Clear</button>
        </div>
      </form>
    </div>
  );
}

export default Registration;
