import { useState } from "react";
import { addClassGrade } from "../services/classGrade.service";
import ClassGradeFormComponent from "../components/ClassGradeFormComponent";

const AddClassGrade = () => {
    const [formData, setFormData] = useState({
        classGradeName: "",
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
        await addClassGrade(formData);
        alert("Class Grade created successfully!");

        setFormData({
            classGradeName: "",
        });
    };

    return (
        <ClassGradeFormComponent 
        formData={formData} 
        onchange={handleChange} 
        onsubmit={handleSubmit} />
    );
};

export default AddClassGrade;