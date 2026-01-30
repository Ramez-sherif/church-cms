const StudentCard = ({ student }) => {
    return (
        <div className="student-card">
            <h3>{student.firstName} {student.lastName}</h3>

            <p><strong>Code:</strong> {student.studentCode}</p>
            <p><strong>Phone:</strong> {student.phoneNumber}</p>
            <p><strong>Address:</strong> {student.address}</p>
            <p><strong>Class:</strong> {student.classGradeName}</p>
            <p><strong>Birth Date:</strong> {student.birthDate}</p>

        </div>
    );
};
export default StudentCard;

/**
 * 
 * POST->  /teachers
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