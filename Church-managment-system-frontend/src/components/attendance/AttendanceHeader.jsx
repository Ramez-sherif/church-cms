const AttendanceHeader= ({lesson}) =>{
    return(
        <div className="attendance-header">
            <h2> {lesson.Title}</h2>
            <p> Date: {lesson.Date}  </p>
        </div>

    );
};
export default AttendanceHeader;