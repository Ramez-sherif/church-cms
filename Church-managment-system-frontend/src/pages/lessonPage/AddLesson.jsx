import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Save, FileText, Calendar, Filter, User, Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { addLesson } from '../../services/lesson.service';
import { getAllClassGrades } from '../../services/classGrade.service';
import { getTeachersByClassGrade } from '../../services/teacher.service';

const AddLesson = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validation Errors state
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    teacherId: '',
    classGradeId: '',
  });
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getAllClassGrades();
        setGrades(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, classGradeId: data[0].id }));
        }
      } catch (err) {
        setError('فشل في تحميل المراحل الدراسية');
      }
    };
    fetchGrades();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (formData.classGradeId) {
        try {
          const data = await getTeachersByClassGrade(formData.classGradeId);
          setTeachers(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, teacherId: data[0].id }));
          } else {
            setFormData(prev => ({ ...prev, teacherId: '' }));
          }
        } catch (err) {
          console.error('Failed to fetch teachers', err);
        }
      }
    };
    fetchTeachers();
  }, [formData.classGradeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
      setValidationErrors(prev => ({ ...prev, pdf: '' }));
    } else {
      setPdfFile(null);
      setError('يرجى اختيار ملف PDF فقط.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      setError('يرجى تحميل ملف الدرس (PDF).');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setValidationErrors({});

    const data = new FormData();
    data.append('title', formData.title);
    data.append('date', formData.date);
    data.append('classGradeId', formData.classGradeId);
    data.append('teacherId', formData.teacherId);
    data.append('pdf', pdfFile);

    try {
      await addLesson(data);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/lessons'), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      }
      setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة الدرس. يرجى التأكد من البيانات والمحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 2.75rem 0.85rem 0.85rem',
    border: '1px solid #cbd5e1',
    borderRadius: '0.75rem',
    outline: 'none',
    fontSize: '0.95rem',
    fontFamily: 'Cairo, sans-serif',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    transition: '0.2s',
    boxSizing: 'border-box'
  };

  const iconStyle = {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    pointerEvents: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569'
  };

  return (
    <div
      className="page-container"
      style={{
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto 2rem auto' }}>
        <button 
          onClick={() => navigate('/dashboard/lessons')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem', 
            color: '#2563eb', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            padding: 0,
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#2563eb')}
        >
          <ChevronRight size={16} />
          العودة للمنهج
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: '0.5rem 0 0 0' }}>إضافة درس جديد</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white', 
        padding: '2.5rem', 
        borderRadius: '1.25rem', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
        maxWidth: '700px',
        margin: '0 auto',
        border: '1px solid #e2e8f0',
        boxSizing: 'border-box'
      }}>
        {error && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fee2e2',
            color: '#ef4444', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            marginBottom: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem' 
          }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ 
            backgroundColor: '#f0fdf4', 
            border: '1px solid #dcfce7',
            color: '#16a34a', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            marginBottom: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem' 
          }}>
            <CheckCircle size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>تمت إضافة الدرس بنجاح! يتم التحويل الآن...</span>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Lesson Title */}
          <div>
            <label style={labelStyle}>عنوان الدرس</label>
            <div style={{ position: 'relative' }}>
              <FileText style={iconStyle} size={18} />
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                style={{
                  ...inputStyle,
                  borderColor: validationErrors.title ? '#ef4444' : '#cbd5e1'
                }} 
                placeholder="عنوان الدرس..." 
              />
            </div>
            {validationErrors.title && (
              <p className="field-error">{validationErrors.title}</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Date */}
            <div>
              <label style={labelStyle}>التاريخ</label>
              <div style={{ position: 'relative' }}>
                <Calendar style={iconStyle} size={18} />
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                  style={{
                    ...inputStyle,
                    borderColor: validationErrors.date ? '#ef4444' : '#cbd5e1'
                  }} 
                />
              </div>
              {validationErrors.date && (
                <p className="field-error">{validationErrors.date}</p>
              )}
            </div>

            {/* Class Grade */}
            <div>
              <label style={labelStyle}>المرحلة الدراسية</label>
              <div style={{ position: 'relative' }}>
                <Filter style={iconStyle} size={18} />
                <select 
                  name="classGradeId" 
                  value={formData.classGradeId} 
                  onChange={handleChange} 
                  required 
                  style={{
                    ...inputStyle,
                    borderColor: validationErrors.classGradeId ? '#ef4444' : '#cbd5e1'
                  }}
                >
                  {grades.map(grade => (
                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                  ))}
                </select>
              </div>
              {validationErrors.classGradeId && (
                <p className="field-error">{validationErrors.classGradeId}</p>
              )}
            </div>
          </div>

          {/* Teacher */}
          <div>
            <label style={labelStyle}>المدرس الملقي للدرس</label>
            <div style={{ position: 'relative' }}>
              <User style={iconStyle} size={18} />
              <select 
                name="teacherId" 
                value={formData.teacherId} 
                onChange={handleChange} 
                required 
                style={{
                  ...inputStyle,
                  borderColor: validationErrors.teacherId ? '#ef4444' : '#cbd5e1'
                }}
              >
                {teachers.length === 0 ? (
                  <option value="">لا يوجد معلمون في هذه المرحلة</option>
                ) : (
                  teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
                  ))
                )}
              </select>
            </div>
            {validationErrors.teacherId && (
              <p className="field-error">{validationErrors.teacherId}</p>
            )}
          </div>

          {/* PDF File Upload */}
          <div>
            <label style={labelStyle}>ملف الدرس (PDF فقط)</label>
            <div style={{ 
              border: '2px dashed #cbd5e1', 
              borderRadius: '0.75rem', 
              padding: '2rem', 
              textAlign: 'center',
              backgroundColor: pdfFile ? '#f0fdf4' : '#f8fafc',
              borderColor: validationErrors.pdf ? '#ef4444' : (pdfFile ? '#16a34a' : '#cbd5e1'),
              transition: 'all 0.2s',
              position: 'relative'
            }}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  opacity: 0, 
                  cursor: 'pointer' 
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                {pdfFile ? (
                  <>
                    <CheckCircle size={32} color="#16a34a" />
                    <span style={{ fontWeight: '600', color: '#16a34a' }}>{pdfFile.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>انقر لتغيير الملف</span>
                  </>
                ) : (
                  <>
                    <Upload size={32} color="#94a3b8" />
                    <span style={{ fontWeight: '600', color: '#475569' }}>اضغط هنا لتحميل الملف</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>صيغة PDF فقط</span>
                  </>
                )}
              </div>
            </div>
            {validationErrors.pdf && (
              <p className="field-error" style={{ textAlign: 'center' }}>{validationErrors.pdf}</p>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 2rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#2563eb';
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            حفظ الدرس
          </button>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        select { 
          appearance: none; 
          cursor: pointer;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: left 0.85rem center;
          background-size: 1.2rem;
        }

        .field-error {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 0.35rem;
          margin-bottom: 0;
          font-weight: 600;
          text-align: right;
        }
      `}} />
    </div>
  );
};

export default AddLesson;