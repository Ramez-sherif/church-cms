import api from '../api/axios';

// POST-> /students
export const createStudent = async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
}

// GET-> /students
export const getAllStudents = async () => {
    const response = await api.get('/students');
    return response.data;
};

// GET->  /students/{uuid}
export const getStudentById = async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
}

//GET->  /students/class/{classGradeId}
export const getStudentsByClassGradeId = async (classGradeId) => {
    const response = await api.get(`/students/class/${classGradeId}`);
    return response.data;
}   

export const getBirthdayStudentsByLesson = async (lessonId) => {
    const response = await api.get(`/students/birthdays/lesson/${lessonId}`);
    return response.data;
}