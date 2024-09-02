
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// const HOST = import.meta.env.VITE_HOST
// const PORT = import.meta.env.VITE_PORT

// function Create() {
//   const [subject_code, setSubjectCode] = useState("");
//   const [name, setName] = useState("");
//   const [department, setDepartment] = useState("");
//   const [active, setActive] = useState("");
//   const [error, setError] = useState("");
//   const [response, setResponse] = useState("");
//   const navigate = useNavigate();
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const subjectData = { subject_code, name, department, active };
//     if ((subjectData.subject_code=="") || (subjectData.name=="") || (subjectData.department=="") || (subjectData.active=="")){
//       setError("Please enter all the required values.");
//       return;
//     }
//     const response = await fetch(`${HOST}:${PORT}/server/subject-create`, {
//       method: "POST",
//       body: JSON.stringify(subjectData),
//       headers: {"Content-Type": "application/json"},
//     });
//     if (response){
//       const result = await response.json();
//       if (response.ok){
//         setResponse(result.msg);
//         setError("");
//         setSubjectCode("");
//         setName("");
//         setDepartment("");
//         setActive("");
//         navigate("/subjects/subject-list");
//       } else{
//         setError(result.msg);
//       }
//     } else{
//       setError("We are unable to process now. Please try again later.")
//     }
//     setTimeout(() => {
//       setResponse("");
//       setError("");
//     }, 3000);
//   };

//   return (
//     <div className="container my-5 py-5">
//       {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
//       {response && (<div className="alert alert-success" role="alert">{response}</div>)}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="form-label">Subject Code</label>
//           <input name="subject_code" type="text" className="form-control" aria-describedby="emailHelp" value={subject_code} onChange={(e) => setSubjectCode(e.target.value)}/>
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Subject Name</label>
//           <input name="name" type="text" className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Department</label>
//           <input name="department" type="text" className="form-control" aria-describedby="emailHelp" value={department} onChange={(e) => setDepartment(e.target.value)}/>
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Active</label>
//           <input name="active" type="number" className="form-control" value={active} onChange={(e) => setActive(e.target.value)} />
//         </div>

//         <button type="submit" className="btn btn-primary">Submit</button>
//       </form>
//     </div>
//   );
// }
// export default Create;



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function Create() {
  const [subject_code, setSubjectCode] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [active, setActive] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [departments, setDepartments] = useState([]);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const subjectData = { subject_code, name, department, active };
    if (
      subjectData.subject_code === "" ||
      subjectData.name === "" ||
      subjectData.department === "" ||
      subjectData.active === ""
    ) {
      setError("Please enter all the required values.");
      return;
    }
    const response = await fetch(`${HOST}:${PORT}/server/subject-create`, {
      method: "POST",
      body: JSON.stringify(subjectData),
      headers: { "Content-Type": "application/json" },
    });
    if (response) {
      const result = await response.json();
      if (response.ok) {
        setResponse(result.msg);
        setError("");
        setSubjectCode("");
        setName("");
        setDepartment("");
        setActive("");
        navigate("/subjects/subject-list");
      } else {
        setError(result.msg);
      }
    } else {
      setError("We are unable to process now. Please try again later.");
    }
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 3000);
  };

  return (
    <div className="container my-5 py-5">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {response && (
        <div className="alert alert-success" role="alert">
          {response}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Subject Code</label>
          <input
            name="subject_code"
            type="text"
            className="form-control"
            value={subject_code}
            onChange={(e) => setSubjectCode(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Subject Name</label>
          <input
            name="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select
            name="department"
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Active</label>
          <input
            name="active"
            type="number"
            className="form-control"
            value={active}
            onChange={(e) => setActive(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Create;


