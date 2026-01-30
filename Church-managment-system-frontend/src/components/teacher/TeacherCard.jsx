const TeacherCard =({teacher})=>{
    return (
        <div className="teacher-card">
            <h3>{teacher.firstName} {teacher.lastName}</h3>

            <p><strong>Phone:</strong> {teacher.phoneNumber}</p>
            <p><strong>Address:</strong> {teacher.address}</p>
            <p><strong>Birth Date:</strong> {teacher.birthDate}</p>
            <p><strong>Role:</strong> {teacher.serviceRole}</p>
            <p><strong>Class:</strong> {teacher.classGradeName}</p>
        </div>
    );
}
export default TeacherCard;
/**
 POST->  /teachers
{
  "firstName": "Michael",
  "lastName": "Samy",
  "birthDate": "1990-03-15",
  "phoneNumber": "01122223333",
  "address": "Giza",
  "serviceRole": "Teacher",
  "classGradeId": 1
}
 */