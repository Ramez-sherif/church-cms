import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Users,
  BookOpen,
  Heart,
  Calendar,
  Compass,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Form states
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Monitor scroll for glass navbar state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle path-based scrolling on mount and location changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const sectionId = path.substring(1); // 'about', 'services', etc.
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleNavClick = (section) => {
    setMobileMenuOpen(false);
    if (section === 'home') {
      navigate('/');
    } else {
      navigate(`/${section}`);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div
      style={{
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif',
        backgroundColor: '#f8fafc',
        color: '#1e293b',
        minHeight: '100vh',
        scrollBehavior: 'smooth'
      }}
    >
      {/* =========================
          HORIZONTAL NAVBAR
      ========================= */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : 'none',
          transition: 'all 0.3s ease',
          padding: scrolled ? '0.75rem 2rem' : '1.25rem 2rem'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Compass size={22} />
            </div>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: scrolled ? '#0f172a' : 'white',
                transition: 'color 0.3s'
              }}
            >
              كنيسة القديسين
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem'
            }}
            className="desktop-nav"
          >
            {[
              { id: 'home', name: 'الرئيسية' },
              { id: 'about', name: 'عن الكنيسة' },
              { id: 'services', name: 'الخدمات' },
              { id: 'activities', name: 'الأنشطة' },
              { id: 'contact', name: 'تواصل معنا' }
            ].map((item) => (
              <span
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  color: scrolled ? '#475569' : 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  position: 'relative'
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = scrolled ? '#475569' : 'rgba(255, 255, 255, 0.9)')
                }
              >
                {item.name}
              </span>
            ))}
          </nav>

          {/* Login Button in Navbar */}
          <div style={{ display: 'none' }} className="desktop-nav">
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              تسجيل الدخول
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: scrolled ? '#0f172a' : 'white',
              cursor: 'pointer',
              display: 'block'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 999,
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            direction: 'rtl'
          }}
        >
          {[
            { id: 'home', name: 'الرئيسية' },
            { id: 'about', name: 'عن الكنيسة' },
            { id: 'services', name: 'الخدمات' },
            { id: 'activities', name: 'الأنشطة' },
            { id: 'contact', name: 'تواصل معنا' }
          ].map((item) => (
            <span
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: '#334155',
                cursor: 'pointer',
                padding: '0.25rem 0'
              }}
            >
              {item.name}
            </span>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/login');
            }}
            style={{
              padding: '0.75rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '700',
              cursor: 'pointer',
              textAlign: 'center',
              marginTop: '0.5rem'
            }}
          >
            تسجيل الدخول للنظام
          </button>
        </div>
      )}

      {/* =========================
          HERO SECTION (الرئيسية)
      ========================= */}
      <section
        id="home"
        style={{
          height: '100vh',
          backgroundImage: 'url("/bg5.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem'
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            zIndex: 1
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '800px',
            color: 'white'
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.2)',
              border: '1px solid rgba(37, 99, 235, 0.4)',
              color: '#60a5fa',
              padding: '0.35rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              letterSpacing: '1px',
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}
          >
            بِيتِي بَيْتَ الصَّلاَةِ يُدْعَى لِجَمِيعِ الشُّعُوبِ
          </span>
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: '900',
              lineHeight: '1.3',
              marginBottom: '1.5rem'
            }}
            className="hero-title"
          >
            مرحباً بكم في نظام كنيسة القديسين
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: '#cbd5e1',
              marginBottom: '2.5rem',
              lineHeight: '1.8',
              fontWeight: '500'
            }}
          >
            نعمل معاً لبناء مجتمع كنسي مترابط، روحي وتفاعلي، يرعى الأجيال ويخدم الجميع بالمحبة والعطاء.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => handleNavClick('about')}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'white',
                color: '#1e293b',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              اقرأ المزيد عنّا
            </button>

            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              الدخول للنظام الإداري
              <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          ABOUT SECTION (عن الكنيسة)
      ========================= */}
      <section
        id="about"
        style={{
          padding: '6rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          direction: 'rtl'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.9rem' }}>رسالة وخدمة</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0 1.5rem 0' }}>
              عن كنيستنا ورؤيتنا الروحية
            </h2>
            <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              تأسست الكنيسة لتكون مركزاً روحياً ينشر محبة المسيح وسلامه في المجتمع، ومكاناً يجتمع فيه المؤمنون للصلاة والتسبيح ودراسة كلمة الله المقدسة.
            </p>
            <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '2rem', fontSize: '0.95rem' }}>
              نسعى من خلال أنشطة مدارس الأحد والاجتماعات المختلفة والقداسات اليومية لتقديم خدمة متكاملة روحية وتعليمية واجتماعية لكافة الفئات والأعمار.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'رعاية النشء والأطفال من خلال مناهج مدارس الأحد المتطورة.',
                'خدمة الشباب وتوجيه طاقاتهم نحو البناء والعمل الروحي.',
                'الافتقاد وخدمات الرحمة لدعم العائلات في كل الاحتياجات.'
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#dbeafe',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      flexShrink: 0
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative Card */}
          <div
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              padding: '2.5rem',
              borderRadius: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.02)',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '1rem',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}
            >
              <Heart size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0' }}>
              مبادئنا الأساسية
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.25rem 0' }}>
                  المحبة الأخوية
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, lineHeight: '1.6' }}>
                  نقبل الجميع كما هم، ونسير معاً في مسيرة الإيمان والخدمة الروحية الحقيقية.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.25rem 0' }}>
                  التعليم الأرثوذكسي المستمد
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, lineHeight: '1.6' }}>
                  نحافظ على الإيمان القويم والتقاليد الكنسية الآبائية ونسلمها بأمانة للأجيال الصاعدة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          SERVICES SECTION (الخدمات)
      ========================= */}
      <section
        id="services"
        style={{
          padding: '6rem 2rem',
          backgroundColor: 'white'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', direction: 'rtl' }}>
          <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.9rem' }}>أبواب الخدمة</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0 3rem 0' }}>
            الخدمات الكنسية الروحية
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem'
            }}
          >
            {[
              {
                icon: <BookOpen size={24} />,
                title: 'مدارس الأحد',
                desc: 'خدمة تعليمية لجميع المراحل الدراسية لغرس المبادئ والتعاليم المسيحية وقصص الكتاب المقدس.'
              },
              {
                icon: <Users size={24} />,
                title: 'القداسات الإلهية',
                desc: 'مواعيد القداسات والصلوات الأسبوعية والنهضات الروحية لحياة شركة مستمرة.'
              },
              {
                icon: <Calendar size={24} />,
                title: 'اجتماعات الشباب والمثقفين',
                desc: 'لقاءات أسبوعية لمناقشة التحديات الروحية والحياتية المعاصرة وتوجيه طاقاتهم.'
              },
              {
                icon: <Heart size={24} />,
                title: 'الافتقاد وخدمات الدعم',
                desc: 'رعاية تامة للأسر الكنسية وافتقاد مستمر للجميع لتقديم المؤازرة والدعم والتشجيع.'
              }
            ].map((srv, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  padding: '2rem',
                  textAlign: 'right',
                  transition: 'all 0.2s',
                  cursor: 'default'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '0.5rem',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  {srv.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '800',
                    color: '#0f172a',
                    margin: '0 0 0.75rem 0'
                  }}
                >
                  {srv.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.7', margin: 0 }}>
                  {srv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          ACTIVITIES SECTION (الأنشطة)
      ========================= */}
      <section
        id="activities"
        style={{
          padding: '6rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          direction: 'rtl'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.9rem' }}>نشاط وتنمية</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0 1rem 0' }}>
            الأنشطة والفعاليات الكنسية
          </h2>
          <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem' }}>
            نهتم بتنمية مواهب أولادنا وتدعيم علاقات الزمالة والمحبة البناءة من خلال الأنشطة الهادفة.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {[
            {
              title: 'الكشافة الكنسية Scout',
              tag: 'الشباب والفتية',
              desc: 'تنمية المهارات البدنية والذهنية وروح العمل الجماعي والاعتماد على النفس تحت رعاية الكنيسة.'
            },
            {
              title: 'تعليم الألحان واللغة القبطية',
              tag: 'لكل الأعمار',
              desc: 'المحافظة على التراث الطقسي الفريد وتعليم الألحان الكنسية العميقة واللغة القبطية التاريخية.'
            },
            {
              title: 'الرحلات والمخيمات الصيفية',
              tag: 'النشاط الترفيهي الروحي',
              desc: 'تنظيم رحلات روحية ومؤتمرات سنوية ومصايف لبناء صداقات حقيقية في بيئة آمنة وروحية.'
            }
          ].map((act, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.01)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ padding: '2rem' }}>
                <span
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '2rem',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}
                >
                  {act.tag}
                </span>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: '#0f172a',
                    margin: '0 0 1rem 0'
                  }}
                >
                  {act.title}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
                  {act.desc}
                </p>
              </div>

              <div
                style={{
                  padding: '1rem 2rem',
                  borderTop: '1px solid #f1f5f9',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#2563eb',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
                onClick={() => handleNavClick('contact')}
              >
                <span>الاشتراك والاستعلام</span>
                <ChevronLeft size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          CONTACT SECTION (تواصل معنا)
      ========================= */}
      <section
        id="contact"
        style={{
          padding: '6rem 2rem',
          backgroundColor: 'white'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            direction: 'rtl'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.9rem' }}>تواصل مباشر</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0 1rem 0' }}>
              يسعدنا دائماً تواصلك معنا
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem'
            }}
          >
            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem 0' }}>
                معلومات الاتصال
              </h3>

              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.25rem 0' }}>
                    الموقع الجغرافي
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                    شارع الكنيسة الرئيسي، وسط المدينة، جمهورية مصر العربية
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.25rem 0' }}>
                    رقم الهاتف والخط الساخن
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, direction: 'ltr', textAlign: 'right' }}>
                    +20 12 3456 7890
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.25rem 0' }}>
                    البريد الإلكتروني
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                    info@churchsaints.org
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form
              onSubmit={handleContactSubmit}
              style={{
                backgroundColor: '#f8fafc',
                padding: '2rem',
                borderRadius: '1.5rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              {submitted && (
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}
                >
                  تم إرسال رسالتك بنجاح! وسنقوم بالرد عليك في أقرب وقت.
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                  الاسم بالكامل
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                  placeholder="مثال: يوسف مينا"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                  placeholder="youssef@domain.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                  رقم الموبايل
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                  موضوع الرسالة أو الاستفسار
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'Cairo, sans-serif',
                    resize: 'none'
                  }}
                  placeholder="اكتب رسالتك بالتفصيل هنا..."
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '0.875rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer
        style={{
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          padding: '3rem 2rem',
          borderTop: '1px solid #1e293b',
          textAlign: 'center',
          direction: 'rtl'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
            <Compass size={24} />
            <span style={{ fontSize: '1.125rem', fontWeight: '800' }}>كنيسة القديسين والشهداء</span>
          </div>

          <p style={{ fontSize: '0.85rem', margin: 0, color: '#64748b' }}>
            بنيت على أساس الرسل والأنبياء، ويسوع المسيح نفسه حجر الزاوية.
          </p>

          <div style={{ borderTop: '1px solid #1e293b', width: '100%', paddingTop: '1.5rem', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} جميع الحقوق محفوظة لنظام إدارة الكنيسة الموحد.
          </div>
        </div>
      </footer>

      {/* Embedded CSS style */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (min-width: 768px) {
              .desktop-nav {
                display: flex !important;
              }
              .mobile-toggle {
                display: none !important;
              }
            }
            @media (max-width: 767px) {
              .hero-title {
                font-size: 2.25rem !important;
              }
            }
            html {
              scroll-behavior: smooth;
            }
          `
        }}
      />
    </div>
  );
};

export default LandingPage;
