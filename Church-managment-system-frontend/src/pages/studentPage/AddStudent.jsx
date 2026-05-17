import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Save,
  User,
  Phone,
  MapPin,
  Calendar,
  IdCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  Filter
} from 'lucide-react';

import { addStudent } from '../../services/student.service';
import { getAllClassGrades } from '../../services/classGrade.service';

const AddStudent = () => {
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validation Errors state
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    phoneNumber: '',
    address: '',
    studentCode: '',
    classGradeId: ''
  });

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getAllClassGrades();
        setGrades(data);
        if (data.length > 0) {
          setFormData(prev => ({
            ...prev,
            classGradeId: data[0].id
          }));
        }
      } catch (err) {
        setError('فشل في تحميل المراحل الدراسية');
      }
    };
    fetchGrades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error on change
    setValidationErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // =========================
  // Frontend Validator
  // =========================
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'الاسم الأول مطلوب';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'الاسم الأول يجب أن يكون حرفين على الأقل';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'الاسم الأخير مطلوب';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'الاسم الأخير يجب أن يكون حرفين على الأقل';
    }

    if (!formData.studentCode.trim()) {
      errors.studentCode = 'كود الطالب مطلوب';
    }

    if (!formData.birthDate) {
      errors.birthDate = 'تاريخ الميلاد مطلوب';
    }

    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'رقم الهاتف مطلوب';
    } else if (!phoneRegex.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = 'رقم هاتف مصري غير صحيح (مثال: 01xxxxxxxxx)';
    }

    if (!formData.classGradeId) {
      errors.classGradeId = 'المرحلة الدراسية مطلوبة';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run frontend validation
    if (!validateForm()) {
      setError('يرجى تصحيح الأخطاء الموضحة أدناه قبل الحفظ.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setValidationErrors({});

    try {
      await addStudent(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/class-grades/${formData.classGradeId}/students`);
      }, 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      }

      setError(
        err.response?.data?.message ||
        'حدث خطأ أثناء إضافة الطالب. يرجى التأكد من البيانات والمحاولة مرة أخرى.'
      );
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
      <div style={{ maxWidth: '800px', margin: '0 auto 2rem auto' }}>
        <button
          onClick={() => navigate(-1)}
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
          العودة للقائمة
        </button>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0.5rem 0 0 0'
          }}
        >
          إضافة طالب جديد
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          borderRadius: '1.25rem',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
          maxWidth: '800px',
          margin: '0 auto',
          border: '1px solid #e2e8f0',
          boxSizing: 'border-box'
        }}
      >
        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#ef4444',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              {error}
            </span>
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #dcfce7',
              color: '#16a34a',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <CheckCircle size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              تمت إضافة الطالب بنجاح! يتم التحويل الآن...
            </span>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {/* First Name */}
          <div>
            <label style={labelStyle}>الاسم الأول</label>
            <div style={{ position: 'relative' }}>
              <User style={iconStyle} size={18} />
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: validationErrors.firstName ? '#ef4444' : '#cbd5e1'
                }}
                placeholder="مثال: يوحنا"
              />
            </div>
            {validationErrors.firstName && (
              <p className="field-error">{validationErrors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label style={labelStyle}>الاسم الأخير</label>
            <div style={{ position: 'relative' }}>
              <User style={iconStyle} size={18} />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: validationErrors.lastName ? '#ef4444' : '#cbd5e1'
                }}
                placeholder="مثال: نبيل"
              />
            </div>
            {validationErrors.lastName && (
              <p className="field-error">{validationErrors.lastName}</p>
            )}
          </div>

          {/* Student Code */}
          <div>
            <label style={labelStyle}>كود الطالب</label>
            <div style={{ position: 'relative' }}>
              <IdCard style={iconStyle} size={18} />
              <input
                name="studentCode"
                value={formData.studentCode}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: validationErrors.studentCode ? '#ef4444' : '#cbd5e1'
                }}
                placeholder="مثال: STU123"
              />
            </div>
            {validationErrors.studentCode && (
              <p className="field-error">{validationErrors.studentCode}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label style={labelStyle}>رقم الهاتف</label>
            <div style={{ position: 'relative' }}>
              <Phone style={iconStyle} size={18} />
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: validationErrors.phoneNumber ? '#ef4444' : '#cbd5e1'
                }}
                placeholder="01xxxxxxxxx"
              />
            </div>
            {validationErrors.phoneNumber && (
              <p className="field-error">{validationErrors.phoneNumber}</p>
            )}
          </div>

          {/* Birth Date */}
          <div>
            <label style={labelStyle}>تاريخ الميلاد</label>
            <div style={{ position: 'relative' }}>
              <Calendar style={iconStyle} size={18} />
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: validationErrors.birthDate ? '#ef4444' : '#cbd5e1'
                }}
              />
            </div>
            {validationErrors.birthDate && (
              <p className="field-error">{validationErrors.birthDate}</p>
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
                style={{
                  ...inputStyle,
                  borderColor: validationErrors.classGradeId ? '#ef4444' : '#cbd5e1'
                }}
              >
                {grades.map(grade => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>
            {validationErrors.classGradeId && (
              <p className="field-error">{validationErrors.classGradeId}</p>
            )}
          </div>

          {/* Address */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>العنوان (اختياري)</label>
            <div style={{ position: 'relative' }}>
              <MapPin style={iconStyle} size={18} />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: validationErrors.address ? '#ef4444' : '#cbd5e1'
                }}
                placeholder="العنوان بالتفصيل..."
              />
            </div>
            {validationErrors.address && (
              <p className="field-error">{validationErrors.address}</p>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: '2.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '1.5rem'
          }}
        >
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
            حفظ البيانات
          </button>
        </div>
      </form>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            input,
            select {
              color: #0f172a;
            }

            input::placeholder {
              color: #64748b;
              opacity: 1;
            }

            select option {
              color: #0f172a;
            }

            .animate-spin {
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

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
          `
        }}
      />
    </div>
  );
};

export default AddStudent;