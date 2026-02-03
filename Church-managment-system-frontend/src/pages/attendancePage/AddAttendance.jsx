import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {getStudentsByClassGradeId} from '../../services/classGrade.service';
import {getLastLessonForClass} from '../../services/lesson.service';
import{addAttendance} from '../../services/attendance.service';
import {getBirthdayStudentsByLesson} from '../../services/student.service';

import AttendanceHeader from '../../components/attendance/AttendanceHeader';  
import AttendanceForm from '../../components/attendance/AttendanceForm';

const AddAttendance= () =>{
    const {classGradeId}=useParams();                       //get classGradeId from url params
   
    const [students,setStudents]=useState([]);              //list of students in the class
    const [attendance,setAttendance]=useState({});          //attendance state
    const [birthdayMap,setBirthdayMap]=useState({});        //map of students with birthdays

    const [lesson,setLesson]=useState(null);                //list of students in the class
    const [loading,setLoading]=useState(true);              //loading state

//fetch students and last lesson for the class
    useEffect(()=>{
        const fetchData= async()=>{
          
                const lessonData= await getLastLessonForClass(classGradeId);
                const studentsData= await getStudentsByClassGradeId(classGradeId);
                const birthdayStudents= await getBirthdayStudentsByLesson(lessonData.id);

                setLesson(lessonData);
                setStudents(studentsData);

                const birthdayFlag={};
                birthdayStudents.forEach((student)=>{
                    birthdayFlag[student.id]=true;           //mark students with birthdays
                });
                setBirthdayMap(birthdayFlag);

                const initalAttendance={};                  //initialize attendance object
                studentsData.forEach((student)=>{           //set initial attendance to false for each student
                    initalAttendance[student.id]=false;
                });
                setAttendance(initalAttendance);            //set attendance state

                setLoading(false);                         //set loading to false once data is fetched
        };
            fetchData();                                     
    },[classGradeId]);                                  //run effect when classGradeId changes


//toggle attendance status for a student
    const handleToggle=(studentId)=>{
        setAttendance((prevAttendance)=>({
            ...prevAttendance,
            [studentId]:!prevAttendance[studentId]      //toggle attendance status
        }));
    };

//submit attendance data
 const handleSubmit = async () => {
    const payload = students.map(s => ({
      userId: s.id,
      lessonId: lesson.id,
      status: attendance[s.id]
    }));

    await addAttendance(payload);
    alert("Attendance saved");
  };

  if (loading) return <p>Loading...</p>;              
    return(                                                     
        <div>                                                   
            <AttendanceHeader lesson={lesson} />  

            <AttendanceForm 
                students={students} 
                attendance={attendance} 
                birthdayMap={birthdayMap}
                onToggle={handleToggle} 
                onSubmit={handleSubmit} 
            />

        </div>
    );                                                    
};
export default AddAttendance;