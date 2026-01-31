import { useEffect, useMemo, useState } from "react";
import { getStudentsByClassGradeId } from "../services/student.service";
import { useParams } from "react-router-dom";
import StudentRow from "../components/student/StudentRow";
import "../css/students.page.css";


const monthNames = [
  "All Months",
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const getMonthIndex = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.getMonth() + 1;
};

const StudentsPage = () => {
  const { classGradeId } = useParams();
  const [students, setStudents] = useState([]);

  const [q, setQ] = useState("");
  const [birthMonth, setBirthMonth] = useState(0);
  const [sort, setSort] = useState({ key: "name", dir: "asc" });

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await getStudentsByClassGradeId(classGradeId);
      setStudents(data);
    };
    fetchStudents();
  }, [classGradeId]);

  const filtered = useMemo(() => {
    let list = [...students];

    // Search
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((s) => {
        const fullName = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
        return [
          fullName,
          s.studentCode,
          s.phoneNumber,
          s.address,
          s.classGradeName,
          s.birthDate,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(needle));
      });
    }

    // Month Filter
    if (birthMonth !== 0) {
      list = list.filter((s) => getMonthIndex(s.birthDate) === birthMonth);
    }

    // Sort
    const dir = sort.dir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      if (sort.key === "name") {
        const A = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim();
        const B = `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim();
        return A.localeCompare(B, "ar") * dir;
      }
      if (sort.key === "code") {
        return String(a.studentCode ?? "")
          .localeCompare(String(b.studentCode ?? "")) * dir;
      }
      if (sort.key === "birth") {
        return String(a.birthDate ?? "")
          .localeCompare(String(b.birthDate ?? "")) * dir;
      }
      return 0;
    });

    return list;
  }, [students, q, birthMonth, sort]);

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  const sortIcon = (key) => {
    if (sort.key !== key) return "↕";
    return sort.dir === "asc" ? "↑" : "↓";
  };

  return (
    <div className="tablePage">
      <div className="tableHeader">
        <div>
          <h1 className="title">Students</h1>
          <p className="subtitle">
            Class Grade: <span className="pill">{students[0]?.classGradeName ?? "Unknown Class"}</span>
          </p>
        </div>
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search: name, code, phone..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="select"
          value={birthMonth}
          onChange={(e) => setBirthMonth(Number(e.target.value))}
        >
          {monthNames.map((m, idx) => (
            <option key={m} value={idx}>
              {m}
            </option>
          ))}
        </select>

        <button
          className="btnGhost"
          onClick={() => {
            setQ("");
            setBirthMonth(0);
          }}
        >
          Reset
        </button>
      </div>

      <div className="tableWrap">
        <table className="modernTable">
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")} className="sortable">
                Student {sortIcon("name")}
              </th>
              <th onClick={() => toggleSort("code")} className="sortable">
                Code {sortIcon("code")}
              </th>
              <th>Phone</th>
              <th onClick={() => toggleSort("birth")} className="sortable">
                Birth Date {sortIcon("birth")}
              </th>
              <th>Address</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="emptyCell">
                  No students found.
                </td>
              </tr>
            ) : (
              filtered.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;





















// import { useEffect, useState } from "react";  
// import { getStudentsByClassGradeId } from "../services/student.service";
// import {useParams} from 'react-router-dom';
// import StudentCard from "../components/student/StudentCard";

// const Students = () => {
//     const {classGradeId} = useParams();
//     const [students, setStudents] = useState([]);   

//     useEffect(() => {
//         const fetchStudents = async () => {
//             const data = await getStudentsByClassGradeId(classGradeId);
//             setStudents(data);
//         };
//         fetchStudents();    
//     },[classGradeId]);
//     return (
//         <div>
//             <h1>Students</h1>
//             {students.length===0?
//                 (
//                     <p>No students found.</p>
//                 ):
//                 (students.map((student) => (
//                     <StudentCard key={student.id} student={student} />
//                 )))
//             }
//         </div>
//     );
// };

// export default Students;