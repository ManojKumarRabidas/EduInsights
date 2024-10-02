import '../App.css'
import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
import toastr from 'toastr';
const token = sessionStorage.getItem('token');
function Student_feedback() {
  const [month_of_rating, setMonthOfRating] = useState("");
  const [date_of_rating, setDateOfRating] = useState("");
  const [teacher_code, setTeacherCode] = useState("");
  const [subject_code, setSubjectCode] = useState("");
  const [student_name, setStudentName] = useState("");
  const [clarity_of_explanation, setClarityOfExplanation] = useState("");
  const [subject_knowledge, setSubjectKnowledge] = useState("");
  const [encouragement_of_question, setEncouragementOfQuestion] = useState("");
  const [maintains_discipline, setMaintainsDiscipline] = useState("");
  const [fairness_in_treatment, setFairnessInTreatment] = useState("");
  const [approachability, setApproachability] = useState("");
  const [behaviour_and_attitude, setBehaviourAndAttitude] = useState("");
  const [encouragement_and_support, setEncouragementAndSupport] = useState("");
  const [overall_teaching_quality, setOverallTeachingQuality] = useState("");
  const [provide_study_material, setProvideStudyMaterial] = useState("");
  const [explain_with_supportive_analogy, setExplainWithSupportiveAnalogy] = useState("");
  const [use_of_media , setUseOfMedia] = useState("");
  const [additional_comments, setAdditionalComments] = useState("");
  const [subjects, setSubjectsCode] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [areas_of_improvement, setImprovementArea] = useState([]);
  const [anonymous, setAnonymous] = useState(false);
  const navigate = useNavigate();

  const [strengths_options, setStrengthOptions] = useState([]);
  const [areas_for_improvements_options, setAreasForImprovementsOptions] = useState([]);
  
  const [customStrength, setCustomStrength] = useState(""); // New state for custom strength
  const [customImprovement, setCustomImprovement] = useState(""); // New state for custom improvement
  const [custom_strengths_options, setCustomStrengthOptions] = useState([]);
  const [custom_areas_for_improvements_options, setCustomAreasForImprovementsOptions] = useState([]);
  // const userId = sessionStorage.getItem("eiUserId")

    useEffect(() => {
      
    const userName = sessionStorage.getItem("eiUserName")
    setStudentName(userName) 
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const month_of_rating = `${currentMonth} ${currentYear}`;
    setMonthOfRating(month_of_rating);

    const today = new Date().toISOString().split('T')[0];
    setDateOfRating(today);
      
    const fetchSubjectsCode = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-conditional-subjects-code/`, {
          method: "GET",
          headers: {'authorization': `Bearer ${token}`},
        });
  
        if (response) {
          const result = await response.json();
          if (response.ok) {
            setSubjectsCode(result.subjects);
          } else {
            toastr.error(result.msg);
          }
        } else {
          toastr.error("We are unable to process now. Please try again later.");
        }
      } catch (error) {
        toastr.error("We are unable to process now. Please try again later.");
      }
    };

    const fetchTeacherCode = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-teacher-code`);
        const data = await response.json();
        if (response.ok) {
          setTeachers(data.teachers);
        } else {
          toastr.error("Failed to load departments.");
        }
      } catch (err) {
        toastr.error("Failed to load departments.");
      }
    };

    const fetchStrengthName = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-strength-name`);
        const data = await response.json();
        if (response.ok) {
          const options = data.docs.map(item => ({ value: item.name, label: item.name }));
          setStrengthOptions([...options, { value: 'Other', label: 'Other' }]);
        } else {
          toastr.error("Failed to load strengths name.");
        }
      } catch (err) {
        toastr.error("Failed to load strengths name.");
      }
    };

    const fetchImprovementArea = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-improvement-area`);
        const data = await response.json();
        if (response.ok) {
          const options = data.improvementarea.map(item => ({ value: item.name, label: item.name }));
          setAreasForImprovementsOptions([...options, { value: 'Other', label: 'Other' }]);
        } else {
          toastr.error("Failed to load area of improvement.");
        }
      } catch (err) {
        toastr.error("Failed to load area of improvement.");
      }
    };

    fetchSubjectsCode();
    fetchTeacherCode();
    fetchStrengthName();
    fetchImprovementArea();
  }, []);
  
  const handleStrengthChange = (selected) => {
    setStrengths(selected);
  };

  const handleAreasForImprovementChange = (selected) => {
    setImprovementArea(selected);
  };


  const handleAddCustomStrength = () => {
    if (customStrength && !strengths.some(s => s.value === customStrength)) {
      setStrengths([...strengths, { value: customStrength, label: customStrength }]);
      setCustomStrengthOptions([...custom_strengths_options, { name: customStrength, strength_for: "TEACHER", active: 1 }]);
      setCustomStrength("");
    }
  };

  const handleAddCustomImprovement = () => {
    if (customImprovement && !areas_of_improvement.some(i => i.value === customImprovement)) {
      setImprovementArea([...areas_of_improvement, { value: customImprovement, label: customImprovement }]);
      setCustomAreasForImprovementsOptions([...custom_areas_for_improvements_options, { name: customImprovement, area_for: "TEACHER", active: 1 }]);
      setCustomImprovement("");
    }
  };

  const handleClear = () => {
    setTeacherCode("");
    setSubjectCode("");
    setClarityOfExplanation("");
    setSubjectKnowledge("");
    setEncouragementOfQuestion("");
    setMaintainsDiscipline("");
    setFairnessInTreatment("");
    setApproachability("");
    setBehaviourAndAttitude("");
    setEncouragementAndSupport("");
    setOverallTeachingQuality("");
    setProvideStudyMaterial("");
    setExplainWithSupportiveAnalogy("");
    setUseOfMedia("");
    setStrengths([]);
    setImprovementArea([]);
    setAdditionalComments("");
    setAnonymous(false);
  }; 

  const handleSubmit = async (event) => {
    event.preventDefault();
      if (!month_of_rating || !date_of_rating || !teacher_code || !subject_code || !clarity_of_explanation || !subject_knowledge || !encouragement_of_question || !maintains_discipline || !fairness_in_treatment || !approachability || !behaviour_and_attitude || !encouragement_and_support || !overall_teaching_quality || !provide_study_material || !explain_with_supportive_analogy || !use_of_media || strengths.length === 0 ||  areas_of_improvement.length === 0){
            toastr.error("Please enter all the required values.");
            return;
        }

        const final_strengths = strengths.filter(item => item.value.toLowerCase() !== "other").map(item => item.value);
        const final_AreasForImprovements = areas_of_improvement.filter(item => item.value.toLowerCase() !== "other").map(item => item.value);



        const studentData = { month_of_rating, date_of_rating, teacher_code, subject_code, anonymous, clarity_of_explanation, subject_knowledge, encouragement_of_question, maintains_discipline, fairness_in_treatment, approachability, behaviour_and_attitude, encouragement_and_support, overall_teaching_quality, provide_study_material,explain_with_supportive_analogy, use_of_media, strengths: final_strengths, areas_of_improvement:final_AreasForImprovements,  additional_comments};
        const response = await fetch(`${HOST}:${PORT}/server/student-feedback`, {
          method: "POST",
          body: JSON.stringify(studentData),
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
        });
        if (response){
          const result = await response.json();
          if (response.ok){
            if (custom_strengths_options.length>0) {
              await fetch(`${HOST}:${PORT}/server/strength-create`, {
                method: "POST",
                body: JSON.stringify(custom_strengths_options),
                headers: {
                  'Content-Type': 'application/json',
                  'authorization': `Bearer ${token}`,
                },
              });
            }
            
        
            if (custom_areas_for_improvements_options.length>0) {
              await fetch(`${HOST}:${PORT}/server/area-of-improvement-create`, {
                method: "POST",
                body: JSON.stringify(custom_areas_for_improvements_options),
                headers: {
                  'Content-Type': 'application/json',
                  'authorization': `Bearer ${token}`,
                }
              });
            }
            toastr.success(result.msg);
            navigate("/home");
          } else{
            toastr.error(result.msg);
          }
        } else{
          toastr.error("We are unable to process now. Please try again later.")
        }
      };


      return(
        <div className="container my-2">
        <form onSubmit={handleSubmit}>
        <h4 className='my-4'>Rate your teachers here. For guide and more clarity about giving feedback please visit "User Manual".</h4>
        <hr />
        <div className="row">
          <div className="col mb-3 ">
            <label className='form-label' htmlFor="dateOfRating">Date of Rating</label>
            <input type="date" className="form-control" id="dateOfRating" value={date_of_rating} disabled/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Month Of Rating <span className="ei-col-red">*</span></label>
            <input
              type="text"
              className="form-control"
              value={month_of_rating}
              disabled
            />
          </div>
          <div className="col mb-3">
            <label className="form-label"> Student Name <span className="ei-col-red">*</span></label>
            <input disabled name="student_name" type="text" className="form-control" aria-describedby="emailHelp" value={student_name} onChange={(e) => setStudentName(e.target.value)}/>
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Teacher Code <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="teacher_code" value={teacher_code} onChange={(e) => setTeacherCode(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  {teachers.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.teacher_code}
                </option>
              ))}
              </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">Subject Code <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="subject_code" value={subject_code} onChange={(e) => setSubjectCode(e.target.value)}>
              <option value="">--Select--</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subject_code} - {subject.name}
                </option>
              ))}
              </select>
          </div>
          <div className="col mb-3 form-switch" style={{paddingLeft: "0"}}>
            <label className="form-label">Do you want to be anonymous? Turn on if "Yes". </label>
            <div>
              <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)}/>
              <label className="form-check-label mx-3" htmlFor="activeSwitch"></label>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Clarity Of Explanation <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="clarity_of_explanation" value={clarity_of_explanation} onChange={(e) => setClarityOfExplanation(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  <option value="5">Very Clear</option>
                  <option value="4">Clear</option>
                  <option value="3">Neutral</option>
                  <option value="2">Somewhat Unclear</option>
                  <option value="1">Very Unclear</option>
              </select>
          </div>        
          <div className="col mb-3">
            <label className="form-label">Subject Knowledge <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="subject_knowledge" value={subject_knowledge} onChange={(e) => setSubjectKnowledge(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  <option value="5">Excellent</option>
                  <option value="4"> Very Good </option>
                  <option value="3">Good</option>
                  <option value="2">Fair</option>
                  <option value="1">Poor</option>
              </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">Encouragement Of Question <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="encouragement_of_question" value={encouragement_of_question} onChange={(e) => setEncouragementOfQuestion(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  <option value="5"> Very engaging </option>
                  <option value="4">Often engaging </option>
                  <option value="3">Sometimes engaging</option>
                  <option value="2">Rarely engaging </option>
                  <option value="1">Not engaging </option>
              </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">Maintains Discipline <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="maintains_discipline" value={maintains_discipline} onChange={(e) => setMaintainsDiscipline(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  <option value="5">Excellent</option>
                  <option value="4">Very Good</option>
                  <option value="3">Good</option>
                  <option value="2">Fair</option>
                  <option value="1">Poor</option>
              </select>
          </div>
        </div>

        <div className="row"> 
          <div className="col mb-3">
            <label className="form-label">Fairness In Treatment <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="fairness_in_treatment" value={fairness_in_treatment} onChange={(e) => setFairnessInTreatment(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  <option value="5">Very fair </option>
                  <option value="4"> Fair</option>
                  <option value="3">Neutral </option>
                  <option value="2">Somewhat unfair </option>
                  <option value="1">Very unfair</option>
              </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">Approachability <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="approachability" value={approachability} onChange={(e) => setApproachability(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  <option value="5">Excellent</option>
                  <option value="4">Very Good</option>
                  <option value="3">Good</option>
                  <option value="2">Fair</option>
                  <option value="1">Poor</option>
              </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">Behaviour And Attitude <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="behaviour_and_attitude" value={behaviour_and_attitude} onChange={(e) => setBehaviourAndAttitude(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  <option value="5">Very respectful </option>
                  <option value="4">Respectful</option>
                  <option value="3">Neutral</option>
                  <option value="2">Somewhat disrespectful </option>
                  <option value="1"> Very disrespectful </option>
              </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">Encouragement And Support <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="encouragement_and_support" value={encouragement_and_support} onChange={(e) => setEncouragementAndSupport(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  <option value="5">Always encourages </option>
                  <option value="4">Often encourages </option>
                  <option value="3">Sometimes encourages </option>
                  <option value="2">Rarely encourages </option>
                  <option value="1">Never encourages</option>
              </select>
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Use Of Media (audio, video, ppt) <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="use_of_media" value={use_of_media} onChange={(e) => setUseOfMedia(e.target.value)}>
                  <option defaultValue>--Select --</option>
                  <option value="5">Always </option>
                  <option value="4">Often</option>
                  <option value="3">Sometimes</option>
                  <option value="2">Rarely</option>
                  <option value="1">Never</option>
              </select>
          </div> 
          <div className="col mb-3">
            <label className="form-label">Provide Study Material <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="provide_study_material" value={provide_study_material} onChange={(e) => setProvideStudyMaterial(e.target.value)}>
                  <option defaultValue>--Select --</option>
                  <option value="5">Always </option>
                  <option value="4">Often</option>
                  <option value="3">Sometimes</option>
                  <option value="2">Rarely</option>
                  <option value="1">Never</option>
              </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">Explain With Supportive Analogy <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="explain_with_supportive_analogy" value={explain_with_supportive_analogy} onChange={(e) => setExplainWithSupportiveAnalogy(e.target.value)}>
                  <option defaultValue>--Select --</option>
                  <option value="5">Always </option>
                  <option value="4">Often</option>
                  <option value="3">Sometimes</option>
                  <option value="2">Rarely</option>
                  <option value="1">Never</option>
              </select>
          </div>  
          <div className="col mb-3">
            <label className="form-label">Overall Teaching Quality <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="overall_teaching_quality" value={overall_teaching_quality} onChange={(e) => setOverallTeachingQuality(e.target.value)}>
                  <option defaultValue>--Select--</option>
                  <option value="5">Very satisfied </option>
                  <option value="4">Satisfied</option>
                  <option value="3">Neutral</option>
                  <option value="2">Somewhat dissatisfied </option>
                  <option value="1">Very dissatisfied </option>
              </select>
          </div>
        </div>

        <hr />
        <div className="mb-3 row">
          <div className="col">
            <label>Strengths <span className="ei-col-red">*</span></label>
            <Select isMulti options={strengths_options} value={strengths} onChange={handleStrengthChange}/>
          </div>
        {strengths.some(s => s.value === "Other") && (
          <div className="col">
            <label htmlFor=""></label>
            <div className="row">
              <div className="col-10 d-flex justify-content-start align-items-center"><input type="text" className="form-control" placeholder="Enter custom strength" value={customStrength} onChange={(e) => setCustomStrength(e.target.value)}/></div>
              <div className="col-2 d-flex justify-content-end align-items-center"><button type="button" className="btn btn-primary" onClick={handleAddCustomStrength}>Add </button></div>
            </div>
          </div>
        )}
      </div>

      {/* Areas for Improvement Section */}
      <div className="mb-3 row">
        <div className="col">
          <label>Areas for Improvement <span className="ei-col-red">*</span></label>
          <Select isMulti options={areas_for_improvements_options} value={areas_of_improvement} onChange={handleAreasForImprovementChange}/>
        </div>
        {areas_of_improvement.some(a => a.value === "Other") && (
        <div className="col">
          <label htmlFor=""></label>
          <div className="row">
            <div className="col-10 d-flex justify-content-start align-items-center"><input type="text" className="form-control" placeholder="Enter custom improvement" value={customImprovement} onChange={(e) => setCustomImprovement(e.target.value)}/></div>
            <div className="col-2 d-flex justify-content-end align-items-center"><button type="button" className="btn btn-primary" onClick={handleAddCustomImprovement}> Add </button></div>
          </div>
        </div>
        )}
      </div>

        <div className="mb-3">
          <label className="form-label">Additional Comments </label>
          <textarea  name="additional_comments" type="text" className="form-control" aria-describedby="emailHelp" value={additional_comments} onChange={(e) => setAdditionalComments(e.target.value)}></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-primary ms-4" onClick={handleClear}>Clear</button>
        
        
        </form>
        </div>
      );
    }
export default Student_feedback;