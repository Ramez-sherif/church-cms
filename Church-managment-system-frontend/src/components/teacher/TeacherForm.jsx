const TeacherForm =({FormData,onchange,onsubmit})=>{
    return (
        <form onSubmit={onsubmit}>
            <div>
                <label>First Name</label>
                <input
                    name="firstName"
                    value={FormData.firstName}
                    onChange={onchange}
                />
            </div>
            <div>
                <label>Last Name</label>
                <input
                    name="lastName"
                    value={FormData.lastName}
                    onChange={onchange}
                />
            </div>
            <div>
                <label>Phone Number</label>
                <input
                    name="phoneNumber"
                    value={FormData.phoneNumber}
                    onChange={onchange}
                />
            </div>
            <div>
                <label>Address</label>
                <input
                    name="address"
                    value={FormData.address}
                    onChange={onchange}
                />
            </div>
            <div>
                <label>Birth Date</label>
                <input
                    name="birthDate"
                    type="date"
                    value={FormData.birthDate}
                    onChange={onchange}
                />
            </div>
            <div>
                <label>Role</label>
                <input
                    name="serviceRole"
                    value={FormData.serviceRole}
                    onChange={onchange}
                />
            </div>
            <div>
                <label>Class Grade ID</label>
                <input
                    name="classGradeId"
                    value={FormData.classGradeId}
                    onChange={onchange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default TeacherForm;

/**
 *  private String firstName;
    private String lastName;
    private LocalDate birthDate;  //YYYY-MM-DD 
    private String phoneNumber;
    private String address;

    private String serviceRole;
    private long  classGradeId;
 */