const AttendanceForm= ({students,attendance,birthdayMap,onToggle,onSubmit}) =>{
  
    return(
        <div className="attendance-container">
            <ul className="attendance-list">
                {students.map(student=>(
                    <li key={student.id} className="attendance-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={attendance[student.id] || false}
                                onChange={() => onToggle(student.id)}

                            />
                            {student.firstName} {student.lastName}
                        </label>
                        {birthdayMap[student.id] && <span className="birthday-badge">🎂</span>} {/* Display birthday badge if student has birthday */}
                    </li>
                ))}
            </ul>
            <button onClick={onSubmit}>Submit Attendance</button>
        </div>
    );
    
};
export default AttendanceForm;