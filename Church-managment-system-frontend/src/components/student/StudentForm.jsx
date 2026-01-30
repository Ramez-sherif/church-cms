const StudentForm = ({ formData, onChange, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>First Name</label>
                <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={onChange}
                />
            </div>

            <div>
                <label>Last Name</label>
                <input
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                />
            </div>

            <div>
                <label>Student Code</label>
                <input
                name="studentCode"
                value={formData.studentCode}
                onChange={onChange}
                />
            </div>

            <div>
                <label>Class Grade ID</label>
                <input
                name="classGradeId"
                value={formData.classGradeId}
                onChange={onChange}
                />
            </div>
            
            <div>
                <label>Birth Date</label>
                <input
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={onChange}
                />
            </div>

            <div>
                <label>Phone Number</label>
                <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChange}
                />
            </div>

            <div>
                <label>Address</label>
                <input
                name="address"
                value={formData.address}
                onChange={onChange}
                />
            </div>

            <button type="submit">Create Student</button>
      </form>
    );
};
export default StudentForm;

/**
 * 
 * 
    private String firstName;
    private String lastName;
    private LocalDate birthDate;  //YYYY-MM-DD 
    private String phoneNumber;
    private String address;
    
    private Long classGradeId;
    private String studentCode;
 */