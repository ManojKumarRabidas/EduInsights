// import '../App.css'
// import React, {useState, useEffect} from "react";

// import { useNavigate , Link } from "react-router-dom";
// import Select from 'react-select';
// const HOST = import.meta.env.VITE_HOST
// const PORT = import.meta.env.VITE_PORT



// function Teacher_feedback() {
//   const [semester_of_rating, setSemesterOfRating] = useState("");
//   const [date_of_rating, setDateOfRating] = useState("");
//   const [teacher_name, setTeacherName] = useState("");
//   const [student_name, setStudentName] = useState("");
//   const [student_reg_year, setStudentRegYear] = useState("");
//   const [department, setDepartment] = useState("");
//   const [subject_code, setSubjectCode] = useState("");
//   const [class_participation, setClassParticipation] = useState("");
//   const [homework_or_assignments, setHomeworkOrAssignments] = useState("");
//   const [quality_of_work, setQualityOfWork] = useState("");
//   const [timeliness, setTimeliness] = useState("");
//   const [problem_solving_skills, setProblemSolvingSkills] = useState("");
//   const [behaviour_and_attitude, setBehaviourAndAttitude] = useState("");
//   const [responsibility, setResponsibility] = useState("");
//   const [participation_and_engagement, setParticipationAndEngagement] = useState("");
//   const [group_work, setGroupWork] = useState("");
//   const [overall_student_quality , setOverallStudentQuality ] = useState("");
//   const [strength_names, setStrengthNames] = useState([]);
//   const [area_of_improvement_names, setAreaOfImprovementNames] = useState([]);
//   const [additional_comments, setAdditionalComments] = useState("");
//   const [error, setError] = useState("");
//   const [response, setResponse] = useState("");
//   const [departments, setDepartments] = useState([]);
//   const [subject_codes, setSubjectCodes] = useState([]);
//   const [student_names, setStudentNames] = useState([]);
//   const navigate = useNavigate();

//   const [student_strengths, setStudentStrengths]= useState([]);
//   const [areas_for_improvement,setAreasForImprovement] = useState([])
//   const [years, setYears] = useState([]);

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await fetch(`${HOST}:${PORT}/server/get-departments`);
//         const data = await response.json();
//         console.log(data)
//         if (response.ok)  {
//           setDepartments(data.departments);
//         } else {
//           setError("Failed to load departments.");
//         }
//       } catch (err) {
//         setError("Failed to load departments.");
//       }
//     };

//     const fetchSubjects = async () => {
//       try {
//         const response = await fetch(`${HOST}:${PORT}/server/get-subjects`);
//         const data = await response.json();
//         if (response.ok) {
//           setSubjectCodes(data.subjects);
//         } else {
//           setError("Failed to load subjects.");
//         }
//       } catch (err) {
//         setError("Failed to load subjects.");
//       }
//     };

//     const fetchStudents = async () => {
//       try {
//         const response = await fetch(`${HOST}:${PORT}/server/get-student-names`);
//         const data = await response.json();
//         if (response.ok) {
//           setStudentNames(data.student_names);
//         } else {
//           setError("Failed to load student names.");
//         }
//       } catch (err) {
//         setError("Failed to load student names.");
//       }
//     };

//     const fetchStudentStrengths = async () => {
//       try {
//         const response = await fetch(`${HOST}:${PORT}/server/get-student-strength`);
//         const data = await response.json();
//         if (response.ok) {
//           setStudentStrengths((data.docs).map(item=> ({
//             value:item.name,
//             label:item.name
//           })))
//         } else{
//           setError("Failed to load strengths name.");
//         }
//       } catch(err) {
//         setError("Failed to load strengths name.");
//       }
//     };

//     const fetchStudentImprovementArea = async () => {
//       try {
//         const response = await fetch(`${HOST}:${PORT}/server/get-student-area-of-improvement`);
//         const data = await response.json();
//         if (response.ok) {
//           setAreasForImprovement((data.docs).map(area=> ({
//             value:area.name,
//             label:area.name
//           })))
//         } else{
//           setError("Failed to load strengths name.");
//         }
//       } catch(err) {
//         setError("Failed to load strengths name.");
//       }
//     };

//     const currentYear = new Date().getFullYear();
//     const pastFiftyYears = Array.from({ length: 50 }, (_, index) => currentYear - index);
//     setYears(pastFiftyYears);


//     const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
//     setDateOfRating(today);

//     fetchDepartments();
//     fetchSubjects();
//     fetchStudents();
//     fetchStudentStrengths();
//     fetchStudentImprovementArea();
//   }, []);

//   const handleStrengthChange = (selected) =>{
//     setStrengthNames(selected);
//   }

//   const handleAreaForImprovementChange = (selected) =>{
//     setAreaOfImprovementNames(selected);
//   }


//   const handleSubmit = async (event) => {
//     event.preventDefault();
//       if (!semester_of_rating || !date_of_rating || !teacher_name || !student_name || !student_reg_year || !department || !subject_code || !class_participation || !homework_or_assignments || !quality_of_work || !timeliness || !problem_solving_skills || !behaviour_and_attitude || !responsibility || !participation_and_engagement || !group_work || !overall_student_quality || !strength_names || !area_of_improvement_names ){
//             setError("Please enter all the required values.");
//             return;
//         }
//         const final_strengths = [];
//         for (let i=0; i<(student_strengths).length; i++)
//         {
//           final_strengths.push(student_strengths[i].value)
//         }

//         const final_improvement = [];
//         for (let i=0; i<(areas_for_improvement).length; i++)
//         {
//           final_improvement.push(areas_for_improvement[i].value)
//         }


//         const teacherData = { semester_of_rating, date_of_rating, teacher_name, student_name, student_reg_year,department, subject_code, class_participation, homework_or_assignments, quality_of_work, timeliness, problem_solving_skills, behaviour_and_attitude, responsibility, participation_and_engagement,group_work, overall_student_quality, strength_names:final_strengths, area_of_improvement_names:final_improvement,  additional_comments };
//         const response = await fetch(`${HOST}:${PORT}/server/teacher-feedback`, {
//           method: "POST",
//           body: JSON.stringify(teacherData),
//           headers: {"Content-Type": "application/json"},
//         });
//         if (response){
//           const result = await response.json();
//           console.log(result);
//           if (response.ok){
//             setResponse(result.msg);
//             setError("");
//             navigate("/home")
//             // setDeptId("");
//             // setName("");
//             // navigate("/login");
//           } else{
//             setError(result.msg);
//           }
//         } else{
//           setError("We are unable to process now. Please try again later.")
//         }
//         setTimeout(() => {
//           setResponse("");
//           setError("");
//         }, 3000);
//       };
//       return(
//         <div className="container my-2">
//           {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
//       {response && (<div className="alert alert-success" role="alert">{response}</div>)}
//       <Link to="/"></Link>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//         <label className="form-label">
//          Date Of Rating <span className="ei-col-red">*</span>
//          </label>
//          <input
//         type="date"
//         className="form-control"
//         aria-label="Date of Rating"
//         name="date_of_rating"
//         value={date_of_rating}
//         disabled
//         onChange={(e) => setDateOfRating(e.target.value)}/>
//         </div>

//       <div className="mb-3">
//           <label className="form-label">Semester Of Rating <span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="semester_of_rating" value={semester_of_rating} onChange={(e) => setSemesterOfRating(e.target.value)}>
//                 <option defaultValue>--Select semester_of_rating--</option>
//                 <option value="1">1st sem</option>
//                 <option value="2">2nd sem</option>
//                 <option value="3">3rd sem</option>
//                 <option value="4">4th sem</option>
//                 <option value="5">5th sem</option>
//                 <option value="6">6th sem</option>
//                 <option value="7">7th sem</option>
//                 <option value="8">8th sem</option>
//             </select>
//         </div>





         
//         <div className="mb-3">
//           <label className="form-label">Teacher Name <span className="ei-col-red">*</span></label>
//           <input name="teacher_name" type="text" className="form-control" aria-describedby="emailHelp" value={teacher_name} onChange={(e) => setTeacherName(e.target.value)}/>
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Department <span className="ei-col-red">*</span></label>
//           <select
//             name="department"
//             className="form-control"
//             value={department}
//             onChange={(e) => setDepartment(e.target.value)}
//           >
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept._id} value={dept._id}>
//                 {dept.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-3">
//       <label className="form-label">
//         Student Registration Year<span className="ei-col-red">*</span>
//       </label>
//       <select
//         name="student_reg_year"
//         className="form-control"
//         value={student_reg_year}
//         onChange={(e) => setStudentRegYear(e.target.value)}
//       >
//         <option value="" disabled>
//           Select Year
//         </option>
//         {years.map((year) => (
//           <option key={year} value={year}>
//             {year}
//           </option>
//         ))}
//       </select>
//     </div>

//         <div className="mb-3">
//           <label className="form-label">Student Name <span className="ei-col-red">*</span></label>
//           <select
//             name="student_name"
//             className="form-control"
//             value={student_name}
//             onChange={(e) => setStudentName(e.target.value)}
//           >
//             <option value="">Select Student Name</option>
//             {student_names.map((student) => (
//               <option key={student._id} value={student._id}>
//                 {student.name} - {student.registration_number}
//               </option>
//             ))}
//           </select>
//         </div>





//         <div className="mb-3">
//           <label className="form-label">Subject Code <span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="subject_code" value={subject_code} onChange={(e) => setSubjectCode(e.target.value)}>
//             <option value="">Select Subject Code</option>
//             {subject_codes.map((subject) => (
//               <option key={subject._id} value={subject._id}>
//                 {subject.subject_code}
//               </option>
//             ))}
//             </select>
//         </div>

        
//         <div className="mb-3">
//           <label className="form-label">Class Participation <span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="class_participation" value={class_participation} onChange={(e) => setClassParticipation(e.target.value)}>
//                 <option defaultValue>--Select Your Class Participation--</option>
//                 <option value="5">Always Participates</option>
//                 <option value="4">Oftenly Participates</option>
//                 <option value="3">Sometimes Participates</option>
//                 <option value="2">Rarely Participates</option>
//                 <option value="1">Never Participates</option>
//             </select>
//         </div>


//         <div className="mb-3">
//           <label className="form-label">Homework Or Assignments <span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="homework_or_assignments" value={homework_or_assignments} onChange={(e) => setHomeworkOrAssignments(e.target.value)}>
//                 <option defaultValue>--Homework Or Assignments --</option>
//                 <option value="5">Always Done</option>
//                 <option value="4">Oftenly Done</option>
//                 <option value="3">Sometimes Done</option>
//                 <option value="2">Rarely Done</option>
//                 <option value="1">Never Done</option>
//             </select>
//         </div>


//         <div className="mb-3">
//           <label className="form-label">Quality Of Work<span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="quality_of_work" value={quality_of_work} onChange={(e) => setQualityOfWork(e.target.value)}>
//                 <option defaultValue>--Quality Of Work --</option>
//                 <option value="5">Excellent</option>
//                 <option value="4">Very Good</option>
//                 <option value="3">Good</option>
//                 <option value="2">Fair</option>
//                 <option value="1">Poor</option>
//             </select>
//         </div>


//         <div className="mb-3">
//           <label className="form-label">Timeliness<span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="timeliness" value={timeliness} onChange={(e) => setTimeliness(e.target.value)}>
//                 <option defaultValue>--Timeliness --</option>
//                 <option value="5">Always On Time</option>
//                 <option value="4">Usually On Time</option>
//                 <option value="3">Sometimes Late</option>
//                 <option value="2">Frequently Late</option>
//                 <option value="1">Always Late</option>
//             </select>
//         </div>



//         <div className="mb-3">
//           <label className="form-label">Probelm Solving Skills<span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="probelm_solving_skills" value={problem_solving_skills} onChange={(e) => setProblemSolvingSkills(e.target.value)}>
//                 <option defaultValue>--Probelm Solving Skills --</option>
//                 <option value="5">Excellent</option>
//                 <option value="4">Very Good</option>
//                 <option value="3">Good</option>
//                 <option value="2">Fair</option>
//                 <option value="1">Poor</option>
//             </select>
//         </div>


//         <div className="mb-3">
//           <label className="form-label">Behaviour And Attitude<span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="behaviour_and_attitude" value={behaviour_and_attitude} onChange={(e) => setBehaviourAndAttitude(e.target.value)}>
//                 <option defaultValue>--Behaviour And Attitude --</option>
//                 <option value="5">Excellent</option>
//                 <option value="4">Very Good</option>
//                 <option value="3">Good</option>
//                 <option value="2">Fair</option>
//                 <option value="1">Poor</option>
//             </select>
//         </div>


//         <div className="mb-3">
//           <label className="form-label">Responsibility<span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="responsibility" value={responsibility} onChange={(e) => setResponsibility(e.target.value)}>
//                 <option defaultValue>--Responsibility --</option>
//                 <option value="5">Always Responsible</option>
//                 <option value="4">Usually Responsible</option>
//                 <option value="3">Sometimes Responsible</option>
//                 <option value="2">Frequently Responsible</option>
//                 <option value="1">Always Responsible</option>
//             </select>
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Participation And Engagement<span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="participation_and_engagement" value={participation_and_engagement} onChange={(e) => setParticipationAndEngagement(e.target.value)}>
//                 <option defaultValue>--Participation And Engagement --</option>
//                 <option value="5">Excellent</option>
//                 <option value="4">Very Good</option>
//                 <option value="3">Good</option>
//                 <option value="2">Fair</option>
//                 <option value="1">Poor</option>
//             </select>
//         </div>



//         <div className="mb-3">
//           <label className="form-label">Group Work <span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="group_work" value={group_work} onChange={(e) => setGroupWork(e.target.value)}>
//                 <option defaultValue>--Select Group Work--</option>
//                 <option value="5">Always Participates</option>
//                 <option value="4">Oftenly Participates</option>
//                 <option value="3">Sometimes Participates</option>
//                 <option value="2">Rarely Participates</option>
//                 <option value="1">Never Participates</option>
//             </select>
//         </div>


//         <div className="mb-3">
//           <label className="form-label">Overall Student Quality<span className="ei-col-red">*</span></label>
//             <select className="form-select" aria-label="Default select example" name="overall_student_quality" value={overall_student_quality} onChange={(e) => setOverallStudentQuality(e.target.value)}>
//                 <option defaultValue>--Overall Student Quality --</option>
//                 <option value="5">Very Satisfied</option>
//                 <option value="4">Satisfied</option>
//                 <option value="3">Neutral</option>
//                 <option value="2">Dissatisfied</option>
//                 <option value="1">Out Of Control</option>
//             </select>
//         </div>


//         <div className="mb-3">
//           <label htmlFor="strength_of_student">Strengths</label>
//           <Select
//               isMulti
//               options={student_strengths}
//               className="basic-multi-select"
//               classNamePrefix="select"
//               onChange={handleStrengthChange}
//               value={strength_names}
//             />
//         </div>


//         <div className="mb-3">
//           <label htmlFor="area_of_improvements">Area Of Improvement</label>
//           <Select
//               isMulti
//               options={areas_for_improvement}
//               className="basic-multi-select"
//               classNamePrefix="select"
//               onChange={handleAreaForImprovementChange}
//               value={area_of_improvement_names}
//             />
//         </div>


//         <div className="mb-3">
//           <label className="form-label">Additional Comments </label>
//           <input name="additional_comments" type="text" className="form-control" aria-describedby="emailHelp" value={additional_comments} onChange={(e) => setAdditionalComments(e.target.value)}/>
//         </div>
//         <button type="submit" className="btn btn-primary">Save</button>
//         </form>
//         </div>
//       );
//     }
// export default Teacher_feedback;


import '../App.css'
import React, {useState, useEffect} from "react";

import { useNavigate , Link } from "react-router-dom";
import Select from 'react-select';
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT



function TeacherFeedback() {
  const [semester_of_rating, setSemesterOfRating] = useState("");
  const [date_of_rating, setDateOfRating] = useState("");
  const [teacher_name, setTeacherName] = useState("");
  const [student_name, setStudentName] = useState("");
  const [student_reg_year, setStudentRegYear] = useState("");
  const [department, setDepartment] = useState("");
  const [subject_code, setSubjectCode] = useState([]);
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
  const [strength_names, setStrengthNames] = useState([]);
  const [area_of_improvement_names, setAreaOfImprovementNames] = useState([]);
  const [additional_comments, setAdditionalComments] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [departments, setDepartments] = useState([]);
  const [subject_codes, setSubjectCodes] = useState([]);
  const [subject_names, setSubjectNames] = useState([]);
  const [student_names, setStudentNames] = useState([]);
  const navigate = useNavigate();

  const [student_strengths, setStudentStrengths]= useState([]);
  const [areas_for_improvement,setAreasForImprovement] = useState([])
  const [years, setYears] = useState([]);

  

  
  

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-departments`);
        const data = await response.json();
        console.log(data)
        if (response.ok)  {
          setDepartments(data.departments);
        } else {
          setError("Failed to load departments.");
        }
      } catch (err) {
        setError("Failed to load departments.");
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-subjects`);
        const data = await response.json();
        if (response.ok) {
          setSubjectCodes(data.subjects);
        } else {
          setError("Failed to load subjects.");
        }
      } catch (err) {
        setError("Failed to load subjects.");
      }
    };

    const fetchStudentsOld = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-student-names`);
        const data = await response.json();
        if (response.ok) {
          setStudentNames(data.student_names);
        } else {
          setError("Failed to load student names.");
        }
      } catch (err) {
        setError("Failed to load student names.");
      }
    };

    const fetchStudentStrengths = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-student-strength`);
        const data = await response.json();
        if (response.ok) {
          setStudentStrengths((data.docs).map(item=> ({
            value:item.name,
            label:item.name
          })))
        } else{
          setError("Failed to load strengths name.");
        }
      } catch(err) {
        setError("Failed to load strengths name.");
      }
    };

    const fetchStudentImprovementArea = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-student-area-of-improvement`);
        const data = await response.json();
        if (response.ok) {
          setAreasForImprovement((data.docs).map(area=> ({
            value:area.name,
            label:area.name
          })))
        } else{
          setError("Failed to load strengths name.");
        }
      } catch(err) {
        setError("Failed to load strengths name.");
      }
    };

    const fetchSubjectNames =async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-subject-name`);
        const data = await response.json();
        if (response.ok) {
          setSubjectNames((data.docs).map(subject=> ({
            value:subject.name,
            label:subject.name
          })))
        } else{
          setError("Failed to load subjects name.");
        }
      } catch(err) {
        setError("Failed to load subjects name.");
      }
    };

    

    const currentYear = new Date().getFullYear();
    const pastFiftyYears = Array.from({ length: 50 }, (_, index) => currentYear - index);
    setYears(pastFiftyYears);


    const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    setDateOfRating(today);

    fetchDepartments();
    fetchSubjects();
    // fetchStudentsOld();
    fetchStudentStrengths();
    fetchStudentImprovementArea();
    fetchSubjectNames();
  }, []);

  const handleStrengthChange = (selected) =>{
    setStrengthNames(selected);
  }

  const handleAreaForImprovementChange = (selected) =>{
    setAreaOfImprovementNames(selected);
  }
  const fetchStudents = async (student_reg_year, department) => {
    try {
      const payload = {student_reg_year:student_reg_year, department:department }
      // const response = await fetch(`${HOST}:${PORT}/server/get-student-names`);
      const response = await fetch(`${HOST}:${PORT}/server/get-student-names`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setStudentNames(data.student_names);
        } else {
          setError(result.msg);
        }
      } else {
        setError("We are unable to process now. Please try again later.");
      }
    } catch (err) {
      setError("Failed to load student names.");
    }
  };

  const setStudentList =(value, type) =>{
    console.log(value, type, student_reg_year, department );
    if (type=="REGYEAR"){
      setStudentRegYear(value)
    } else if (type=="DEPARTMENT"){
      setDepartment(value)
    }
    setTimeout(() => {
      console.log("abcd",student_reg_year,department)
    }, 5000);
    if(student_reg_year && department){
      fetchStudents(student_reg_year,department);
    }
       
  }

  

  


  const handleSubmit = async (event) => {
    event.preventDefault();
      if (!semester_of_rating || !date_of_rating || !teacher_name || !student_name || !student_reg_year || !department || !subject_code || !class_participation || !homework_or_assignments || !quality_of_work || !timeliness || !problem_solving_skills || !behaviour_and_attitude || !responsibility || !participation_and_engagement || !group_work || !overall_student_quality || !strength_names || !area_of_improvement_names ){
            setError("Please enter all the required values.");
            return;
        }
        const final_strengths = [];
        for (let i=0; i<(student_strengths).length; i++)
        {
          final_strengths.push(student_strengths[i].value)
        }

        const final_improvement = [];
        for (let i=0; i<(areas_for_improvement).length; i++)
        {
          final_improvement.push(areas_for_improvement[i].value)
        }

        const final_subject_name = [];
        for (let i=0; i<(subject_names).length; i++){
          final_subject_name.push(subject_names[i].value)
        }

        const teacherData = { semester_of_rating, date_of_rating, teacher_name, student_name, student_reg_year,department, subject_code, class_participation, homework_or_assignments, quality_of_work, timeliness, problem_solving_skills, behaviour_and_attitude, responsibility, participation_and_engagement,group_work, overall_student_quality, strength_names:final_strengths, area_of_improvement_names:final_improvement,  additional_comments,subject_names: final_subject_name };
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
            navigate("/home")
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
      <div className='row'>
        <div className=" col mb-3">
        <label className="form-label">
         Date Of Rating <span className="ei-col-red">*</span>
         </label>
         <input
        type="date"
        className="form-control"
        aria-label="Date of Rating"
        name="date_of_rating"
        value={date_of_rating}
        disabled
        onChange={(e) => setDateOfRating(e.target.value)}/>
        </div>

      <div className="col mb-3">
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





         
        <div className="col mb-3">
          <label className="form-label">Teacher Name <span className="ei-col-red">*</span></label>
          <input name="teacher_name" type="text" className="form-control" aria-describedby="emailHelp" value={teacher_name} onChange={(e) => setTeacherName(e.target.value)}/>
        </div>
        </div>
        
        <div className='row'>
        <div className=" col mb-3">
      <label className="form-label">
        Student Registration Year<span className="ei-col-red">*</span>
      </label>
      <select
        name="student_reg_year"
        className="form-control"
        value={student_reg_year}
        // onChange={(e) => setStudentRegYear(e.target.value)}
        onChange={(e) => setStudentList(e.target.value, "REGYEAR")}
      >
        <option value="" disabled>
          Select Year
        </option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
        <div className="col mb-3">
          <label className="form-label">Department <span className="ei-col-red">*</span></label>
          <select
            name="department"
            className="form-control"
            value={department}
            // onChange={(e) => setDepartment(e.target.value)}
            onChange={(e) => setStudentList(e.target.value, "DEPARTMENT")}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>


        <div className="col mb-3">
          <label className="form-label">Student Name <span className="ei-col-red">*</span></label>
          <select
            name="student_name"
            className="form-control"
            value={student_name}
            onChange={(e) => setStudentName(e.target.value)}
          >
            <option value="">Select Student Name</option>
            {student_names.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} - {student.registration_number}
              </option>
            ))}
          </select>
        </div>
        </div>
        <div className='row'>
        <div className="col mb-3">
          <label className="form-label">Subject Code <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="subject_code" value={subject_code} onChange={(e) => setSubjectCode(e.target.value)}>
            <option value="">Select Subject Code</option>
            {subject_codes.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.subject_code} - {subject.name}
              </option>
            ))}
            </select>
        </div>

        
        <div className="col mb-3">
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


        <div className="col mb-3">
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
        </div>

        <div className='row'>
        <div className="col mb-3">
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


        <div className="col mb-3">
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



        <div className="col mb-3">
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
        </div>

        <div className='row'>
        <div className="col mb-3">
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


        <div className="col mb-3">
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

        <div className="col mb-3">
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
        </div>


        <div className='row'>
        <div className="col mb-3">
        
          <label className="form-label">Group Work <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="group_work" value={group_work} onChange={(e) => setGroupWork(e.target.value)}>
                <option defaultValue>--Select Group Work--</option>
               
                <option defaultValue>--Select Group Work--</option>
                <option value="5" >Always Participates</option>
                <option value="4" >Oftenly Participates</option>
                <option value="3" >Sometimes Participates</option>
                <option value="2" >Rarely Participates</option>
                <option value="1" >Never Participates</option>
              
            </select>
            
            </div>
        


        <div className="col mb-3">
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
        </div>


        <div className="mb-3">
          <label htmlFor="strength_of_student" className='form-label'>Strengths<span className="ei-col-red">*</span></label>
          <Select
              isMulti
              options={student_strengths}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleStrengthChange}
              value={strength_names}
              
            />
                 
    <div/>
        </div>


        <div className="mb-3">
          <label htmlFor="area_of_improvements" className='form-label'>Area Of Improvement<span className="ei-col-red">*</span></label>
          <Select
              isMulti
              options={areas_for_improvement}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleAreaForImprovementChange}
              value={area_of_improvement_names}
            />
        </div>


        <div className="mb-3">
          <label className="form-label">Additional Comments </label>
          <textarea name="additional_comments" type="text" className="form-control" aria-describedby="emailHelp" value={additional_comments} onChange={(e) => setAdditionalComments(e.target.value)}/>
        </div>
        
        <button type="submit" className="btn btn-primary">Save</button>

         <button type="reset" className="btn btn-primary m-2" onClick={() => clearForm()}>Clear</button>
        </form>
        </div>
        
      );
    }
export default TeacherFeedback;