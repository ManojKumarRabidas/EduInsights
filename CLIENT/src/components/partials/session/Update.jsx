// import React,{ useState, useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// const HOST = import.meta.env.VITE_HOST
// const PORT = import.meta.env.VITE_PORT
// import toastr from 'toastr';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// const token = sessionStorage.getItem('token');

// function Update {
//     const [departments, setDepartments] = useState([]);
//     const [years, setYears] = useState([]);
//     const [registration_year, setRegistrationYear] = useState("");
//     const [department, setDepartment] = useState("");
//     const [duration, setDuration] = useState("");
//     const [start_date_1st_sem, setStartDate1stSem] = useState(new Date());
//     const [end_date_1st_sem, setEndDate1stSem] = useState(new Date());
//     const [start_date_2nd_sem, setStartDate2ndSem] = useState("");
//     const [end_date_2nd_sem, setEndDate2ndSem] = useState("");
//     const [start_date_3rd_sem, setStartDate3rdSem] = useState("");
//     const [end_date_3rd_sem, setEndDate3rdSem] = useState("");
//     const [start_date_4th_sem, setStartDate4thSem] = useState("");
//     const [end_date_4th_sem, setEndDate4thSem] = useState("");
//     const [start_date_5th_sem, setStartDate5thSem] = useState("");
//     const [end_date_5th_sem, setEndDate5thSem] = useState("");
//     const [start_date_6th_sem, setStartDate6thSem] = useState("");
//     const [end_date_6th_sem, setEndDate6thSem] = useState("");
//     const [start_date_7th_sem, setStartDate7thSem] = useState("");
//     const [end_date_7th_sem, setEndDate7thSem] = useState("");
//     const [start_date_8th_sem, setStartDate8thSem] = useState("");
//     const [end_date_8th_sem, setEndDate8thSem] = useState("");
//     const [active, setActive] = useState(false);
//     const navigate = useNavigate();
//     const fetchDepartments = async () => {
//       try {
//         const response = await fetch(`${HOST}:${PORT}/server/get-departments`);
//         const data = await response.json();
//         if (response.ok) {
//           setDepartments(data.departments);
//         } else {
//           toastr.error("Failed to load departments.");
//         }
//       } catch (err) {
//         toastr.error("Failed to load departments.");
//       }
//     };

//     useEffect(() => {
//       fetchDepartments();
//       const currentYear = new Date().getFullYear();
//       const pastTenYear = currentYear-10
//       const pastFuture20Years = Array.from({ length: 21 }, (_, index) => pastTenYear + index);
//       setYears(pastFuture20Years);
//     }, []);

//     const handleSubmit = async (event) => {
//       event.preventDefault();
//       if (!registration_year || !department ||!duration ){
//         toastr.error("Please enter all the required values.");
//         return;
//       }
//       const data = { registration_year, department, duration, start_date_1st_sem, end_date_1st_sem, start_date_2nd_sem, end_date_2nd_sem, start_date_3rd_sem, end_date_3rd_sem, start_date_4th_sem, end_date_4th_sem, start_date_5th_sem, end_date_5th_sem, start_date_6th_sem, end_date_6th_sem, start_date_7th_sem, end_date_7th_sem, start_date_8th_sem, end_date_8th_sem,  active: active ? "1" : "0" };
//       const response = await fetch(`${HOST}:${PORT}/server/session-create`, {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: {
//           'Content-Type': 'application/json',
//           'authorization': `Bearer ${token}`,
//         }
//       });
//       if (response){
//         const result = await response.json();
//         if (response.ok){
//           toastr.success(result.msg);
//           navigate("/session/session-list");
//         } else{
//           toastr.error(result.msg);
//         }
//       } else{
//         toastr.error("We are unable to process now. Please try again later.")
//       }
//     };
    
  
//     return (
//       <div className="container my-2">
//         <form onSubmit={handleSubmit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
//           <div className="row">
//             <div className="mb-3 col">
//               <label className="form-label">Registration Year <span className="ei-col-red">*</span></label>   
//               <select name="registration_year" className="form-control" value={registration_year} onChange={(e) => setRegistrationYear(e.target.value)}>
//               <option value="" disabled> -- Select --</option>
//               {years.map((year) => (
//                 <option key={year} value={year}> {year}</option>
//               ))}
//               </select>
//             </div>
//             <div className="mb-3 col">
//               <label className="form-label">Department <span className="ei-col-red">*</span></label>
//               <select name="department" className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)}>
//                 <option value="">-- Select --</option>
//                 {departments.map((dept) => (
//                   <option key={dept._id} value={dept._id}> {dept.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-3 col">
//               <label className="form-label">Duration of Course <span className="ei-col-red">*</span></label>
//               <select className="form-select" aria-label="Default select example" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
//                 <option defaultValue>--Select --</option>
//                 <option value="1">1 Year</option>
//                 <option value="2">2 Years</option>
//                 <option value="3">3 Years</option>
//                 <option value="4">4 Years</option>
//                 {/* <option value="5">5 Years</option> */}
//               </select>
//             </div>
//           </div>
//           <div className="row mb-3">
//             <div className="col">
//               <label className="form-label">Start Date Of 1st Semester<span className="ei-col-red">*</span></label>
//               <div className="date-field-col">
//                 <DatePicker selected={start_date_1st_sem} name="start_date_1st_sem" onChange={(update) => setStartDate1stSem(update)} dateFormat="dd/MM/yyyy" className="form-control form-select"/>
//               </div>
//               {/* <input type="date" className="form-control" aria-label="Date" name="start_date_1st_sem" value={start_date_1st_sem} onChange={(e) => setStartDate1stSem(e.target.value)}/> */}
//             </div>
//             <div className="col">
//               <label className="form-label">End Date Of 1st Semester<span className="ei-col-red">*</span></label>
//               <div className="date-field-col">
//                 <DatePicker selected={end_date_1st_sem} name="end_date_1st_sem" onChange={(update) => setEndDate1stSem(update)} dateFormat="dd/MM/yyyy" className="form-control form-select"/>
//               </div>
//               {/* <input type="date" className="form-control" aria-label="Date" name="end_date_1st_sem" value={end_date_1st_sem} onChange={(e) => setEndDate1stSem(e.target.value)}/> */}
//             </div>
//             <div className="col">
//               <label className="form-label">Start Date Of 2nd Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="start_date_2nd_sem" value={start_date_2nd_sem} onChange={(e) => setStartDate2ndSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">End Date Of 2nd Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="end_date_2nd_sem" value={end_date_2nd_sem} onChange={(e) => setEndDate2ndSem(e.target.value)}/>
//             </div>
//           </div>
//           <div className="row mb-3">
//             <div className="col">
//               <label className="form-label">Start Date Of 3rd Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="start_date_3rd_sem" value={start_date_3rd_sem} onChange={(e) => setStartDate3rdSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">End Date Of 3rd Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="end_date_3rd_sem" value={end_date_3rd_sem} onChange={(e) => setEndDate3rdSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">Start Date Of 4th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="start_date_4th_sem" value={start_date_4th_sem} onChange={(e) => setStartDate4thSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">End Date Of 4th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="end_date_4th_sem" value={end_date_4th_sem} onChange={(e) => setEndDate4thSem(e.target.value)}/>
//             </div>
//           </div>
//           <div className="row mb-3">
//             <div className="col">
//               <label className="form-label">Start Date Of 5th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="start_date_5th_sem" value={start_date_5th_sem} onChange={(e) => setStartDate5thSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">End Date Of 5th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="end_date_5th_sem" value={end_date_5th_sem} onChange={(e) => setEndDate5thSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">Start Date Of 6th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="start_date_6th_sem" value={start_date_6th_sem} onChange={(e) => setStartDate6thSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">End Date Of 6th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="end_date_6th_sem" value={end_date_6th_sem} onChange={(e) => setEndDate6thSem(e.target.value)}/>
//             </div>
//           </div>
//           <div className="row mb-3">
//             <div className="col">
//               <label className="form-label">Start Date Of 7th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="start_date_7th_sem" value={start_date_7th_sem} onChange={(e) => setStartDate7thSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">End Date Of 7th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="end_date_7th_sem" value={end_date_7th_sem} onChange={(e) => setEndDate7thSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">Start Date Of 8th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="start_date_8th_sem" value={start_date_8th_sem} onChange={(e) => setStartDate8thSem(e.target.value)}/>
//             </div>
//             <div className="col">
//               <label className="form-label">End Date Of 8th Semester<span className="ei-col-red">*</span></label>
//               <input type="date" className="form-control" aria-label="Date" name="end_date_8th_sem" value={end_date_8th_sem} onChange={(e) => setEndDate8thSem(e.target.value)}/>
//             </div>
//           </div>
//           <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
//           <label className="form-label">Active <span className="ei-col-red">*</span></label>
//           <div>
//             <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={active} onChange={(e) => setActive(e.target.checked)}/>
//             <label className="form-check-label mx-3" htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
//           </div>
//         </div>
  
//           <button type="submit" className="btn btn-primary">Create</button>
//         </form>
//       </div>
//     );
//   }
//   export default Update;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toastr from 'toastr';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const token = sessionStorage.getItem('token');
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;


function Update() {
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [registration_year, setRegistrationYear] = useState("");
  const [department, setDepartment] = useState("");
  const [duration, setDuration] = useState("");
  const [semesterDates, setSemesterDates] = useState([]);
  const [active, setActive] = useState(false);
  const [showSemesterFields, setShowSemesterFields] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

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

  const getSessionData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/session-details/${id}`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setRegistrationYear(result.doc.registration_year);
          setDepartment(result.doc.department);
          setDuration(result.doc.duration);
          handleDurationChange(result.doc.duration);
          setSemesterDates(result.doc.semesters);
          setActive(result.doc.active === 1);
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      console.log(error);
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  useEffect(() => {
    fetchDepartments();
    getSessionData();
    const currentYear = new Date().getFullYear();
    const pastTenYear = currentYear - 10;
    const pastFuture20Years = Array.from({ length: 21 }, (_, index) => pastTenYear + index);
    setYears(pastFuture20Years);
  }, []);

  const handleDurationChange = (selectedDuration) => {
    selectedDuration = Number(selectedDuration);
    // const selectedDuration = e.target.value;
    setDuration(selectedDuration);
    
    // Initialize semester dates based on duration
    const semesters = [];
    for (let i = 1; i <= selectedDuration * 2; i++) {
      semesters.push({ start: new Date(), end: new Date() });
    }
    setSemesterDates(semesters);

    // Show semester fields after course duration is selected
    if (registration_year && department && selectedDuration) {
      setShowSemesterFields(true);
    }
  };

  const handleDateChange = (index, type, date) => {
    const updatedSemesters = [...semesterDates];
    updatedSemesters[index][type] = date;
    setSemesterDates(updatedSemesters);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!registration_year || !department || !duration) {
      toastr.error("Please enter all the required values.");
      return;
    }

    const data = {
      registration_year,
      department,
      duration,
      semesters: semesterDates,
      active: active ? "1" : "0",
    };

    const response = await fetch(`${HOST}:${PORT}/server/session-update`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    });

    if (response) {
      const result = await response.json();
      if (response.ok) {
        toastr.success(result.msg);
        // navigate to the session list page (if using react-router-dom)
        // navigate("/session/session-list");
      } else {
        toastr.error(result.msg);
      }
    } else {
      toastr.error("We are unable to process now. Please try again later.");
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
              <option value="">-- Select --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}> {dept.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3 col">
            <label className="form-label">Duration of Course <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="duration" value={duration} onChange={(e) => handleDurationChange(e.target.value)}>
              <option defaultValue>--Select --</option>
              <option value="1">1 Year</option>
              <option value="2">2 Years</option>
              <option value="3">3 Years</option>
              <option value="4">4 Years</option>
            </select>
          </div>
        </div>

        {/* Conditionally render semester fields only when all fields are selected */}
        {showSemesterFields && (
          <>
            {semesterDates.map((sem, index) => (
              <div className="row mb-3" key={index}>
                <div className="col">
                  <label className="form-label">Start Date of {index + 1} Semester<span className="ei-col-red">*</span></label>
                  <DatePicker
                    selected={sem.start}
                    onChange={(date) => handleDateChange(index, "start", date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                </div>
                <div className="col">
                  <label className="form-label">End Date of {index + 1} Semester<span className="ei-col-red">*</span></label>
                  <DatePicker
                    selected={sem.end}
                    onChange={(date) => handleDateChange(index, "end", date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                  />
                </div>
              </div>
            ))}
          </>
        )}

        <div className="mb-3 form-switch" style={{ paddingLeft: "0" }}>
          <label className="form-label">Active <span className="ei-col-red">*</span></label>
          <div>
            <input
              className="form-check-input cursor-pointer"
              style={{ marginLeft: "0" }}
              type="checkbox"
              role="switch"
              id="activeSwitch"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <label className="form-check-label mx-3" htmlFor="activeSwitch">
              {active ? "On" : "Off"}
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}

export default Update;


