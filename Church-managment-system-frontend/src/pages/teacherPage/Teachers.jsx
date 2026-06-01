import { useEffect, useState, useMemo } from 'react';

import {
  UserPlus,
  Search,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  Filter,
  Save,
  X
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import {
  getAllTeachers,
  deleteTeacher,
  updateTeacher
} from '../../services/teacher.service';

import { getAllClassGrades } from '../../services/classGrade.service';
import { getAllStages, getAllStageGroups } from '../../services/stage.service';

const Teachers = () => {

  const [teachers, setTeachers] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [selectedRoleFilter, setSelectedRoleFilter] =
    useState('ALL');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  // =========================
  // Edit Modal State
  // =========================
  const [showEditModal,
    setShowEditModal] =
    useState(false);

  const [selectedTeacher,
    setSelectedTeacher] =
    useState(null);

  // =========================
  // Edit Form Data
  // =========================
  const [editFormData,
    setEditFormData] =
    useState({

      firstName: '',

      lastName: '',

      birthDate: '',

      phoneNumber: '',

      address: '',

      serviceRole:
        'CLASS_SERVANT',

      classGradeId: '',
      stageGroupId: '',
      stageId: ''
    });

  const [classGrades, setClassGrades] = useState([]);
  const [stages, setStages] = useState([]);
  const [stageGroups, setStageGroups] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [editError, setEditError] = useState('');

  const navigate = useNavigate();

  // =========================
  // Handle Edit Change
  // =========================
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      if (name === 'serviceRole') {
        updated.classGradeId = '';
        updated.stageGroupId = '';
        updated.stageId = '';
      }
      return updated;
    });

    setValidationErrors(prev => {
      const updatedErrors = {
        ...prev,
        [name]: ''
      };
      if (name === 'serviceRole') {
        updatedErrors.classGradeId = '';
        updatedErrors.stageGroupId = '';
        updatedErrors.stageId = '';
      }
      return updatedErrors;
    });
  };

  // =========================
  // Translate Role
  // =========================
  const translateRole = (role) => {

    switch (role) {

      case 'GENERAL_ADMIN':
        return 'أمين الخدمة';

      case 'STAGE_LEADER':
        return 'أمين مرحلة';

      case 'ASSISTANT_STAGE_LEADER':
        return 'مساعد أمين مرحلة';

      case 'STAGE_GROUP_LEADER':
        return 'أمين مجموعة';

      case 'ASSISTANT_STAGE_GROUP_LEADER':
        return 'مساعد أمين مجموعة';

      case 'CLASS_TEACHER':
        return 'مسؤول الفصل';

      case 'ASSISTANT_CLASS_TEACHER':
        return 'مساعد مسؤول الفصل';

      case 'CLASS_SERVANT':
        return 'خادم';

      default:
        return role;
    }
  };

  // =========================
  // Role Badge Style & Color Map
  // =========================
  const roleColorMap = {
    GENERAL_ADMIN: { backgroundColor: '#f3e8ff', color: '#6b21a8' },
    STAGE_LEADER: { backgroundColor: '#fee2e2', color: '#991b1b' },
    ASSISTANT_STAGE_LEADER: { backgroundColor: '#fce7f3', color: '#9d174d' },
    STAGE_GROUP_LEADER: { backgroundColor: '#ffedd5', color: '#c2410c' },
    ASSISTANT_STAGE_GROUP_LEADER: { backgroundColor: '#f5e6d3', color: '#78350f' },
    CLASS_TEACHER: { backgroundColor: '#dcfce7', color: '#166534' },
    ASSISTANT_CLASS_TEACHER: { backgroundColor: '#fef9c3', color: '#854d0e' },
    CLASS_SERVANT: { backgroundColor: '#dbeafe', color: '#1e40af' }
  };

  const getRoleBadgeStyle = (role) => {
    return roleColorMap[role] || {
      backgroundColor: '#eff6ff',
      color: '#2563eb'
    };
  };

  // =========================
  // Fetch Assignment Data (Grades, Stage Groups, Stages)
  // =========================
  const fetchAssignmentData = async () => {
    try {
      const [gradesData, stagesData, stageGroupsData] = await Promise.all([
        getAllClassGrades(),
        getAllStages(),
        getAllStageGroups()
      ]);
      setClassGrades(gradesData || []);
      setStages(stagesData || []);
      setStageGroups(stageGroupsData || []);
    } catch (err) {
      console.error('فشل في تحميل البيانات الأساسية', err);
    }
  };

  // =========================
  // Fetch Teachers
  // =========================
  useEffect(() => {

    fetchTeachers();
    fetchAssignmentData();

  }, []);

  const fetchTeachers =
    async () => {

      setLoading(true);

      setError('');

      try {

        const data =
          await getAllTeachers();

        setTeachers(data);

      } catch (err) {

        setError(
          'فشل في تحميل قائمة الخدام'
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // Delete Teacher
  // =========================
  const handleDelete =
    async (id) => {

      const confirmed =
        window.confirm(
          'هل أنت متأكد من حذف الخادم؟'
        );

      if (!confirmed) return;

      try {

        await deleteTeacher(id);

        fetchTeachers();

      } catch (err) {

        alert(
          'فشل في حذف الخادم'
        );
      }
    };

  // =========================
  // Update Teacher
  // =========================
  const handleUpdateTeacher = async (e) => {
    if (e) e.preventDefault();

    // Frontend validation
    const errors = {};
    if (!editFormData.firstName.trim()) {
      errors.firstName = 'الاسم الأول مطلوب';
    } else if (editFormData.firstName.trim().length < 2) {
      errors.firstName = 'الاسم الأول يجب أن يكون حرفين على الأقل';
    }

    if (!editFormData.lastName.trim()) {
      errors.lastName = 'الاسم الأخير مطلوب';
    } else if (editFormData.lastName.trim().length < 2) {
      errors.lastName = 'الاسم الأخير يجب أن يكون حرفين على الأقل';
    }

    if (!editFormData.birthDate) {
      errors.birthDate = 'تاريخ الميلاد مطلوب';
    }

    const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
    if (!editFormData.phoneNumber.trim()) {
      errors.phoneNumber = 'رقم الهاتف مطلوب';
    } else if (!phoneRegex.test(editFormData.phoneNumber.trim())) {
      errors.phoneNumber = 'رقم هاتف مصري غير صحيح (مثال: 01xxxxxxxxx)';
    }

    if (!editFormData.serviceRole) {
      errors.serviceRole = 'المنصب الخدمي مطلوب';
    }

    const isClassRole = (role) => {
      return role === 'CLASS_SERVANT' ||
             role === 'CLASS_TEACHER' ||
             role === 'ASSISTANT_CLASS_TEACHER';
    };

    const isStageGroupRole = (role) => {
      return role === 'STAGE_GROUP_LEADER' ||
             role === 'ASSISTANT_STAGE_GROUP_LEADER';
    };

    const isStageRole = (role) => {
      return role === 'STAGE_LEADER' ||
             role === 'ASSISTANT_STAGE_LEADER';
    };

    if (isClassRole(editFormData.serviceRole)) {
      if (!editFormData.classGradeId) {
        errors.classGradeId = 'الفصل / المرحلة مطلوبة';
      }
    } else if (isStageGroupRole(editFormData.serviceRole)) {
      if (!editFormData.stageGroupId) {
        errors.stageGroupId = 'المجموعة مطلوبة';
      }
    } else if (isStageRole(editFormData.serviceRole)) {
      if (!editFormData.stageId) {
        errors.stageId = 'المرحلة مطلوبة';
      }
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setEditError('يرجى تصحيح الأخطاء الموضحة أدناه قبل الحفظ.');
      return;
    }

    setUpdateLoading(true);
    setEditError('');

    try {
      const payload = {
        firstName: editFormData.firstName.trim(),
        lastName: editFormData.lastName.trim(),
        birthDate: editFormData.birthDate,
        phoneNumber: editFormData.phoneNumber.trim(),
        address: editFormData.address.trim(),
        serviceRole: editFormData.serviceRole,
        stageId: isStageRole(editFormData.serviceRole) && editFormData.stageId ? Number(editFormData.stageId) : null,
        stageGroupId: isStageGroupRole(editFormData.serviceRole) && editFormData.stageGroupId ? Number(editFormData.stageGroupId) : null,
        classGradeId: isClassRole(editFormData.serviceRole) && editFormData.classGradeId ? Number(editFormData.classGradeId) : null
      };

      await updateTeacher(selectedTeacher.id, payload);
      setShowEditModal(false);
      fetchTeachers();
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      }
      setEditError(
        err.response?.data?.message || 'فشل في تعديل بيانات الخادم'
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  // =========================
  // Filtered Teachers
  // =========================
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      // 1. Quick Role Filter
      if (selectedRoleFilter !== 'ALL' && teacher.serviceRole !== selectedRoleFilter) {
        return false;
      }

      // 2. Text Search Filter
      if (!searchTerm.trim()) {
        return true;
      }

      const translatedRoleName = translateRole(teacher.serviceRole);
      const searchableText = [
        teacher.firstName,
        teacher.lastName,
        `${teacher.firstName} ${teacher.lastName}`,
        teacher.phoneNumber,
        translatedRoleName,
        teacher.stageName,
        teacher.stageGroupName,
        teacher.classGradeName
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(searchTerm.toLowerCase());
    });
  }, [teachers, searchTerm, selectedRoleFilter]);

  return (

    <div
      className="page-container"
      style={{
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif'
      }}
    >

      {/* Header */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}
      >

        <div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#0f172a'
            }}
          >

            قائمة الخدام

          </h1>

          <p
            style={{
              color: '#64748b'
            }}
          >

            إدارة بيانات الخدام والصلاحيات

          </p>

        </div>

      </div>

      {/* Add Button */}

      <button
        onClick={() =>
          navigate('/dashboard/add-teacher')
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.9rem 1.6rem',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.9rem',
          cursor: 'pointer',
          fontWeight: '700',
          marginBottom: '1.5rem'
        }}
      >

        <UserPlus size={18} />

        إضافة خادم جديد

      </button>

      {/* Quick Role Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}
      >
        {[
          { label: 'الكل', value: 'ALL' },
          { label: 'خدام', value: 'CLASS_SERVANT' },
          { label: 'مسؤولي الفصول', value: 'CLASS_TEACHER' },
          { label: 'مساعدو مسؤولي الفصول', value: 'ASSISTANT_CLASS_TEACHER' },
          { label: 'أمناء المجموعات', value: 'STAGE_GROUP_LEADER' },
          { label: 'مساعدو أمناء المجموعات', value: 'ASSISTANT_STAGE_GROUP_LEADER' },
          { label: 'أمناء المراحل', value: 'STAGE_LEADER' },
          { label: 'مساعدو أمناء المراحل', value: 'ASSISTANT_STAGE_LEADER' },
          { label: 'أمين الخدمة', value: 'GENERAL_ADMIN' }
        ].map((chip) => {
          const isSelected = selectedRoleFilter === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => setSelectedRoleFilter(chip.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                color: isSelected ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '1rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div
          style={{
            position: 'relative'
          }}
        >
          <Search
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b'
            }}
            size={18}
          />

          <input
            type="text"
            placeholder="ابحث بالاسم أو الهاتف أو الدور أو المرحلة أو المجموعة أو الفصل"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 2.75rem 0.75rem 1rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.75rem',
              outline: 'none',
              fontSize: '0.9rem',
              fontFamily: 'Cairo, sans-serif',
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '1rem', minWidth: '800px' }}>
        <table
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderCollapse: 'collapse',
            textAlign: 'right'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#475569', fontWeight: '700' }}>الاسم</th>
              <th style={{ padding: '1rem', color: '#475569', fontWeight: '700' }}>الدور الخدمي</th>
              <th style={{ padding: '1rem', color: '#475569', fontWeight: '700' }}>المرحلة</th>
              <th style={{ padding: '1rem', color: '#475569', fontWeight: '700' }}>المجموعة</th>
              <th style={{ padding: '1rem', color: '#475569', fontWeight: '700' }}>الصف / الفصل</th>
              <th style={{ padding: '1rem', color: '#475569', fontWeight: '700' }}>رقم الهاتف</th>
              <th style={{ padding: '1rem', color: '#475569', fontWeight: '700' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Shield size={48} color="#94a3b8" />
                    <p style={{ color: '#64748b', fontWeight: '700', fontSize: '1rem', margin: 0 }}>
                      لا يوجد خدام مطابقون لعملية البحث
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher) => (
              <tr key={teacher.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a' }}>
                  {teacher.firstName} {teacher.lastName}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      ...getRoleBadgeStyle(teacher.serviceRole)
                    }}
                  >
                    {translateRole(teacher.serviceRole)}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#475569' }}>
                  {teacher.stageName || <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>
                <td style={{ padding: '1rem', color: '#475569' }}>
                  {teacher.stageGroupName || <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>
                <td style={{ padding: '1rem', color: '#475569' }}>
                  {teacher.classGradeName || <span style={{ color: '#cbd5e1' }}>—</span>}
                </td>
                <td style={{ padding: '1rem', color: '#475569' }}>
                  {teacher.phoneNumber}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Edit */}
                    <button
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setEditFormData({
                          firstName: teacher.firstName || '',
                          lastName: teacher.lastName || '',
                          birthDate: teacher.birthDate || '',
                          phoneNumber: teacher.phoneNumber || '',
                          address: teacher.address || '',
                          serviceRole: teacher.serviceRole || '',
                          classGradeId: teacher.classGradeId ? String(teacher.classGradeId) : '',
                          stageGroupId: teacher.stageGroupId ? String(teacher.stageGroupId) : '',
                          stageId: teacher.stageId ? String(teacher.stageId) : ''
                        });
                        setValidationErrors({});
                        setEditError('');
                        setShowEditModal(true);
                      }}
                      style={{
                        padding: '0.4rem',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.color = '#2563eb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      style={{
                        padding: '0.4rem',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}

      {showEditModal && (

        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '1.5rem',
            boxSizing: 'border-box'
          }}
        >

          <form
            onSubmit={handleUpdateTeacher}
            noValidate
            style={{
              backgroundColor: 'white',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '1.25rem',
              padding: '2.5rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0',
              boxSizing: 'border-box',
              position: 'relative'
            }}
          >

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                left: '1.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '0.5rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <X size={20} />
            </button>

            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: '#0f172a',
                marginTop: 0,
                marginBottom: '2rem'
              }}
            >
              تعديل بيانات الخادم
            </h2>

            {/* Error Alert */}
            {editError && (
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
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{editError}</span>
              </div>
            )}

            {/* Section 1: Personal Info */}
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
                      value={editFormData.firstName}
                      onChange={handleEditChange}
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
                      value={editFormData.lastName}
                      onChange={handleEditChange}
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
                      value={editFormData.phoneNumber}
                      onChange={handleEditChange}
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
                      value={editFormData.birthDate}
                      onChange={handleEditChange}
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
                      value={editFormData.address}
                      onChange={handleEditChange}
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

            {/* Section 2: Service Info */}
            <div className="form-section" style={{ marginBottom: '1rem' }}>
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
                      value={editFormData.serviceRole}
                      onChange={handleEditChange}
                      className="form-select"
                      style={{
                        borderColor: validationErrors.serviceRole ? '#ef4444' : '#cbd5e1'
                      }}
                    >
                      <option value="CLASS_SERVANT">خادم</option>
                      <option value="CLASS_TEACHER">مسؤول الفصل</option>
                      <option value="ASSISTANT_CLASS_TEACHER">مساعد مسؤول الفصل</option>
                      <option value="STAGE_GROUP_LEADER">أمين مجموعة</option>
                      <option value="ASSISTANT_STAGE_GROUP_LEADER">مساعد أمين مجموعة</option>
                      <option value="STAGE_LEADER">أمين مرحلة</option>
                      <option value="ASSISTANT_STAGE_LEADER">مساعد أمين مرحلة</option>
                      <option value="GENERAL_ADMIN">أمين الخدمة</option>
                    </select>
                    <Shield className="input-icon" size={18} />
                  </div>
                  {validationErrors.serviceRole && (
                    <p className="field-error">{validationErrors.serviceRole}</p>
                  )}
                </div>

                {/* Conditional Service Assignment Selects */}
                {(editFormData.serviceRole === 'CLASS_SERVANT' ||
                  editFormData.serviceRole === 'CLASS_TEACHER' ||
                  editFormData.serviceRole === 'ASSISTANT_CLASS_TEACHER') && (
                  <div>
                    <label className="form-label">الصف / الفصل</label>
                    <div className="input-container">
                      <select
                        name="classGradeId"
                        value={editFormData.classGradeId}
                        onChange={handleEditChange}
                        className="form-select"
                        style={{
                          borderColor: validationErrors.classGradeId ? '#ef4444' : '#cbd5e1'
                        }}
                      >
                        <option value="">اختر الصف / الفصل</option>
                        {classGrades.map((grade) => (
                          <option key={grade.id} value={String(grade.id)}>
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
                )}

                {(editFormData.serviceRole === 'STAGE_GROUP_LEADER' ||
                  editFormData.serviceRole === 'ASSISTANT_STAGE_GROUP_LEADER') && (
                  <div>
                    <label className="form-label">المجموعة</label>
                    <div className="input-container">
                      <select
                        name="stageGroupId"
                        value={editFormData.stageGroupId}
                        onChange={handleEditChange}
                        className="form-select"
                        style={{
                          borderColor: validationErrors.stageGroupId ? '#ef4444' : '#cbd5e1'
                        }}
                      >
                        <option value="">اختر المجموعة</option>
                        {stageGroups.map((group) => (
                          <option key={group.id} value={String(group.id)}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                      <Filter className="input-icon" size={18} />
                    </div>
                    {validationErrors.stageGroupId && (
                      <p className="field-error">{validationErrors.stageGroupId}</p>
                    )}
                  </div>
                )}

                {(editFormData.serviceRole === 'STAGE_LEADER' ||
                  editFormData.serviceRole === 'ASSISTANT_STAGE_LEADER') && (
                  <div>
                    <label className="form-label">المرحلة</label>
                    <div className="input-container">
                      <select
                        name="stageId"
                        value={editFormData.stageId}
                        onChange={handleEditChange}
                        className="form-select"
                        style={{
                          borderColor: validationErrors.stageId ? '#ef4444' : '#cbd5e1'
                        }}
                      >
                        <option value="">اختر المرحلة</option>
                        {stages.map((stage) => (
                          <option key={stage.id} value={String(stage.id)}>
                            {stage.name}
                          </option>
                        ))}
                      </select>
                      <Filter className="input-icon" size={18} />
                    </div>
                    {validationErrors.stageId && (
                      <p className="field-error">{validationErrors.stageId}</p>
                    )}
                  </div>
                )}

                {editFormData.serviceRole === 'GENERAL_ADMIN' && (
                  <div className="grid-full-width" style={{ marginTop: '0.5rem' }}>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>
                      ℹ️ أمين الخدمة ليس مرتبطًا بمرحلة
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button Row */}
            <div
              style={{
                marginTop: '2.5rem',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '1.5rem'
              }}
            >
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: '0.85rem 2rem',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={updateLoading}
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
                  cursor: updateLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                }}
                onMouseOver={(e) => {
                  if (!updateLoading) e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseOut={(e) => {
                  if (!updateLoading) e.currentTarget.style.backgroundColor = '#2563eb';
                }}
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    حفظ التعديلات
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Global CSS Inject */}
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

            input::placeholder {
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

export default Teachers;