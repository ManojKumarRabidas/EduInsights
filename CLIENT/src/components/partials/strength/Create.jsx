import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Create() {
    const [strength_for, setStrengthFor] = useState("");
    const [name, setName] = useState("");
    const [active, setActive] = useState("");
    const [error, setError] = useState("");
    const [response, setResponse] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
      event.preventDefault();
      const strengthData = { name, strength_for, active };
      if ((strengthData.name=="") || (strengthData.strength_for=="") || (strengthData.active=="")){
        setError("Please enter all the required values.");
        return;
      }
      const response = await fetch(`${HOST}:${PORT}/server/strength-create`, {
        method: "POST",
        body: JSON.stringify(strengthData),
        headers: {"Content-Type": "application/json"},
      });
      if (response){
        const result = await response.json();
        if (response.ok){
          setResponse(result.msg);
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
      <div className="container my-5 py-5">
        {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
        {response && (<div className="alert alert-success" role="alert">{response}</div>)}
  
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label"> Name</label>
            <input name="name" type="text" className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Strength For</label>
            <input name="strength_for" type="text" className="form-control" aria-describedby="emailHelp" value={strength_for} onChange={(e) => setStrengthFor(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Active</label>
            <input name="active" type="number" className="form-control" value={active} onChange={(e) => setActive(e.target.value)} />
          </div>
  
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
  export default Create;