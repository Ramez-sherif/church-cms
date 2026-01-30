import api from '../api/axios';
import AddAttendance from '../components/attendance/AttendanceForm';


//POST-> /attendance
export const addAttendance = async (attendanceData) => {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
}

//get-> /attendance
export const getAllAttendanceRecords = async () => {
    const response = await api.get('/attendance');
    return response.data;
}

//GET /attendance/lesson/{lessonId}
export const getAttendanceByLessonId = async (lessonId) => {
    const response = await api.get(`/attendance/lesson/${lessonId}`);
    return response.data;
}

//GET /class/{classGradeId}
export const getAttendanceByClassGradeId = async (classGradeId) => {
    const response = await api.get(`/attendance/class/${classGradeId}`);
    return response.data;
}