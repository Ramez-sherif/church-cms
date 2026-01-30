const attendanceRow =({attendance})=>{
    return(
        <tr>
            <td>{attendance.userName}</td>
            <td>{attendance.userRole}</td>
            <td>{attendance.lessonTitle}</td>
            <td>{attendance.lessonDate}</td>
            <td>{attendance.status?"present":"absent"}</td>
        </tr>
    )
}
export default attendanceRow;