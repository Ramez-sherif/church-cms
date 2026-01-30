import { useState } from "react";
import { addStudent } from "../services/student.service";
import StudentForm from "../components/student/StudentForm";

const AddStudent = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        studentCode: "",
        classGradeId: "",
        birthDate: "",
        phoneNumber: "",
        address: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;   //e.target = <input name="firstName" value="A" />
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page refresh
        await addStudent(formData);
        alert("Student created successfully!");

        setFormData({
            firstName: "",
            lastName: "",
            studentCode: "",
            classGradeId: "",
            birthDate: "",
            phoneNumber: "",
            address: ""
        });
    };  
    return (
        <div>
            <h1>Add New Student</h1>
            <StudentForm    
                formData={formData}     
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </div>
    );
};
export default AddStudent;   

