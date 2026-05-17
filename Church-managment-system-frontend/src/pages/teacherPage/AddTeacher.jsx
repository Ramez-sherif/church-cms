import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Save,
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Filter,
  Shield
} from 'lucide-react';

import { addTeacher } from '../../services/teacher.service';
import { getAllClassGrades } from '../../services/classGrade.service';

const AddTeacher = () => {
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Validation Errors state
  const [validationErrors, setValidationErrors] = useState({});

  // =========================
  // Form State
  // =========================
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    phoneNumber: '',
    address: '',
    serviceRole: 'CLASS_SERVANT',
    classGradeId: '',
    username: '',
    password: ''
  });

  // =========================
  // Load Class Grades
  // =========================
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

  // =========================
  // Handle Input Change
  // =========================
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

    if (!formData.birthDate) {
      errors.birthDate = 'تاريخ الميلاد مطلوب';
    }

    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'رقم الهاتف مطلوب';
    } else if (!phoneRegex.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = 'رقم هاتف مصري غير صحيح (مثال: 01xxxxxxxxx)';
    }

    if (!formData.serviceRole) {
      errors.serviceRole = 'المنصب الخدمي مطلوب';
    }

    if (!formData.classGradeId) {
      errors.classGradeId = 'المرحلة الدراسية مطلوبة';
    }

    if (!formData.username.trim()) {
      errors.username = 'اسم المستخدم مطلوب';
    }

    if (!formData.password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // =========================
  // Submit
  // =========================
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
      await addTeacher(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/teachers');
      }, 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      }
      
      setError(
        err.response?.data?.message || 'حدث خطأ أثناء إضافة الخادم'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      {/* =========================
          Header & Navigation
      ========================= */}
      <div style={{ maxWidth: '900px', margin: '0 auto 2rem auto' }}>
        <button
          onClick={() => navigate('/dashboard/teachers')}
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
            fontSize: '0.9rem',
            fontWeight: '700',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#2563eb')}
        >
          <ChevronRight size={18} />
          العودة لقائمة الخدام
        </button>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0.5rem 0 0 0'
          }}
        >
          إضافة خادم جديد
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
          إدارة بيانات الخدام والصلاحيات الكنسية
        </p>
      </div>

      {/* =========================
          Main Form Card
      ========================= */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="add-teacher-card"
        style={{
          backgroundColor: '#ffffff',
          padding: '2.5rem',
          borderRadius: '1.25rem',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
          maxWidth: '900px',
          margin: '0 auto',
          border: '1px solid #e2e8f0',
          boxSizing: 'border-box'
        }}
      >
        {/* Error Alert */}
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
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        {/* Success Alert */}
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
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>تمت إضافة الخادم بنجاح! جاري التحويل...</span>
          </div>
        )}

        {/* =========================
            Section 1: Personal Info
        ========================= */}
        <div className="form-section">
          <h2 className="section-title">
            <User size={18} color="#2563eb" />
            البيانات الشخصية
          </h2>

          <div className="form-grid">
            {/* First Name */}
            <div>
              <label className="form-label">الاسم الأول</label>
              <div className="input-container">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="مثال: يوحنا"
                  style={{
                    borderColor: validationErrors.firstName ? '#ef4444' : '#cbd5e1'
                  }}
                />
                <User className="input-icon" size={18} />
              </div>
              {validationErrors.firstName && (
                <p className="field-error">{validationErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="form-label">الاسم الأخير</label>
              <div className="input-container">
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="مثال: نبيل"
                  style={{
                    borderColor: validationErrors.lastName ? '#ef4444' : '#cbd5e1'
                  }}
                />
                <User className="input-icon" size={18} />
              </div>
              {validationErrors.lastName && (
                <p className="field-error">{validationErrors.lastName}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="form-label">رقم الهاتف</label>
              <div className="input-container">
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="01xxxxxxxxx"
                  style={{
                    borderColor: validationErrors.phoneNumber ? '#ef4444' : '#cbd5e1'
                  }}
                />
                <Phone className="input-icon" size={18} />
              </div>
              {validationErrors.phoneNumber && (
                <p className="field-error">{validationErrors.phoneNumber}</p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="form-label">تاريخ الميلاد</label>
              <div className="input-container">
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="form-input"
                  style={{
                    borderColor: validationErrors.birthDate ? '#ef4444' : '#cbd5e1'
                  }}
                />
                <Calendar className="input-icon" size={18} />
              </div>
              {validationErrors.birthDate && (
                <p className="field-error">{validationErrors.birthDate}</p>
              )}
            </div>

            {/* Address */}
            <div className="grid-full-width">
              <label className="form-label">العنوان</label>
              <div className="input-container">
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="العنوان بالتفصيل..."
                  style={{
                    borderColor: validationErrors.address ? '#ef4444' : '#cbd5e1'
                  }}
                />
                <MapPin className="input-icon" size={18} />
              </div>
              {validationErrors.address && (
                <p className="field-error">{validationErrors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            Section 2: Service Info
        ========================= */}
        <div className="form-section">
          <h2 className="section-title">
            <Briefcase size={18} color="#2563eb" />
            بيانات الخدمة
          </h2>

          <div className="form-grid">
            {/* Service Role */}
            <div>
              <label className="form-label">المنصب الخدمي</label>
              <div className="input-container">
                <select
                  name="serviceRole"
                  value={formData.serviceRole}
                  onChange={handleChange}
                  className="form-select"
                  style={{
                    borderColor: validationErrors.serviceRole ? '#ef4444' : '#cbd5e1'
                  }}
                >
                  <option value="CLASS_SERVANT">خادم</option>
                  <option value="STAGE_GROUP_LEADER">أمين مجموعة</option>
                  <option value="ASSISTANT_STAGE_GROUP_LEADER">مساعد أمين مجموعة</option>
                  <option value="STAGE_LEADER">أمين مرحلة</option>
                  <option value="ASSISTANT_STAGE_LEADER">مساعد أمين مرحلة</option>
                  <option value="STAGE_ADMIN">مسؤول مرحلة</option>
                  <option value="GENERAL_ADMIN">أمين الخدمة</option>
                </select>
                <Shield className="input-icon" size={18} />
              </div>
              {validationErrors.serviceRole && (
                <p className="field-error">{validationErrors.serviceRole}</p>
              )}
            </div>

            {/* Class Grade */}
            <div>
              <label className="form-label">الفصل / المرحلة</label>
              <div className="input-container">
                <select
                  name="classGradeId"
                  value={formData.classGradeId}
                  onChange={handleChange}
                  className="form-select"
                  style={{
                    borderColor: validationErrors.classGradeId ? '#ef4444' : '#cbd5e1'
                  }}
                >
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
                <Filter className="input-icon" size={18} />
              </div>
              {validationErrors.classGradeId && (
                <p className="field-error">{validationErrors.classGradeId}</p>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            Section 3: Login Credentials
        ========================= */}
        <div className="form-section" style={{ marginBottom: '1rem' }}>
          <h2 className="section-title">
            <Lock size={18} color="#2563eb" />
            بيانات تسجيل الدخول
          </h2>

          <div className="form-grid">
            {/* Username */}
            <div>
              <label className="form-label">اسم المستخدم</label>
              <div className="input-container">
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="مثال: john_doe"
                  style={{
                    borderColor: validationErrors.username ? '#ef4444' : '#cbd5e1'
                  }}
                />
                <User className="input-icon" size={18} />
              </div>
              {validationErrors.username && (
                <p className="field-error">{validationErrors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">كلمة المرور</label>
              <div className="input-container">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="••••••••"
                  style={{
                    borderColor: validationErrors.password ? '#ef4444' : '#cbd5e1'
                  }}
                />
                <Lock className="input-icon" size={18} />
              </div>
              {validationErrors.password && (
                <p className="field-error">{validationErrors.password}</p>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            Submit Button Row
        ========================= */}
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
              color: '#ffffff',
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

      {/* =========================
          Global Custom CSS Styling
      ========================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .form-section {
              background-color: #f8fafc;
              border: 1px solid #f1f5f9;
              border-radius: 1rem;
              padding: 1.75rem;
              margin-bottom: 2rem;
            }

            .section-title {
              font-size: 1.1rem;
              font-weight: 800;
              color: #1e293b;
              margin-top: 0;
              margin-bottom: 1.5rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 0.5rem;
            }

            .form-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1.5rem;
            }

            @media (max-width: 768px) {
              .form-grid {
                grid-template-columns: 1fr;
              }
              .add-teacher-card {
                padding: 1.5rem !important;
              }
              .form-section {
                padding: 1.25rem !important;
              }
            }

            .grid-full-width {
              grid-column: 1 / -1;
            }

            .form-label {
              display: block;
              margin-bottom: 0.5rem;
              font-size: 0.9rem;
              font-weight: 700;
              color: #475569;
            }

            .input-container {
              position: relative;
            }

            .form-input, .form-select {
              width: 100%;
              padding: 0.85rem 2.75rem 0.85rem 0.85rem;
              border: 1px solid #cbd5e1;
              border-radius: 0.75rem;
              outline: none;
              font-size: 0.95rem;
              font-family: 'Cairo', sans-serif;
              background-color: #ffffff;
              color: #111827;
              box-sizing: border-box;
              transition: all 0.2s ease-in-out;
            }

            .form-select {
              appearance: none;
              cursor: pointer;
              background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
              background-repeat: no-repeat;
              background-position: left 0.85rem center;
              background-size: 1.2rem;
            }

            .form-input:focus, .form-select:focus {
              border-color: #2563eb;
              box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
              background-color: #ffffff;
            }

            .form-input::placeholder {
              color: #64748b;
              opacity: 1;
            }

            .input-icon {
              position: absolute;
              right: 0.85rem;
              top: 50%;
              transform: translateY(-50%);
              color: #94a3b8;
              pointer-events: none;
              transition: color 0.2s;
            }

            .form-input:focus + .input-icon, .form-select:focus + .input-icon {
              color: #2563eb;
            }

            .field-error {
              color: #ef4444;
              font-size: 0.8rem;
              margin-top: 0.35rem;
              margin-bottom: 0;
              font-weight: 600;
              text-align: right;
            }

            /* Custom styling for date inputs */
            input[type="date"] {
              color: #111827;
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
          `
        }}
      />
    </div>
  );
};

export default AddTeacher;