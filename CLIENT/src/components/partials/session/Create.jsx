import React,{ useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
import toastr from 'toastr';
const token = sessionStorage.getItem('token');

function Create() {
    const [departments, setDepartments] = useState([]);
    const [years, setYears] = useState([]);
    const [registration_year, setRegistrationYear] = useState("");
    const [department, setDepartment] = useState("");
    const [duration, setDuration] = useState("");
    const [start_date_1st_sem, setStartDate1stSem] = useState("");
    const [end_date_1st_sem, setEndDate1stSem] = useState("");
    const [start_date_2nd_sem, setStartDate2ndSem] = useState("");
    const [end_date_2nd_sem, setEndDate2ndSem] = useState("");
    const [start_date_3rd_sem, setStartDate3rdSem] = useState("");
    const [end_date_3rd_sem, setEndDate3rdSem] = useState("");
    const [start_date_4th_sem, setStartDate4thSem] = useState("");
    const [end_date_4th_sem, setEndDate4thSem] = useState("");
    const [start_date_5th_sem, setStartDate5thSem] = useState("");
    const [end_date_5th_sem, setEndDate5thSem] = useState("");
    const [start_date_6th_sem, setStartDate6thSem] = useState("");
    const [end_date_6th_sem, setEndDate6thSem] = useState("");
    const [start_date_7th_sem, setStartDate7thSem] = useState("");
    const [end_date_7th_sem, setEndDate7thSem] = useState("");
    const [start_date_8th_sem, setStartDate8thSem] = useState("");
    const [end_date_8th_sem, setEndDate8thSem] = useState("");
    const [active, setActive] = useState(false);
    const navigate = useNavigate();
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-departments`);
        const data = await response.json();
        if (response.ok) {
          setDepartments(data.departments);
        } else {
          toastr.error("Failed to load departments.");
        }
      } catch (err) {
        toastr.error("Failed to load departments.");
      }
    };

    useEffect(() => {
      fetchDepartments();
      const currentYear = new Date().getFullYear();
      const pastFiftyYears = Array.from({ length: 50 }, (_, index) => currentYear - index);
      setYears(pastFiftyYears);
    }, []);

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!registration_year || !department ||!duration ){
        toastr.error("Please enter all the required values.");
        return;
      }
      const data = { registration_year, department, duration, start_date_1st_sem, end_date_1st_sem, start_date_2nd_sem, end_date_2nd_sem, start_date_3rd_sem, end_date_3rd_sem, start_date_4th_sem, end_date_4th_sem, start_date_5th_sem, end_date_5th_sem, start_date_6th_sem, end_date_6th_sem, start_date_7th_sem, end_date_7th_sem, start_date_8th_sem, end_date_8th_sem,  active: active ? "1" : "0" };
      const response = await fetch(`${HOST}:${PORT}/server/session-create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        }
      });
      if (response){
        const result = await response.json();
        if (response.ok){
          toastr.success(result.msg);
          navigate("/session/session-list");
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
          <div className="row">
            <div className="mb-3 col">
              <label className="form-label">Registration Year <span className="ei-col-red">*</span></label>   
              <select name="registration_year" className="form-control" value={registration_year} onChange={(e) => setRegistrationYear(e.target.value)}>
              <option value="" disabled> -- Select --</option>
              {years.map((year) => (
                <option key={year} value={year}> {year}</option>
              ))}
              </select>
            </div>
            <div className="mb-3 col">
              <label className="form-label">Department <span className="ei-col-red">*</span></label>
              <select name="department" className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">--Select Department--</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}> {dept.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3 col">
              <label className="form-label">Duration of Course <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option defaultValue>--Select duration--</option>
                <option value="1">1 Year</option>
                <option value="2">2 Year</option>
                <option value="3">3 Year</option>
                <option value="4">4 Year</option>
                <option value="5">5 Year</option>
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date Of 1st Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="start_date_1st_sem" value={start_date_1st_sem} onChange={(e) => setStartDate1stSem(e.target.value)}/>
            </div>
            <div className="col">
              <label className="form-label">End Date Of 1st Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="end_date_1st_sem" value={end_date_1st_sem} onChange={(e) => setEndDate1stSem(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date Of 2nd Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="start_date_2nd_sem" value={start_date_2nd_sem} onChange={(e) => setStartDate2ndSem(e.target.value)}/>
            </div>
            <div className="col">
              <label className="form-label">End Date Of 2nd Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="end_date_2nd_sem" value={end_date_2nd_sem} onChange={(e) => setEndDate2ndSem(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date Of 3rd Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="start_date_3rd_sem" value={start_date_3rd_sem} onChange={(e) => setStartDate3rdSem(e.target.value)}/>
            </div>
            <div className="col">
              <label className="form-label">End Date Of 3rd Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="end_date_3rd_sem" value={end_date_3rd_sem} onChange={(e) => setEndDate3rdSem(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date Of 4th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="start_date_4th_sem" value={start_date_4th_sem} onChange={(e) => setStartDate4thSem(e.target.value)}/>
            </div>
            <div className="col">
              <label className="form-label">End Date Of 4th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="end_date_4th_sem" value={end_date_4th_sem} onChange={(e) => setEndDate4thSem(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date Of 5th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="start_date_5th_sem" value={start_date_5th_sem} onChange={(e) => setStartDate5thSem(e.target.value)}/>
            </div>
            <div className="col">
              <label className="form-label">End Date Of 5th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="end_date_5th_sem" value={end_date_5th_sem} onChange={(e) => setEndDate5thSem(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date Of 6th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="start_date_6th_sem" value={start_date_6th_sem} onChange={(e) => setStartDate6thSem(e.target.value)}/>
            </div>
            <div className="col">
              <label className="form-label">End Date Of 6th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="end_date_6th_sem" value={end_date_6th_sem} onChange={(e) => setEndDate6thSem(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date Of 7th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="start_date_7th_sem" value={start_date_7th_sem} onChange={(e) => setStartDate7thSem(e.target.value)}/>
            </div>
            <div className="col">
              <label className="form-label">End Date Of 7th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="end_date_7th_sem" value={end_date_7th_sem} onChange={(e) => setEndDate7thSem(e.target.value)}/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date Of 8th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="start_date_8th_sem" value={start_date_8th_sem} onChange={(e) => setStartDate8thSem(e.target.value)}/>
            </div>
            <div className="col">
              <label className="form-label">End Date Of 8th Semester<span className="ei-col-red">*</span></label>
              <input type="date" className="form-control" aria-label="Date" name="end_date_8th_sem" value={end_date_8th_sem} onChange={(e) => setEndDate8thSem(e.target.value)}/>
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