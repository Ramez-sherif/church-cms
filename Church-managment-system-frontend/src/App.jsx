
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';    //importing react router components
import Attendance from './pages/Attendance.jsx';
import AddAttendancePage from './pages/AddAttendance.jsx';
import Teachers from './pages/Teachers.jsx';
import Students from './pages/Students.jsx';
import AddTeacher from './pages/AddTeacher.jsx';
import Home from './pages/Home.jsx';
import ClassGrades from './pages/ClassGrades.jsx';

function App() {
 // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/add-attendance/:classGradeId" element={<AddAttendancePage />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/students" element={<Students />} />
        <Route path="/add-teacher" element={<AddTeacher />} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/class-grades' element={<ClassGrades/>}/>
      </Routes>
    </Router>

  );
}

export default App
