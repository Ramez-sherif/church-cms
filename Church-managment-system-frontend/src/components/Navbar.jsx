import { Link } from "react-router-dom"

const Navbar = () => {
    return (
    <header className="navbar">
        <div className="logo"> 
            ✝
        </div>
        <nav>
            <ul>
                <li><Link to="/attendance">Attendance</Link></li>
                <li><Link to="/add-attendance/1">Add Attendance</Link></li>
                <li><Link to="/teachers">Teachers</Link></li>
                <li><Link to="/students">Students</Link></li>
                <li><Link to="/add-teacher">Add Teacher</Link></li>
                <li><Link to="/add-student">Add Student</Link></li>
                <li><Link to="/class-grades">Class Grades</Link></li>
            </ul>
        </nav>
    </header>
    );
}
    export default Navbar;