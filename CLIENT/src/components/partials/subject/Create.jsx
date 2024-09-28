import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');

function Create() {
  const [subject_code, setSubjectCode] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [active, setActive] = useState(false);
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
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response) {
      const result = await response.json();
      if (response.ok) {
        setResponse(result.msg);
        setError("");
        setSubjectCode("");
        setName("");
        setDepartment("");
        setActive(false);
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
    <div className="container my-2">
      {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}


      <form onSubmit={handleSubmit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
        <div className="mb-3">
          <label className="form-label">Subject Code <span className="ei-col-red">*</span></label>
          <input
            name="subject_code"
            type="text"
            className="form-control"
            value={subject_code}
            onChange={(e) => setSubjectCode(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Subject Name <span className="ei-col-red">*</span></label>
          <input
            name="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3 select-container">
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
            <label className="form-check-label mx-3" htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
}

export default Create;


