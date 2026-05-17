import axiosInstance from '../api/axiosInstance';

// POST /attendance
export const addAttendance = async (attendanceData) => {
  const response = await axiosInstance.post('/attendance', attendanceData);
  return response.data;
};

// GET /attendance/lesson/{lessonId}
export const getAttendanceByLessonId = async (lessonId) => {
  const response = await axiosInstance.get(`/attendance/lesson/${lessonId}`);
  return response.data;
};

// GET /attendance/class/{classGradeId}
export const getAttendanceByClassGradeId = async (classGradeId) => {
  const response = await axiosInstance.get(`/attendance/class/${classGradeId}`);
  return response.data;
};