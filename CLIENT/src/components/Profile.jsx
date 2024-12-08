import "../App.css";
import React, { useEffect, useState } from "react";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');

export default function Profile(){
    const [data, setData] = useState({});
    const [error, setError] = useState("");
    const [response, setResponse] = useState("");
    const getUserProfileData = async () => {
        try {
            const response = await fetch(`${HOST}:${PORT}/server/get-profile-details`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  }
          });
    
          if (response) {
            const result = await response.json();
            if (response.ok && result.doc) {
                setData(result.doc)
            } else {
              setError(result.msg);
            }
          } else {
            setError("We are unable to process now. Please try again later.");
          }
        } catch (error) {
          setError("We are unable to process now. Please try again later.");
        }
    
        setTimeout(() => {
          setResponse("");
          setError("");
        }, 3000);
      };
    
      useEffect(() => {
        getUserProfileData();
      }, []);


    return(
        <div>
            {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
            {response && (<div className="alert alert-success" role="alert">{response}</div>)}
            <main className="container my-2">
                <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <h4 className="text-center m-2">User Profile</h4>
                    <div className=" justify-content-center">
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <th scope="row">User Type</th>
                                    <td scope="row">: {data.user_type}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Name</th>
                                    <td scope="row">: {data.name}</td>
                                </tr>
                                {(data.user_type == "TEACHER") && (<tr>
                                    <th scope="row">Teacher Code</th>
                                    <td scope="row">: {data.teacher_code}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Employee Id</th>
                                    <td scope="row">: {data.employee_id}</td>
                                </tr>)}
                                {(data.user_type == "TEACHER") && (<tr>
                                    <th scope="row">Department</th>
                                    <td scope="row">: {data.department}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Specialization</th>
                                    <td scope="row">: {data.specialization}</td>
                                </tr>)}
                                
                                {(data.user_type == "STUDENT") && (<tr>
                                    <th scope="row">Department</th>
                                    <td scope="row">: {data.department}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Reg Number & Year</th>
                                    <td scope="row">: {data.registration_number} of {data.registration_year}</td>
                                </tr>)}
                                <tr>
                                    <th scope="row">Phone</th>
                                    <td scope="row">: {data.phone}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Email</th>
                                    <td scope="row">: {data.email}</td>
                                </tr>
                                <tr>
                                    <th scope="row">PIN</th>
                                    <td scope="row">: {data.pin}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Address</th>
                                    <td scope="row">: {data.address}</td>
                                </tr>
                                <br />
                                <tr>
                                    <th scope="row">Activation Status</th>
                                    <td scope="row">: {data.active}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Verification Status</th>
                                    <td scope="row">: {data.is_verified}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Registered on Platform</th>
                                    <td scope="row">: {data.createdAt}</td>
                                    <td scope="row"></td>
                                    <th scope="row">Last Log In</th>
                                    <td scope="row">: {data.last_log_in}</td>
                                </tr>
                                {/* {((data.user_type == "STUDENT") || data.user_type == "TEACHER") && (<tr>
                                    <th scope="row">Total Number of Feedbacks Provide</th>
                                    <td scope="row">: 134</td>
                                    <td scope="row"></td>
                                    <th scope="row">Total Number of Feedbacks Received</th>
                                    <td scope="row">: 745</td>
                                </tr>)} */}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    )
}