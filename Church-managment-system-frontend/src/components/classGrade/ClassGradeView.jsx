import { Link } from "react-router-dom";
const ClassGradeView = ({grades}) => {
    return(
        <div>
            {grades.length===0?
                (
                    <p>No class grades found.</p>
                ):  
                (
                    grades.map((grade) => (
                        <div key={grade.id}>
                           <Link to={`/class-grades/${grade.id}/students`}>
                                <h2>{grade.name}</h2>
                           </Link>
                        </div>
                    ))
                )
            }
        </div>
    );  
};
export default ClassGradeView;

/**
 * const ClassGradeView = ({grades}) => {
    return(
        <div>
            {grades.length===0?
                (
                    <p>No class grades found.</p>
                ):  
                (
                    grades.map((grade) => (
                        <div key={grade.id}>
                            <Link to={`/class-grades/${grade.id}/students`}>
                                <h2>{grade.classGradeName}</h2>
                            </Link>
                        </div>
                    ))
                )
            }
        </div>
    );  
};
 */