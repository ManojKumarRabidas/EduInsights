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
  const [subjectData, setSubjectData] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  
  const getSubjectData = async () => {
    const response = await fetch(
      `${HOST}:${PORT}/server/subject-details/${id}`,
      {method: "GET",}
    );
    if (response){
      const result = await response.json();
      if (response.ok){
        setSubjectData(result.doc);
        setSubjectCode(result.doc.subject_code); 
        setName(result.doc.name);
        setDepartment(result.doc.department);
        setActive(result.doc.active);
      } else{
        setError(result.msg);
      }
    } else{
      setError("We are unable to process now. Please try again later.")
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
    const updateSubject = { subject_code, name, department, active };
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
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 3000);
  };

  return (
    <div className="container my-2">
      {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}

      <form onSubmit={handleEdit}>
        <div className="mb-3">
          <label className="form-label">Subject Code</label>
          <input name="subject_code" type="text" className="form-control" aria-describedby="emailHelp" defaultValue={subjectData?.subject_code} onChange={(e) => setSubjectCode(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Subject Name</label>
          <input name="name" type="text" className="form-control" aria-describedby="emailHelp" defaultValue={subjectData?.name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <input name="department" type="text" className="form-control" aria-describedby="emailHelp" defaultValue={subjectData?.department} onChange={(e) => setDepartment(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Active</label>
          <input name="active" type="number" className="form-control" defaultValue={subjectData?.active} onChange={(e) => setActive(e.target.value)}/>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
export default Update;