import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Update() {
  const [name, setName] = useState("");
  const [strength_for, setStrengthFor] = useState("");
  const [active, setActive] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [strengthData, setStrengthData] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  
  const getStrengthData = async () => {
    const response = await fetch(
      `${HOST}:${PORT}/server/strength-details/${id}`,
      {method: "GET",}
    );
    if (response){
      const result = await response.json();
      if (response.ok){
        setStrengthData(result.doc);
        setStrengthFor(result.doc.strength_for); 
        setName(result.doc.name);
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
    getStrengthData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateStrength = { name, strength_for, active };
    const response = await fetch(
      `${HOST}:${PORT}/server/strength-update/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateStrength),
        headers: {"Content-Type": "application/json"},
      }
    );

    if (response){
      const result = await response.json();
      if (response.ok){
        setResponse(result.message);
        setError("");
        setName("");
        setStrengthFor("");
        setActive("");
        navigate("/strengths/strength-list");
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
          <label className="form-label">Strength For</label>
          <input name="strength_for" type="text" className="form-control" aria-describedby="emailHelp" defaultValue={strengthData?.strength_for} onChange={(e) => setStrengthFor(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input name="name" type="text" className="form-control" aria-describedby="emailHelp" defaultValue={strengthData?.name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Active</label>
          <input name="active" type="number" className="form-control" defaultValue={strengthData?.active} onChange={(e) => setActive(e.target.value)}/>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
export default Update;