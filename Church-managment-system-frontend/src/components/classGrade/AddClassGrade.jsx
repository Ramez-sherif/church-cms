const AddClassGrade =({formData,onchange,onsubmit})=>{
    return (
        <form onSubmit={onsubmit}>
            <div>
                <label>Class Grade Name:</label>
                <input
                    name="classGradeName"
                    value={formData.classGradeName}
                    onChange={onchange}
                />
            </div>
            <button type="submit">Add Class Grade</button>

        </form>
    );
} 
export default AddClassGrade;