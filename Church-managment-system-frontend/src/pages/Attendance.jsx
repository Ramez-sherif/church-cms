import AttendanceRow from "../components/attendance/AttendanceRecord";
import { useEffect, useState } from "react";
import { getAllAttendanceRecords } from "../services/attendance.service";
const Attendance = () => {

    const [attendanceRecords, setAttendanceRecords]=useState([]);

    useEffect(()=> {
            const fetchAttendanceRecords=async()=>{
                const data= await getAllAttendanceRecords();
                setAttendanceRecords(data);
            }
            fetchAttendanceRecords();
        }
    ,[]);
    return(
        <div>
            <h1>Attendance Records</h1>
            <table>
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>User Role</th>
                        <th>Lesson Title</th>
                        <th>Lesson Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map((attendance) => (
                        <AttendanceRow  attendance={attendance} />
                    ))}
                </tbody>
            </table>
        </div>
    );
    }   
export default Attendance;