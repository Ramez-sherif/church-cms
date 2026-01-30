import { useState, useEffect } from "react";    
import {getTeachersByClassGradeId} from '../services/teacher.service';
import {useParams} from 'react-router-dom';
import TeacherCard from "../components/teacher/TeacherCard";

const Teachers =()=>{
    const {classGradeId} = useParams();
    const[teachers, setTeachers]=useState([]);      //state to hold teachers list

    useEffect(()=>{                                 //useEffect to fetch teachers on component mount
        const fetchTeachers=async()=>{
            const data= await getTeachersByClassGradeId(classGradeId);
            setTeachers(data);                      //update state with fetched teachers
        };
        fetchTeachers();
    },[classGradeId]);                             //[] empty dependency array to run only once on mount
    return (
        <div>
            <h1>Teachers</h1>  
            {teachers.length===0?
            (
                <p>No teachers found.</p>
            ):
            (
                teachers.map(
                    (teacher)=>
                    (
                        <TeacherCard key={teacher.id} teacher={teacher} />
                    )
                )
            )}
        </div>
    );
}
export default Teachers;