import api from '../api/axios';

//POST-> /class-grades
export const addClassGrade = async (classGradeData) => {
    const response = await api.post('/class-grades', classGradeData);
    return response.data;
}
//GET-> /class-grades
export const getAllClassGrades = async () => {
    const response = await api.get('/class-grades');
    return response.data;
}

//GET-> /class-grades/{id}/students
export const getStudentsByClassGradeId = async (id) => {
    const response = await api.get(`/class-grades/${id}/students`);
    return response.data;
}
