import "../App.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
import toastr from "toastr";
const token = sessionStorage.getItem("token");
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
  const [participation_and_engagement, setParticipationAndEngagement] =
    useState("");
  const [group_work, setGroupWork] = useState("");
  const [overall_student_quality, setOverallStudentQuality] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [areas_of_improvement, setImprovementArea] = useState([]);
  const [additional_comments, setAdditionalComments] = useState("");
  const [departments, setDepartments] = useState([]);
  const [subject_codes, setSubjectCodes] = useState([]);
  // const [subject_names, setSubjectNames] = useState([]);
  const [student_names, setStudentNames] = useState([]);
  const [years, setYears] = useState([]);
  const navigate = useNavigate();

  const [strengths_options, setStrengthOptions] = useState([]);
  const [areas_for_improvements_options, setAreasForImprovementsOptions] =
    useState([]);

  const [customStrength, setCustomStrength] = useState(""); // New state for custom strength
  const [customImprovement, setCustomImprovement] = useState(""); // New state for custom improvement
  const [custom_strengths_options, setCustomStrengthOptions] = useState([]);
  const [
    custom_areas_for_improvements_options,
    setCustomAreasForImprovementsOptions,
  ] = useState([]);

  useEffect(() => {
    const userName = sessionStorage.getItem("eiUserName");
    setTeacherName(userName);
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/get-departments`);
        const data = await response.json();
        if (response.ok) {
          setDepartments(data.departments);
        } else {
          toastr.error("Failed to load departments.");
        }
      } catch (err) {
        toastr.error("Failed to load departments.");
      }
    };

    const fetchStudentStrengths = async () => {
      try {
        const response = await fetch(
          `${HOST}:${PORT}/server/get-strength-name`
        );
        const data = await response.json();
        if (response.ok) {
          const options = data.docs.map((item) => ({
            value: item.name,
            label: item.name,
          }));
          setStrengthOptions([...options, { value: "Other", label: "Other" }]);
        } else {
          toastr.error("Failed to load strengths name.");
        }
      } catch (err) {
        toastr.error("Failed to load strengths name.");
      }
    };

    const fetchStudentImprovementArea = async () => {
      try {
        const response = await fetch(
          `${HOST}:${PORT}/server/get-improvement-area`
        );
        const data = await response.json();
        if (response.ok) {
          const options = data.improvementarea.map((item) => ({
            value: item.name,
            label: item.name,
          }));
          setAreasForImprovementsOptions([
            ...options,
            { value: "Other", label: "Other" },
          ]);
        } else {
          toastr.error("Failed to load area of improvement.");
        }
      } catch (err) {
        toastr.error("Failed to load area of improvement.");
      }
    };

    const currentYear = new Date().getFullYear();
    const pastFiftyYears = Array.from(
      { length: 50 },
      (_, index) => currentYear - index
    );
    setYears(pastFiftyYears);
    const today = new Date().toISOString().split("T")[0];
    setDateOfRating(today);

    fetchDepartments();
    // fetchSubjects();
    fetchStudentStrengths();
    fetchStudentImprovementArea();
    // fetchSubjectNames();
  }, []);

  const handleStrengthChange = (selected) => {
    setStrengths(selected);
  };

  const handleAreaForImprovementChange = (selected) => {
    setImprovementArea(selected);
  };

  const fetchStudents = async (student_reg_year, department) => {
    try {
      const payload = {
        registration_year: student_reg_year,
        department: department,
      };
      const response = await fetch(`${HOST}:${PORT}/server/get-student-names`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setStudentNames(result.docs);
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (err) {
      toastr.error("Failed to load student names.");
    }
  };
  const getSemesterOfRating = async (registration_year, department) => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/server/get-semester-of-rating`,
        {
          method: "PATCH",
          body: JSON.stringify({ registration_year: registration_year,department: department }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response) {
        const result = await response.json();
        if (response.ok) {
          console.log(result.doc)
          if(!result.status){
            toastr.warning(result.msg)
          }else{
            setSemesterOfRating(result.doc.semester)
          }
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (err) {
      toastr.error("Failed to get semester of rating.");
    }
  };

  const changeRegYearAndDept = (value, type) => {
    let newRegYear = student_reg_year;
    let newDepartment = department;

    if (type === "REGYEAR") {
      newRegYear = value;
      setStudentRegYear(value);
    } else if (type === "DEPARTMENT") {
      newDepartment = value;
      setDepartment(value);
      if(value){
        fetchSubjects(value);
      }
    }

    if (newRegYear && newDepartment) {
      console.log(newRegYear, newDepartment);
      
      getSemesterOfRating(newRegYear, newDepartment);
      fetchStudents(newRegYear, newDepartment);
    }
  };

  const fetchSubjects = async (department) => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/server/get-conditional-subjects`,
        {
          method: "PATCH",
          body: JSON.stringify({ department: department }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response) {
        const result = await response.json();
        if (response.ok) {
          setSubjectCodes(result.docs);
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (err) {
      toastr.error("Failed to load subjects.");
    }
  };

  const handleAddCustomStrength = () => {
    if (customStrength && !strengths.some((s) => s.value === customStrength)) {
      setStrengths([
        ...strengths,
        { value: customStrength, label: customStrength },
      ]);
      setCustomStrengthOptions([
        ...custom_strengths_options,
        { name: customStrength, strength_for: "TEACHER", active: 1 },
      ]);
      setCustomStrength("");
    }
  };

  const handleAddCustomImprovement = () => {
    if (
      customImprovement &&
      !areas_of_improvement.some((i) => i.value === customImprovement)
    ) {
      setImprovementArea([
        ...areas_of_improvement,
        { value: customImprovement, label: customImprovement },
      ]);
      setCustomAreasForImprovementsOptions([
        ...custom_areas_for_improvements_options,
        { name: customImprovement, area_for: "TEACHER", active: 1 },
      ]);
      setCustomImprovement("");
    }
  };

  const handleClear = () => {
    setSemesterOfRating("");
    setStudentName("");
    setStudentRegYear("");
    setDepartment("");
    setSubjectCode("");
    setClassParticipation("");
    setHomeworkOrAssignments("");
    setQualityOfWork("");
    setTimeliness("");
    setProblemSolvingSkills("");
    setBehaviourAndAttitude("");
    setResponsibility("");
    setParticipationAndEngagement("");
    setGroupWork("");
    setOverallStudentQuality("");
    setStrengths([]);
    setImprovementArea([]);
    setAdditionalComments("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !semester_of_rating ||
      !date_of_rating ||
      !teacher_name ||
      !student_name ||
      !student_reg_year ||
      !department ||
      !subject_code ||
      !class_participation ||
      !homework_or_assignments ||
      !quality_of_work ||
      !timeliness ||
      !problem_solving_skills ||
      !behaviour_and_attitude ||
      !responsibility ||
      !participation_and_engagement ||
      !group_work ||
      !overall_student_quality ||
      strengths.length == 0 ||
      areas_of_improvement.length == 0
    ) {
      toastr.error("Please enter all the required values.");
      return;
    }
    const final_strengths = strengths
      .filter((item) => item.value.toLowerCase() !== "other")
      .map((item) => item.value);
    const final_AreasForImprovements = areas_of_improvement
      .filter((item) => item.value.toLowerCase() !== "other")
      .map((item) => item.value);

    const teacherData = {
      semester_of_rating,
      date_of_rating,
      student_name,
      student_reg_year,
      department,
      subject_code,
      class_participation,
      homework_or_assignments,
      quality_of_work,
      timeliness,
      problem_solving_skills,
      behaviour_and_attitude,
      responsibility,
      participation_and_engagement,
      group_work,
      overall_student_quality,
      strengths: final_strengths,
      areas_of_improvement: final_AreasForImprovements,
      additional_comments,
    };
    const response = await fetch(`${HOST}:${PORT}/server/teacher-feedback`, {
      method: "POST",
      body: JSON.stringify(teacherData),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      const result = await response.json();
      if (response.ok) {
        if (custom_strengths_options.length > 0) {
          await fetch(`${HOST}:${PORT}/server/strength-create`, {
            method: "POST",
            body: JSON.stringify(custom_strengths_options),
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          });
        }

        if (custom_areas_for_improvements_options.length > 0) {
          await fetch(`${HOST}:${PORT}/server/area-of-improvement-create`, {
            method: "POST",
            body: JSON.stringify(custom_areas_for_improvements_options),
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          });
        }
        toastr.success("Feedback submited successfully.");
        // navigate("/home");
        handleClear();
      } else {
        toastr.error(result.msg);
      }
    } else {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  return (
    <div className="container my-2">
      <form onSubmit={handleSubmit}>
        <h4 className="my-4">
          Rate your students here. For guide and more clarity about giving
          feedback please visit "User Manual".
        </h4>
        <hr />
        <div className="row">
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
              onChange={(e) => setDateOfRating(e.target.value)}
            />
          </div>
          <div className="col mb-3">
            <label className="form-label">
              Teacher Name <span className="ei-col-red">*</span>
            </label>
            <input
              name="teacher_name"
              type="text"
              disabled
              className="form-control"
              aria-describedby="emailHelp"
              value={teacher_name}
              onChange={(e) => setTeacherName(e.target.value)}
            />
          </div>

          <div className="col mb-3">
            <label className="form-label">
              Department <span className="ei-col-red">*</span>
            </label>
            <select
              name="department"
              className="form-control"
              aria-label="Default select example"
              value={department}
              onChange={(e) =>
                changeRegYearAndDept(e.target.value, "DEPARTMENT")
              }
            >
              <option value="">-- Select --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className=" col mb-3">
            <label className="form-label">
              Student Registration Year<span className="ei-col-red">*</span>
            </label>
            <select
              name="student_reg_year"
              className="form-control"
              value={student_reg_year}
              onChange={(e) => changeRegYearAndDept(e.target.value, "REGYEAR")}
            >
              <option value="" disabled>
                -- Select --
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">
              Semester Of Rating <span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="semester_of_rating"
              value={semester_of_rating}
              onChange={(e) => setSemesterOfRating(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
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
            <label className="form-label">
              Subject Code <span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="subject_code"
              value={subject_code}
              onChange={(e) => setSubjectCode(e.target.value)}
            >
              <option value="">-- Select --</option>
              {subject_codes.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subject_code} - {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">
              Student Name <span className="ei-col-red">*</span>
            </label>
            <select
              name="student_name"
              className="form-control"
              value={student_name}
              onChange={(e) => setStudentName(e.target.value)}
            >
              <option value="">-- Select --</option>
              {student_names.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.registration_number}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">
              Class Participation <span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="class_participation"
              value={class_participation}
              onChange={(e) => setClassParticipation(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
              <option value="5">Always Participates</option>
              <option value="4">Oftenly Participates</option>
              <option value="3">Sometimes Participates</option>
              <option value="2">Rarely Participates</option>
              <option value="1">Never Participates</option>
            </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">
              Homework Or Assignments <span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="homework_or_assignments"
              value={homework_or_assignments}
              onChange={(e) => setHomeworkOrAssignments(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
              <option value="5">Always Done</option>
              <option value="4">Oftenly Done</option>
              <option value="3">Sometimes Done</option>
              <option value="2">Rarely Done</option>
              <option value="1">Never Done</option>
            </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">
              Quality Of Work<span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="quality_of_work"
              value={quality_of_work}
              onChange={(e) => setQualityOfWork(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
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
            <label className="form-label">
              Timeliness<span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="timeliness"
              value={timeliness}
              onChange={(e) => setTimeliness(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
              <option value="5">Always On Time</option>
              <option value="4">Usually On Time</option>
              <option value="3">Sometimes Late</option>
              <option value="2">Frequently Late</option>
              <option value="1">Always Late</option>
            </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">
              Probelm Solving Skills<span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="probelm_solving_skills"
              value={problem_solving_skills}
              onChange={(e) => setProblemSolvingSkills(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
              <option value="5">Excellent</option>
              <option value="4">Very Good</option>
              <option value="3">Good</option>
              <option value="2">Fair</option>
              <option value="1">Poor</option>
            </select>
          </div>
          <div className="col mb-3">
            <label className="form-label">
              Behaviour And Attitude<span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="behaviour_and_attitude"
              value={behaviour_and_attitude}
              onChange={(e) => setBehaviourAndAttitude(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
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
            <label className="form-label">
              Responsibility<span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="responsibility"
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
              <option value="5">Always Responsible</option>
              <option value="4">Usually Responsible</option>
              <option value="3">Sometimes Responsible</option>
              <option value="2">Frequently Responsible</option>
              <option value="1">Always Responsible</option>
            </select>
          </div>

          <div className="col mb-3">
            <label className="form-label">
              Participation And Engagement<span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="participation_and_engagement"
              value={participation_and_engagement}
              onChange={(e) => setParticipationAndEngagement(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
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
            <label className="form-label">
              Group Work <span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="group_work"
              value={group_work}
              onChange={(e) => setGroupWork(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
              <option value="5">Always Participates</option>
              <option value="4">Oftenly Participates</option>
              <option value="3">Sometimes Participates</option>
              <option value="2">Rarely Participates</option>
              <option value="1">Never Participates</option>
            </select>
          </div>

          <div className="col mb-3">
            <label className="form-label">
              Overall Student Quality<span className="ei-col-red">*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="overall_student_quality"
              value={overall_student_quality}
              onChange={(e) => setOverallStudentQuality(e.target.value)}
            >
              <option defaultValue>-- Select --</option>
              <option value="5">Very Satisfied</option>
              <option value="4">Satisfied</option>
              <option value="3">Neutral</option>
              <option value="2">Dissatisfied</option>
              <option value="1">Out Of Control</option>
            </select>
          </div>
        </div>

        <hr />
        <div className="mb-3 row">
          <div className="col">
            <label>
              Strengths <span className="ei-col-red">*</span>
            </label>
            <Select
              isMulti
              options={strengths_options}
              value={strengths}
              onChange={handleStrengthChange}
            />
          </div>
          {strengths.some((s) => s.value === "Other") && (
            <div className="col">
              <label htmlFor=""></label>
              <div className="row">
                <div className="col-10 d-flex justify-content-start align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter custom strength"
                    value={customStrength}
                    onChange={(e) => setCustomStrength(e.target.value)}
                  />
                </div>
                <div className="col-2 d-flex justify-content-end align-items-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddCustomStrength}
                  >
                    Add{" "}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Areas for Improvement Section */}
        <div className="mb-3 row">
          <div className="col">
            <label>
              Areas for Improvement <span className="ei-col-red">*</span>
            </label>
            <Select
              isMulti
              options={areas_for_improvements_options}
              value={areas_of_improvement}
              onChange={handleAreaForImprovementChange}
            />
          </div>
          {areas_of_improvement.some((a) => a.value === "Other") && (
            <div className="col">
              <label htmlFor=""></label>
              <div className="row">
                <div className="col-10 d-flex justify-content-start align-items-center">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter custom improvement"
                    value={customImprovement}
                    onChange={(e) => setCustomImprovement(e.target.value)}
                  />
                </div>
                <div className="col-2 d-flex justify-content-end align-items-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddCustomImprovement}
                  >
                    {" "}
                    Add{" "}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Additional Comments </label>
          <textarea
            name="additional_comments"
            type="text"
            className="form-control"
            aria-describedby="emailHelp"
            value={additional_comments}
            onChange={(e) => setAdditionalComments(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button
          type="button"
          className="btn btn-primary ms-4"
          onClick={handleClear}
        >
          Clear
        </button>
      </form>
    </div>
  );
}
export default TeacherFeedback;
