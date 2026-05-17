import axiosInstance from '../api/axiosInstance';

// GET /teachers/class/{classGradeId}
export const getTeachersByClassGrade = async (classGradeId) => {
  const response = await axiosInstance.get(`/teachers/class/${classGradeId}`);
  return response.data;
};

// POST /teachers
export const addTeacher = async (teacherData) => {
  const response = await axiosInstance.post('/teachers', teacherData);
  return response.data;
};