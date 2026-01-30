import { useState } from "react";
import AddLessonForm from "../components/AddLessonForm";
import { addLesson } from "../services/lesson.service";

const AddLesson = () => {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        classGradeId: "",
        teacherId: "",
        pdf: null
    });
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

    };
    const handleFileChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            pdf: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addLesson(formData);
        alert("Lesson added successfully!");

        setFormData({
            title: "",
            date: "",
            classGradeId: "",
            teacherId: "",
            pdf: null
        });
    };

    return (
        <div className="add-lesson-container">
            <h2>Add Lesson</h2>
            <AddLessonForm  
             formData={formData}
             onChange={handleChange}
             onSubmit={handleSubmit}
             onFileChange={handleFileChange} />
        </div>
    );
};
export default AddLesson;