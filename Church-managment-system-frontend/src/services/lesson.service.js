import axiosInstance from '../api/axiosInstance';

// POST /lessons
export const addLesson = async (formData) => {
  const response = await axiosInstance.post('/lessons', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// GET /lessons/class/{classGradeId}
export const getLessonsByClassGrade = async (classGradeId) => {
  const response = await axiosInstance.get(`/lessons/class/${classGradeId}`);
  return response.data;
};

// GET /lessons/class/{classGradeId}/last-lesson
export const getLastLessonByClassGrade = async (classGradeId) => {
  const response = await axiosInstance.get(`/lessons/class/${classGradeId}/last-lesson`);
  return response.data;
};