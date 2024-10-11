import LineChartComponent from './partials/chartcomponents/LineChartComponent';
import BarChartComponent from './partials/chartcomponents/BarChartComponent';
import MultiBarChartComponent from './partials/chartcomponents/MultiBarChartComponent';
import React, { useEffect, useState } from "react";
import toastr from 'toastr';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subMonths } from "date-fns";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');

function Home() {
  const [years, setYears] = useState([]);
  const [monthRange, setMonthRange] = useState([subMonths(new Date(), 13), subMonths(new Date(), 1)]);
  const [logedinUserType, setLogedinUserType] = useState('');
  const [userType, setUserType] = useState('');
  const [names, setNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState([]);
  const [registration_year, setRegistrationYear] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [growthData, setGrowthData] = useState([]);
  const [growthDataPrevMonth, setGrowthDataPrevMonth] = useState('');
  const [growthDataPrevPrevMonth, setGrowthDataPrevPrevMonth] = useState('');
  const [graphData, setGraphData] = useState({});
  const [customMonthGraphData, setCustomMonthGraphData] = useState({});


const getUserType = async (token) => {
  const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
    method: 'GET',
    headers: { 'authorization': `Bearer ${token}` },
  });
  if (response){
    const result = await response.json();
    if (response.ok){
      setLogedinUserType(result.doc.user_type);
      if (result.doc.user_type == "STUDENT" || result.doc.user_type == "TEACHER"){
        setUserType(result.doc.user_type)
        getFeedbackDetails(result.doc.id, result.doc.user_type)
        getCustomRangeFeedbackDetails(result.doc.id, result.doc.user_type, monthRange)
      } else{
        getTopGrowths(token)
      }
    } else{
      toastr.error(result.msg);
    }
  } else{
    toastr.error("We are unable to process now. Please try again later.")
  }
}
const getTopGrowths = async (token) =>{
  const response = await fetch(`${HOST}:${PORT}/server/get-top-growths`, {
    method: 'GET',
    headers: { 'authorization': `Bearer ${token}` },
  });
  if (response){
    const result = await response.json();
    if (response.ok){
      setGrowthData(result.doc.docs)
      setGrowthDataPrevMonth(result.doc.prevMonthYear)
      setGrowthDataPrevPrevMonth(result.doc.prevPrevMonthYear)
    } else{
      toastr.error(result.msg);
    }
  } else{
    toastr.error("We are unable to process now. Please try again later.")
  }
}
const fetchNames = async (userType, registration_year, department) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/get-conditional-user-list`, {
        method: "PATCH",
        body: JSON.stringify({userType: userType, registration_year: registration_year, department: department}),
        headers: { 
          "Content-Type": "application/json",
          'authorization': `Bearer ${token}` 
        },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setNames(result.docs);
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error('Error fetching names:', error);
    }
};
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
  getUserType(token);
}, []);

const handleUserTypeChange = (value) => {
  setGraphData({})
  setUserType(value);
  setNames([]);
  setDepartment('');
  setRegistrationYear('');
  setSelectedName(''); 
  if(value == "STUDENT"){
    const currentYear = new Date().getFullYear();
    const pastFiftyYears = Array.from({ length: 50 }, (_, index) => currentYear - index);
    setYears(pastFiftyYears);
    fetchDepartments()
  }else{
    fetchNames(value)
  }
};

const handleRegYearAndDeptChange =(value, type)=>{
  let newRegYear = registration_year;
  let newDepartment = department;

    if (type === "REGYEAR") {
      newRegYear = value;
      setRegistrationYear(value);
    } else if (type === "DEPARTMENT") {
      newDepartment = value;
      setDepartment(value);
    }

    if (newRegYear && newDepartment) {
      console.log(newRegYear, newDepartment);
      fetchNames("STUDENT", newRegYear, newDepartment)
    }
}
const handleNameChange = (_id) => {
  if(_id){
    setSelectedName(_id)
    getFeedbackDetails(_id, userType);
    getCustomRangeFeedbackDetails(_id, userType, monthRange);
  } else{
    setGraphData({})
  }
};

const getFeedbackDetails = async (_id, userType) => {
  try {
    const response = await fetch(`${HOST}:${PORT}/server/get-user-feedback-details`, {
      method: "PATCH",
      body: JSON.stringify({_id: _id, userType: userType}),
      headers: { 
        "Content-Type": "application/json",
        'authorization': `Bearer ${token}` 
      },
    });

    if (response) {
      const result = await response.json();
      if (response.ok) {
        if(result.status){
          setGraphData(result.doc)
        }else{
          setGraphData({})
          toastr.error(result.msg);
        }
      } else {
        setGraphData({})
        toastr.error(result.msg);
      }
    } else {
      toastr.error("We are unable to process now. Please try again later.");
    }
  } catch (error) {
    toastr.error('Error fetching names:', error);
  }
};

const changeMonthRange = (update)=>{
  setMonthRange(update)
  if(update[0] && update[1]){
    getCustomRangeFeedbackDetails(selectedName, userType, update)
  }
}
const getCustomRangeFeedbackDetails = async (_id, userType, monthRange) => {
  try {
    const response = await fetch(`${HOST}:${PORT}/server/get-custom-range-user-feedback-details`, {
      method: "PATCH",
      body: JSON.stringify({_id: _id, userType: userType, monthRange: monthRange}),
      headers: { 
        "Content-Type": "application/json",
        'authorization': `Bearer ${token}` 
      },
    });

    if (response) {
      const result = await response.json();
      if (response.ok) {
        if(result.status){
          setCustomMonthGraphData(result.doc)
        }else{
          setCustomMonthGraphData({});
          toastr.error(result.msg);
        }
      } else {
        toastr.error(result.msg);
      }
    } else {
      toastr.error("We are unable to process now. Please try again later.");
    }
  } catch (error) {
    toastr.error('Error fetching names:', error);
  }
};
    return (
      <div>
        <main className="container my-2">
          {((logedinUserType == "ADMIN") || (logedinUserType == "SUPPORT")) && <div>
            <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
              <h5 className="mb-3">Top growths in overall teaching quality last month</h5>
                <div className=" justify-content-center">
                  <table className="table table-striped table-bordered">
                      <thead>
                          <tr>
                              <th scope="row">Teacher Name</th>
                              <th scope="row">Average Feedback {growthDataPrevPrevMonth}</th>
                              <th scope="row">Average Feedback {growthDataPrevMonth}</th>
                              <th scope="row">Improvement Percentage</th>
                          </tr>
                      </thead>
                      <tbody>
                          {growthData.map((doc) => (
                            <tr>
                              <td>{doc.name}</td>
                              <td className="text-end">{doc.prevPrevMonthAvg}</td>
                              <td className="text-end">{doc.prevMonthAvg}</td>
                              <td className="text-end">{doc.avgGrowth} %</td>
                            </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            </section>
            <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
              <h5 className="mb-3">Select user type and user to see his/her details</h5>
                <div className=" justify-content-center">
                  <div className="row">
                    <div className="mb-3 col">
                        <label className="form-label">Select User Type <span className="ei-col-red">*</span></label>
                        <select name="user_type" className="form-control" onChange={(e) => handleUserTypeChange(e.target.value)}>
                            <option defaultValue>-- select --</option>
                            <option value="STUDENT">STUDENT</option>
                            <option value="TEACHER">TEACHER</option>
                        </select>
                    </div>
                    {userType=="STUDENT" && <div className="mb-3 col">
                      <label className="form-label">Registration Year <span className="ei-col-red">*</span></label>   
                      <select name="registration_year" className="form-control" value={registration_year} onChange={(e) => handleRegYearAndDeptChange(e.target.value, "REGYEAR")}>
                      <option value="" disabled> -- Select --</option>
                      {years.map((year) => (
                        <option key={year} value={year}> {year}</option>
                      ))}
                      </select>
                    </div>}
                    {userType=="STUDENT" && <div className="mb-3 col">
                      <label className="form-label">Department <span className="ei-col-red">*</span></label>
                      <select name="department" className="form-control" value={department} onChange={(e) => handleRegYearAndDeptChange(e.target.value, "DEPARTMENT")}>
                        <option value="">--Select Department--</option>
                        {departments.map((dept) => (
                          <option key={dept._id} value={dept._id}> {dept.name}</option>
                        ))}
                      </select>
                    </div>}
                  </div>

                  <div className="mb-3">
                      <label className="form-label">
                        Name <span className="ei-col-red">*</span>
                      </label>
                      <select name="name" className="form-control" onChange={(e) => handleNameChange(e.target.value)} value={selectedName}>
                          <option value="">-- select --</option>
                          {names.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name}  {user.registration_number}
                            </option>
                          ))}
                      </select>
              </div>
            </div>
            </section>
          </div>}
          {graphData.lineGraphData && <div>
            <section className="bg-light py-5 my-2">
              <div className="container px-5">
                <div className="row gx-5 justify-content-center">
                  <div className="h4 mb-4 d-flex align-items-center justify-content-center">
                    {userType=="STUDENT" && "Current Session Average Overall Performance"}
                    {userType=="TEACHER" && "Last 12 Months Average Overall Teaching Quality"}
                  </div>
                  {userType=="TEACHER" && <div className='d-flex justify-content-end'>
                    <label className='m-2'>Custom Month Range: </label>
                    <DatePicker selectsRange startDate={monthRange[0]} endDate={monthRange[1]} onChange={(update) => changeMonthRange(update)} dateFormat="MM/yyyy" maxDate={monthRange[1]} className="form-control form-select"/>
                  </div>}
                  
                  {graphData.lineGraphData && <LineChartComponent data={customMonthGraphData} />}
                </div>
              </div>
            </section>
            <section className="bg-light py-5 my-2">
              <div className="container px-5">
                <div className="row gx-5 justify-content-center">
                  <div className="h4 mb-4 d-flex align-items-center justify-content-center">
                    {userType=="STUDENT" && "Last Semester Average Feedback"}
                    {userType=="TEACHER" && "Last Month Average Feedback"}
                  </div>
                  {graphData.lastMonthOrSemBarData && <BarChartComponent data={graphData.lastMonthOrSemBarData} />}
                </div>
              </div>
            </section>
            <section className="bg-light py-5 my-2">
              <div className="container px-5">
                <div className="row gx-5 justify-content-center">
                  <div className="h4 mb-4 d-flex align-items-center justify-content-center">
                    {userType=="STUDENT" && "Last Three Semester Average Feedback"}
                    {userType=="TEACHER" && "Last Three Months Average Feedback"}
                  </div>
                  {graphData.lastThreeMonthOrSemBarData && <MultiBarChartComponent data={graphData.lastThreeMonthOrSemBarData} />}
                </div>
              </div>
            </section>
            <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                <div className="h4 my-4 d-flex align-items-center justify-content-center">
                  {userType=="STUDENT" && "Top strengths and areas for improvement based on last three semester feedbacks"}
                  {userType=="TEACHER" && "Top strengths and areas for improvement based on last three months feedbacks"}
                </div>
                <div className=" justify-content-center">
                  <table className="table table-striped table-bordered">
                      <tbody>
                          <tr>
                              <td>
                                <table className='table table-striped table-bordered webkit-fill-available-class'>
                                  <tbody>
                                    {graphData.strengths && graphData.strengths.map((strength) => (
                                      <tr>
                                        <td><strong>Strength: </strong>{strength.key}</td> 
                                        <td><strong>Count: </strong>{strength.count}</td>  
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                              <td>
                                <table className='table table-striped table-bordered webkit-fill-available-class'>
                                  <tbody>
                                    {graphData.areas_of_improvement && graphData.areas_of_improvement.map((area_of_improvement) => (
                                      <tr>
                                        <td><strong>Area of Improvement: </strong>{area_of_improvement.key}</td> 
                                        <td><strong>Count: </strong>{area_of_improvement.count}</td>  
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                </div>
            </section>
          </div>}
        </main>
      </div>
    );
  }
  
  export default Home;
  