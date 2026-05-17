import axiosInstance from '../api/axiosInstance';

// GET /students/class/{classGradeId}
export const getStudentsByClassGrade = async (classGradeId) => {
  const response = await axiosInstance.get(`/students/class/${classGradeId}`);
  return response.data;
};

// POST /students
export const addStudent = async (studentData) => {
  const response = await axiosInstance.post('/students', studentData);
  return response.data;
};