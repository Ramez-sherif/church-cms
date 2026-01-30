import { useEffect, useState } from "react";  
import { getStudentsByClassGradeId } from "../services/student.service";
import {useParams} from 'react-router-dom';
import StudentCard from "../components/student/StudentCard";

const Students = () => {
    const {classGradeId} = useParams();
    const [students, setStudents] = useState([]);   

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getStudentsByClassGradeId(classGradeId);
            setStudents(data);
        };
        fetchStudents();    
    },[classGradeId]);
    return (
        <div>
            <h1>Students</h1>
            {students.length===0?
                (
                    <p>No students found.</p>
                ):
                (students.map((student) => (
                    <StudentCard key={student.id} student={student} />
                )))
            }
        </div>
    );
};

export default Students;