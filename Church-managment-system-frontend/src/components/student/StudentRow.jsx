const StudentRow = ({ student }) => {
  const fullName = `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim();

  return (
    <tr>
      <td className="nameCell">
        <div className="nameBlock">
          <div className="avatar">
            {(student.firstName?.[0] || "S").toUpperCase()}
          </div>
          <div>
            <div className="name">{fullName || "Unnamed Student"}</div>
            <div className="mutedSmall">{student.studentCode}</div>
          </div>
        </div>
      </td>

      <td className="mono">{student.studentCode}</td>

      <td>
        <a className="link" href={`tel:${student.phoneNumber}`}>
          {student.phoneNumber}
        </a>
      </td>

      <td className="mono">{student.birthDate}</td>

      <td className="address">{student.address}</td>
    </tr>
  );
};

export default StudentRow;






/**const StudentCard = ({ student }) => {
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
export default StudentCard;**/

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