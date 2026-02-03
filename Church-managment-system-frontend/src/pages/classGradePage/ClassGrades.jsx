import { useEffect, useState } from "react";  
import { getAllClassGrades } from "../../services/classGrade.service.js";
import ClassGradeView from "../../components/classGrade/ClassGradeView.jsx";
const ClassGrades = () => {
    const [classGrades, setClassGrades] = useState([]);

    useEffect(() => {
        const fetchClassGrades = async () => {
            const data = await getAllClassGrades();
            console.log(data); // 👈 بص هنا
            setClassGrades(data);
        };
        fetchClassGrades();
    }, []);

    return (
        <div>
            <h1>Class Grades</h1>
            <ClassGradeView grades={classGrades} />
        </div>
    );
};

export default ClassGrades;

