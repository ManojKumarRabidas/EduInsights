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
  const [dateRange, setDateRange] = useState([subMonths(new Date(), 13), subMonths(new Date(), 1)]);
  const [logedinUserType, setLogedinUserType] = useState('');
  const [userType, setUserType] = useState('');
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [growthData, setGrowthData] = useState([]);
  const [growthDataPrevMonth, setGrowthDataPrevMonth] = useState('');
  const [growthDataPrevPrevMonth, setGrowthDataPrevPrevMonth] = useState('');
  const [graphData, setGraphData] = useState({});
  const [chartData] = useState({
    lineGraphData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        values: [65, 59, 80, 81, 56, 55],
    },
    singleBarData: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        values: [12, 19, 3, 5, 2, 3],
    },
    threeValuedBarData: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        values1: [10, 20, 30, 40, 50],
        values2: [15, 25, 35, 45, 55],
        values3: [20, 30, 40, 50, 60],
    },
});

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
const fetchNames = async (userType) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/get-conditional-user-list`, {
        method: "PATCH",
        body: JSON.stringify({userType: userType}),
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
useEffect(() => {
  getUserType(token);
}, []);

const handleUserTypeChange = (value) => {
  setGraphData({})
  setUserType(value);
  setNames([]);
  setSelectedName(''); 
  fetchNames(value)
};

const handleNameChange = (_id) => {
  if(_id){
    setSelectedName(_id)
    getFeedbackDetails(_id, userType);
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
        setGraphData(result.doc)
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
                  <div className="mb-3">
                      <label className="form-label">Select User Type <span className="ei-col-red">*</span></label>
                      <select name="user_type" className="form-control" onChange={(e) => handleUserTypeChange(e.target.value)}>
                          <option defaultValue>-- select --</option>
                          <option value="STUDENT">STUDENT</option>
                          <option value="TEACHER">TEACHER</option>
                      </select>
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
                    {userType=="STUDENT" && "Current Month Average Overall Performance"}
                    {userType=="TEACHER" && "Current Year Average Overall Teaching Quality"}
                  </div>
                  <div className='d-flex justify-content-end'>
                    <label className='m-2'>Custom Month Range: </label>
                    <DatePicker selectsRange startDate={dateRange[0]} endDate={dateRange[1]} onChange={(update) => setDateRange(update)} dateFormat="MM/yyyy" maxDate={dateRange[1]} className="form-control form-select"/>
                  </div>
                  {graphData.lineGraphData && <LineChartComponent data={graphData.lineGraphData} />}
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
                      {/* <thead>
                          <tr>
                              <th scope="row">Strengths</th>
                              <th scope="row">Areas of Improvement</th>
                          </tr>
                      </thead> */}
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
  