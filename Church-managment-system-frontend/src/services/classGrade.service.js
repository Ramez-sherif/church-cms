import axiosInstance from '../api/axiosInstance';

// POST /class-grades
export const addClassGrade = async (classGradeData) => {
  const response = await axiosInstance.post('/class-grades', classGradeData);
  return response.data;
};

// GET /class-grades
export const getAllClassGrades = async () => {
  const response = await axiosInstance.get('/class-grades');
  return response.data;
};

// GET /stage-groups
export const getStageGroups = async () => {
  const response = await axiosInstance.get('/stage-groups');
  return response.data;
};

// GET /class-grades/{id}/students
export const getStudentsByClassGradeId = async (id) => {
  const response = await axiosInstance.get(`/class-grades/${id}/students`);
  return response.data;
};
