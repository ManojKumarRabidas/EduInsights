import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Update() {
  const [subject_code, setSubjectCode] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [active, setActive] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [departments, setDepartments] = useState([]);
  const [subjectData, setSubjectData] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  
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

  const getSubjectData = async () => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/server/subject-details/${id}`,
        {method: "GET",}
      );
      if (response){
        var result = await response.json();
        result.doc = result.doc[0]
        if (response.ok){
          setSubjectData(result.doc);
          setSubjectCode(result.doc.subject_code); 
          setName(result.doc.name);
          setDepartment(result.doc.department._id);
          setActive(result.doc.active === 1);
        } else{
          setError(result.msg);
        }
      } else{
        setError("We are unable to process now. Please try again later.")
      }
    } catch(err) {
      setError("We are unable to process now. Please try again later.");
    }
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 3000);
  };

  useEffect(() => {
    getSubjectData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateSubject = { subject_code, name, department, active: active ? 1 : 0 };
    if (!subject_code || !name || !department){
      setError("Please enter all the required values.");
      return;
    }
    try {
      const response = await fetch(
        `${HOST}:${PORT}/server/subject-update/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateSubject),
          headers: {"Content-Type": "application/json"},
        }
      );
  
      if (response){
        const result = await response.json();
        if (response.ok){
          setResponse(result.message);
          setError("");
          setSubjectCode("");
          setName("");
          setDepartment("");
          setActive("");
          navigate("/subjects/subject-list");
        } else{
          setError(result.msg);
        }
      } else{
        setError("We are unable to process now. Please try again later.")
      }
    } catch (err) {
      setError("We are unable to process now. Please try again later.");
    }
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 3000);
  };

  return (
    <div className="container my-2">
      {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}

      <form onSubmit={handleEdit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
        <div className="mb-3">
          <label className="form-label">Subject Code <span className="ei-col-red">*</span></label>
          <input name="subject_code" type="text" className="form-control" aria-describedby="emailHelp" value={subject_code} onChange={(e) => setSubjectCode(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Subject Name <span className="ei-col-red">*</span></label>
          <input name="name" type="text" className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        {/* <div className="mb-3">
          <label className="form-label">Department <span className="ei-col-red">*</span></label>
          <input name="department" type="text" className="form-control" aria-describedby="emailHelp" value={department} onChange={(e) => setDepartment(e.target.value)}/>
        </div> */}
        <div className="mb-3">
          <label className="form-label">Department <span className="ei-col-red">*</span></label>
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
        <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
          <label className="form-label">Active <span className="ei-col-red">*</span></label>
          <div>
            <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={active} onChange={(e) => setActive(e.target.checked)}/>
            <label className="form-check-label mx-3 " htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}
export default Update;