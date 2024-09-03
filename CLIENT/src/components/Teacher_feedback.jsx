import '../App.css'
import React, {useState} from "react";

import { useNavigate , Link } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT



function Teacher_feedback() {
  const [semester_of_rating, setSemesterOfRating] = useState("");
  const [date_of_rating, setDateOfRating] = useState("");
  const [teacher_name, setTeacherName] = useState("");
  const [student_name, setStudentName] = useState("");
  const [student_reg_no, setStudentRegNo] = useState("");
  const [department, setDepartment] = useState("");
  const [subject_code, setSubjectCode] = useState("");
  const [class_participation, setClassParticipation] = useState("");
  const [homework_or_assignments, setHomeworkOrAssignments] = useState("");
  const [quality_of_work, setQualityOfWork] = useState("");
  const [timeliness, setTimeliness] = useState("");
  const [problem_solving_skills, setProblemSolvingSkills] = useState("");
  const [behaviour_and_attitude, setBehaviourAndAttitude] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [participation_and_engagement, setParticipationAndEngagement] = useState("");
  const [group_work, setGroupWork] = useState("");
  const [overall_student_quality , setOverallStudentQuality ] = useState("");
  const [strength_names, setStrengthNames] = useState("");
  const [area_of_improvement_names, setAreaOfImprovementNames] = useState("");
  const [additional_comments, setAdditionalComments] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
      if (!semester_of_rating || !date_of_rating || !teacher_name || !student_name || !student_reg_no || !department || !subject_code || !class_participation || !homework_or_assignments || !quality_of_work || !timeliness || !problem_solving_skills || !behaviour_and_attitude || !responsibility || !participation_and_engagement || !group_work || !overall_student_quality || !strength_names || !area_of_improvement_names || !additional_comments){
            setError("Please enter all the required values.");
            return;
        }
        const teacherData = { semester_of_rating, date_of_rating, teacher_name, student_name, student_reg_no,department, subject_code, class_participation, homework_or_assignments, quality_of_work, timeliness, problem_solving_skills, behaviour_and_attitude, responsibility, participation_and_engagement,group_work, overall_student_quality, strength_names, area_of_improvement_names,  additional_comments };
        const response = await fetch(`${HOST}:${PORT}/server/teacher-feedback`, {
          method: "POST",
          body: JSON.stringify(teacherData),
          headers: {"Content-Type": "application/json"},
        });
        if (response){
          const result = await response.json();
          console.log(result);
          if (response.ok){
            setResponse(result.msg);
            setError("");
            // setDeptId("");
            // setName("");
            // navigate("/login");
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
      return(
        <div className="container my-2">
          {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}
      <Link to="/"></Link>
      <form onSubmit={handleSubmit}>

      <div className="mb-3">
          <label className="form-label">Semester Of Rating <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="semester_of_rating" value={semester_of_rating} onChange={(e) => setSemesterOfRating(e.target.value)}>
                <option defaultValue>--Select semester_of_rating--</option>
                <option value="1">1st sem</option>
                <option value="2">2nd sem</option>
                <option value="3">3rd sem</option>
                <option value="4">4th sem</option>
                <option value="5">5th sem</option>
                <option value="6">6th sem</option>
                <option value="7">7th sem</option>
                <option value="8">8th sem</option>
            </select>
        </div>



        <div className="mb-3">
        <label className="form-label">
         Date Of Rating <span className="ei-col-red">*</span>
         </label>
         <input
        type="date"
        className="form-control"
        aria-label="Date of Rating"
        name="date_of_rating"
        value={date_of_rating}
        onChange={(e) => setDateOfRating(e.target.value)}/>
        </div>


         
        <div className="mb-3">
          <label className="form-label">Teacher Name <span className="ei-col-red">*</span></label>
          <input name="teacher_name" type="text" className="form-control" aria-describedby="emailHelp" value={teacher_name} onChange={(e) => setTeacherName(e.target.value)}/>
        </div>


        <div className="mb-3">
          <label className="form-label">Student Name <span className="ei-col-red">*</span></label>
          <input name="student_name" type="text" className="form-control" aria-describedby="emailHelp" value={student_name} onChange={(e) => setStudentName(e.target.value)}/>
        </div>


        <div className="mb-3">
          <label className="form-label"> Student Registration No <span className="ei-col-red">*</span></label>
          <input name="student_reg_no" type="text" className="form-control" aria-describedby="emailHelp" value={student_reg_no} onChange={(e) => setStudentRegNo(e.target.value)}/>
        </div>

        <div className="mb-3">
          <label className="form-label">Department <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option defaultValue>--Select Your Department--</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
            </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Subject Code <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="subject_code" value={subject_code} onChange={(e) => setSubjectCode(e.target.value)}>
                <option defaultValue>--Select subject_code--</option>
                <option value="BCA">BCAN101</option>
                <option value="BCA">BCAN102</option>
                <option value="BCA">BCA103</option>
                <option value="MCA">MCA101</option>
                <option value="MCA">MCA102</option>
                <option value="MCA">MCA100</option>
            </select>
        </div>

        
        <div className="mb-3">
          <label className="form-label">Class Participation <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="class_participation" value={class_participation} onChange={(e) => setClassParticipation(e.target.value)}>
                <option defaultValue>--Select Your Class Participation--</option>
                <option value="5">Always Participates</option>
                <option value="4">Oftenly Participates</option>
                <option value="3">Sometimes Participates</option>
                <option value="2">Rarely Participates</option>
                <option value="1">Never Participates</option>
            </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Homework Or Assignments <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="homework_or_assignments" value={homework_or_assignments} onChange={(e) => setHomeworkOrAssignments(e.target.value)}>
                <option defaultValue>--Homework Or Assignments --</option>
                <option value="5">Always Done</option>
                <option value="4">Oftenly Done</option>
                <option value="3">Sometimes Done</option>
                <option value="2">Rarely Done</option>
                <option value="1">Never Done</option>
            </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Quality Of Work<span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="quality_of_work" value={quality_of_work} onChange={(e) => setQualityOfWork(e.target.value)}>
                <option defaultValue>--Quality Of Work --</option>
                <option value="5">Excellent</option>
                <option value="4">Very Good</option>
                <option value="3">Good</option>
                <option value="2">Fair</option>
                <option value="1">Poor</option>
            </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Timeliness<span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="timeliness" value={timeliness} onChange={(e) => setTimeliness(e.target.value)}>
                <option defaultValue>--Timeliness --</option>
                <option value="5">Always On Time</option>
                <option value="4">Usually On Time</option>
                <option value="3">Sometimes Late</option>
                <option value="2">Frequently Late</option>
                <option value="1">Always Late</option>
            </select>
        </div>



        <div className="mb-3">
          <label className="form-label">Probelm Solving Skills<span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="probelm_solving_skills" value={problem_solving_skills} onChange={(e) => setProblemSolvingSkills(e.target.value)}>
                <option defaultValue>--Probelm Solving Skills --</option>
                <option value="5">Excellent</option>
                <option value="4">Very Good</option>
                <option value="3">Good</option>
                <option value="2">Fair</option>
                <option value="1">Poor</option>
            </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Behaviour And Attitude<span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="behaviour_and_attitude" value={behaviour_and_attitude} onChange={(e) => setBehaviourAndAttitude(e.target.value)}>
                <option defaultValue>--Behaviour And Attitude --</option>
                <option value="5">Excellent</option>
                <option value="4">Very Good</option>
                <option value="3">Good</option>
                <option value="2">Fair</option>
                <option value="1">Poor</option>
            </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Responsibility<span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="responsibility" value={responsibility} onChange={(e) => setResponsibility(e.target.value)}>
                <option defaultValue>--Responsibility --</option>
                <option value="5">Always Responsible</option>
                <option value="4">Usually Responsible</option>
                <option value="3">Sometimes Responsible</option>
                <option value="2">Frequently Responsible</option>
                <option value="1">Always Responsible</option>
            </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Participation And Engagement<span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="participation_and_engagement" value={participation_and_engagement} onChange={(e) => setParticipationAndEngagement(e.target.value)}>
                <option defaultValue>--Participation And Engagement --</option>
                <option value="5">Excellent</option>
                <option value="4">Very Good</option>
                <option value="3">Good</option>
                <option value="2">Fair</option>
                <option value="1">Poor</option>
            </select>
        </div>



        <div className="mb-3">
          <label className="form-label">Group Work <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="group_work" value={group_work} onChange={(e) => setGroupWork(e.target.value)}>
                <option defaultValue>--Select Group Work--</option>
                <option value="5">Always Participates</option>
                <option value="4">Oftenly Participates</option>
                <option value="3">Sometimes Participates</option>
                <option value="2">Rarely Participates</option>
                <option value="1">Never Participates</option>
            </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Overall Student Quality<span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="overall_student_quality" value={overall_student_quality} onChange={(e) => setOverallStudentQuality(e.target.value)}>
                <option defaultValue>--Overall Student Quality --</option>
                <option value="5">Very Satisfied</option>
                <option value="4">Satisfied</option>
                <option value="3">Neutral</option>
                <option value="2">Dissatisfied</option>
                <option value="1">Out Of Control</option>
            </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Strength Names<span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="strength_names" value={strength_names} onChange={(e) => setStrengthNames(e.target.value)}>
                <option defaultValue>--Select Strength --</option>
                <option value="1">Strong Critical Thinking Skills</option>
                <option value="2">Adaptable/Flexible</option>
                <option value="3">Excellent Time Managements</option>
                <option value="4">Team Player</option>
                <option value="6">Excellent Writing Skills</option>
                <option value="7">Technologically Proficient</option>
                <option value="8">Strong Mathematical Skills</option>
                <option value="9">Highly Organized</option>
                <option value="10">Highly Emotional Intelligence</option>
                <option value="11">Creative Thinker</option>
                <option value="12">Strong Analytical Skills</option>
                <option value="13">Enthusiastic Learner</option>
                <option value="14">Excellent Communication Skills</option>
                <option value="15">Highly Motivated</option>
                <option value="16">Quick Learner</option>
                <option value="17">Effective Probelm Solver</option>
                <option value="18">Strong Leadership Skills</option>
                <option value="19">Detail Oriented</option>
                <option value="20">Strong Work Ethic</option><option value="21">Strong Research Skills</option>
            </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Area Of Improvement <span className="ei-col-red">*</span></label>
          <input name="area_of_improvement_names" type="text" className="form-control" aria-describedby="emailHelp" value={area_of_improvement_names} onChange={(e) => setAreaOfImprovementNames(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Additional Comments <span className="ei-col-red">*</span></label>
          <input name="additional_comments" type="text" className="form-control" aria-describedby="emailHelp" value={additional_comments} onChange={(e) => setAdditionalComments(e.target.value)}/>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        </form>
        </div>
      );
    }
export default Teacher_feedback;