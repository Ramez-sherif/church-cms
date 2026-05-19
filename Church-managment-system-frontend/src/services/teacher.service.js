import axiosInstance from '../api/axiosInstance';

// =========================
// GET Teachers By Class
// =========================
export const getTeachersByClassGrade =
  async (classGradeId) => {

    const response =
      await axiosInstance.get(
        `/teachers/class/${classGradeId}`
      );

    return response.data;
  };

// =========================
// GET All Teachers
// =========================
export const getAllTeachers =
  async () => {

    const response =
      await axiosInstance.get(
        '/teachers'
      );

    return response.data;
  };

// =========================
// GET Teacher By ID
// =========================
export const getTeacherById =
  async (id) => {

    const response =
      await axiosInstance.get(
        `/teachers/${id}`
      );

    return response.data;
  };

// =========================
// ADD Teacher
// =========================
export const addTeacher =
  async (teacherData) => {

    const response =
      await axiosInstance.post(
        '/teachers',
        teacherData
      );

    return response.data;
  };

// =========================
// UPDATE Teacher
// =========================
export const updateTeacher =
  async (id, teacherData) => {

    const response =
      await axiosInstance.put(
        `/teachers/${id}`,
        teacherData
      );

    return response.data;
  };

// =========================
// DELETE Teacher
// =========================
export const deleteTeacher =
  async (id) => {

    const response =
      await axiosInstance.delete(
        `/teachers/${id}`
      );

    return response.data;
  };