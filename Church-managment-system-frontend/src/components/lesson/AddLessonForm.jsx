const AddLessonForm = ({formData,onChange,onFileChange,onSubmit}) => {
    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Lesson Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    required
                />
            </div>
            <div>
                <label>Lesson Date:</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={onChange}
                    required
                />
            </div>
            <div>
                <label>Class Grade ID:</label>
                <input
                    type="text"
                    name="classGradeId"
                    value={formData.classGradeId}
                    onChange={onChange}
                    required
                />

            </div>
            <div>
                <label>Teacher ID:</label>
                <input
                    type="text"
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={onChange}
                    required
                />
            </div>
            <div>
               <label>Upload Lesson PDF:</label>
               <input
               type = "file"
               accept="application/pdf"
               onChange={onFileChange}
               />
            </div>
            <button type="submit">Add Lesson</button>
        </form>
    );
}
export default AddLessonForm;