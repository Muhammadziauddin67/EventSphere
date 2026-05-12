import React from 'react'
import { useNavigate } from 'react-router-dom'

const sections = [
  {
    title: ' Information We Collect',
    content: `We collect information you provide directly to us when you create an account, book tickets, or contact us. This includes your name, email address, payment information, and any other information you choose to provide. We also collect information automatically when you use our services, including log data, device information, and usage patterns.`
  },
  {
    title: ' How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve our services; process transactions and send related information; send promotional communications (with your consent); monitor and analyze usage patterns; and comply with legal obligations. We do not sell your personal information to third parties.`
  },
  {
    title: ' Information Sharing',
    content: `We may share your information with event organizers when you book tickets or register for events, with service providers who assist in our operations, and when required by law. Exhibitors may see your name and contact details if you initiate contact with them through our platform.`
  },
  {
    title: ' Data Security',
    content: `We implement industry-standard security measures to protect your personal information, including SSL encryption for all data in transit and bcrypt hashing for passwords. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
  },
  {
    title: ' Cookies',
    content: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, some parts of our service may not function properly without cookies.`
  },
  {
    title: ' Your Rights',
    content: `You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of your data or opt out of marketing communications. To exercise these rights, contact us at privacy@eventsphere.com.`
  },
  {
    title: ' Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it by law.`
  },
  {
    title: ' Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date. We encourage you to review this policy periodically.`
  },
]

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div
      style={{ fontFamily: "'Jost', sans-serif" }}
      className='min-h-screen bg-gradient-to-b from-[#f7f6f2] to-white'
    >
      {/* Hero Section */}
      <div className='bg-[#2C3E50] relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#FFA641,_transparent_35%)]'></div>

        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10'>
          <div className='max-w-3xl'>
            <span className='inline-block bg-[#FFA641]/20 text-[#FFA641] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase'>
              Legal
            </span>

            <h1 className='text-4xl sm:text-5xl font-bold text-white leading-tight mb-5'>
              Privacy Policy
            </h1>

            <p className='text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl'>
              Learn how EventSphere collects, uses, stores, and protects your
              personal information while using our platform.
            </p>

            <div className='mt-6 flex items-center gap-3 text-sm text-white/50'>
              <div className='h-2 w-2 rounded-full bg-[#FFA641]'></div>
              <span>Last updated: May 11, 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14'>
        {/* Intro Card */}
        <div className='bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm mb-8'>
          <p className='text-gray-600 leading-8 text-[15px]'>
            EventSphere Management ("we", "us", or "our") is committed to
            protecting your privacy. This Privacy Policy explains how we
            collect, use, and safeguard your personal information when you use
            our platform. By using EventSphere, you agree to the collection and
            use of information in accordance with this policy.
          </p>
        </div>

        {/* Policy Sections */}
        <div className='space-y-5'>
          {sections.map(({ title, content }, index) => (
            <div
              key={title}
              className='group bg-white border border-gray-100 hover:border-[#FFA641]/30 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300'
            >
              <div className='flex items-start gap-4'>
                <div className='min-w-[42px] h-[42px] rounded-xl bg-[#2C3E50] text-white flex items-center justify-center font-bold text-sm'>
                  {index + 1}
                </div>

                <div>
                  <h2 className='text-lg font-semibold text-[#2C3E50] mb-3'>
                    {title}
                  </h2>

                  <p className='text-gray-600 text-sm sm:text-[15px] leading-7'>
                    {content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className='mt-10 bg-[#2C3E50] rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-48 h-48 bg-[#FFA641]/10 rounded-full blur-3xl'></div>

          <div className='relative z-10'>
            <h3 className='text-2xl font-bold text-white mb-3'>
              Questions About Privacy?
            </h3>

            <p className='text-white/65 text-sm sm:text-base max-w-xl mx-auto leading-7 mb-7'>
              If you have any questions regarding this Privacy Policy or how your
              data is handled, contact our support team anytime.
            </p>

            <button
              onClick={() => navigate('/feedback')}
              className='bg-[#FFA641] hover:bg-[#ffb55a] text-[#2C3E50] font-semibold px-7 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FFA641]/20'
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
        {/* ── Footer ── */}
        <footer className='bg-[#1a2a38] px-16 pt-12 pb-6'>
        <div className='w-full'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/8'>
            <div>
              <p className='text-white font-bold text-lg mb-2'>
                Event<span className='text-[#FFA641]'>Sphere</span>
              </p>
              <p className='text-white/35 text-sm font-light leading-relaxed max-w-xs'>
                The all-in-one platform for managing world-class expos and trade shows.
              </p>
            </div>
            <div>
              <p className='text-white/30 text-xs font-bold uppercase tracking-widest mb-3'>Platform</p>
              {[
                { label: 'Expos', path: '/events?type=expo' },
                { label: 'Concerts', path: '/events?type=concert' },
                { label: 'Sports', path: '/events?type=sports' },
                { label: 'Browse All', path: '/events' },
              ].map(l => (
                <p key={l.label}
                  onClick={() => navigate(l.path)}
                  className='text-white/45 text-sm mb-1.5 cursor-pointer hover:text-[#FFA641] transition-colors'>
                  {l.label}
                </p>
              ))}
            </div>
            <div>
              <p className='text-white/30 text-xs font-bold uppercase tracking-widest mb-3'>Company</p>
              {[
                { label: 'About', path: '/about' },
                { label: 'Blog', path: '/blog' },
                { label: 'Contact', path: '/feedback' },
                { label: 'Privacy Policy', path: '/privacy' },
              ].map(l => (
                <p key={l.label}
                  onClick={() => navigate(l.path)}
                  className='text-white/45 text-sm mb-1.5 cursor-pointer hover:text-[#FFA641] transition-colors'>
                  {l.label}
                </p>
              ))}
            </div>
          </div>
          <div className='flex justify-between items-center mt-6 text-white/20 text-xs'>
            <span>© 2026 EventSphere Management. All rights reserved.</span>
            <span>Built with MERN Stack</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy