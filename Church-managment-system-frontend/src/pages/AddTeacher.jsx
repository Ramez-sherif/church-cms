import { useState } from "react";
import { addTeacher } from "../services/teacher.service";
import TeacherForm from "../components/teacher/TeacherForm";

const AddTeacher = () => {
    const [FormData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        phoneNumber: "",
        address: "",
        serviceRole: "",
        classGradeId: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;   //e.target = <input name="firstName" value="A" />
        setFormData({
            ...FormData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page refresh
        await addTeacher(FormData);
        alert("Teacher created successfully!");

        setFormData({
            firstName: "",
            lastName: "",
            birthDate: "",
            phoneNumber: "",
            address: "",
            serviceRole: "",
            classGradeId: "",
        });
    };

    return (
    <div className="add-teacher-page">
        <TeacherForm 
         FormData={FormData}
         onchange={handleChange} 
         onsubmit={handleSubmit} 
        /></div>);
};

export default AddTeacher;