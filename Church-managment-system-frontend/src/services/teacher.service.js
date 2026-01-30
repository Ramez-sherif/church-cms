import api from '../api/axios';

//POST->  /teachers
export const addTeacher = async (teacherData) => {
    const response = await api.post('/teachers', teacherData);
    return response.data;
}

//GET->  /teachers
export const getAllTeachers = async () => {
    const response = await api.get('/teachers');
    return response.data;
}
//GET->  /teachers/{id}
export const getTeacherById = async (id) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
}


// GET->  /teachers/class/{classGradeId}
export const getTeachersByClassGradeId = async (classGradeId) => {
    const response = await api.get(`/teachers/class/${classGradeId}`);
    return response.data;
}