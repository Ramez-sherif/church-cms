import api from '../api/axios';
//POST->  /lessons
export const addLesson = async (lessonData) => {
    const formData = new FormData();
    formData.append('title', lessonData.title);
    formData.append('date', lessonData.date);
    formData.append('classGradeId', lessonData.classGradeId);
    formData.append('teacherId', lessonData.teacherId);
    if (lessonData.pdf) {
        formData.append('pdf', lessonData.pdf);
    }
    const response = await api.post('/lessons', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const getLastLessonForClass=async(classGradeId)=>{
    const response= await api.get(`/class/${classGradeId}/last-lesson`);
    return response.data;
}

//GET /lessons/class/{classGradeId}
export const getLessonsByClassGradeId = async (classGradeId) => {
    const response = await api.get(`/lessons/class/${classGradeId}`);
    return response.data;
}