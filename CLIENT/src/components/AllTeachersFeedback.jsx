import React from 'react';
import { useNavigate , Link } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

const TableComponent = () => {
//   const data = [
//     { id: 1, name: "John", age: 28, email: "john@example.com" },
//     { id: 2, name: "Jane", age: 22, email: "jane@example.com" },
//     { id: 3, name: "Tom", age: 32, email: "tom@example.com" }
//   ];

  return (
    <div className="container mt-5">
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Semester Of Rating</th>
            <th>Date Of Rating</th>
            <th>Teacher Name</th>
            <th>Student Name</th>
            <th>Student Registration No</th>
            <th>Department</th>
            <th>Subject Code </th>
            <th>Class Participation</th>
            <th>Homework Or Assignments</th>
            <th>Quality Of Work</th>
            <th>Timeliness</th>
            <th>Probelm Solving Skills</th>
            <th>Behaviour And Attitude</th>
            <th>Responsibility</th>
            <th>Participation And Engagement</th>
            <th>Overall Student Quality</th>
            <th>Strength Names</th>
            <th>Area Of Improvement</th>
            <th>Additional Comments </th>
          </tr>
        </thead>
        {/* <tbody>
          {data.map((person) => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>{person.email}</td>
            </tr>
          ))}
        </tbody> */}
      </table>
    </div>
  );
};

export default TableComponent;
