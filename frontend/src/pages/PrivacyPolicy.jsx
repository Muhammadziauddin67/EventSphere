import React from 'react'
import { useNavigate } from 'react-router-dom'

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us when you create an account, book tickets, or contact us. This includes your name, email address, payment information, and any other information you choose to provide. We also collect information automatically when you use our services, including log data, device information, and usage patterns.`
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve our services; process transactions and send related information; send promotional communications (with your consent); monitor and analyze usage patterns; and comply with legal obligations. We do not sell your personal information to third parties.`
  },
  {
    title: '3. Information Sharing',
    content: `We may share your information with event organizers when you book tickets or register for events, with service providers who assist in our operations, and when required by law. Exhibitors may see your name and contact details if you initiate contact with them through our platform.`
  },
  {
    title: '4. Data Security',
    content: `We implement industry-standard security measures to protect your personal information, including SSL encryption for all data in transit and bcrypt hashing for passwords. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
  },
  {
    title: '5. Cookies',
    content: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, some parts of our service may not function properly without cookies.`
  },
  {
    title: '6. Your Rights',
    content: `You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of your data or opt out of marketing communications. To exercise these rights, contact us at privacy@eventsphere.com.`
  },
  {
    title: '7. Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it by law.`
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date. We encourage you to review this policy periodically.`
  },
]

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }} className='bg-[#f7f6f2] min-h-screen'>
      <div className='bg-[#2C3E50] px-4 md:px-16 py-16'>
        <h1 className='text-4xl font-bold text-white mb-3'>Privacy Policy</h1>
        <p className='text-white/60'>Last updated: May 11, 2026</p>
      </div>

      <div className='px-4 md:px-16 py-12 max-w-4xl'>
        <div className='bg-white rounded-2xl border border-gray-100 p-8 mb-6'>
          <p className='text-gray-500 leading-relaxed'>
            EventSphere Management ("we", "us", or "our") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your personal information
            when you use our platform. By using EventSphere, you agree to the collection and use of
            information in accordance with this policy.
          </p>
        </div>

        <div className='space-y-4'>
          {sections.map(({ title, content }) => (
            <div key={title} className='bg-white rounded-xl border border-gray-100 p-6'>
              <h2 className='font-bold text-[#2C3E50] text-base mb-3'>{title}</h2>
              <p className='text-gray-500 text-sm leading-relaxed'>{content}</p>
            </div>
          ))}
        </div>

        <div className='bg-[#2C3E50] rounded-2xl p-6 mt-6 text-center'>
          <p className='text-white/70 text-sm mb-3'>
            Questions about our privacy practices?
          </p>
          <button onClick={() => navigate('/feedback')}
                  className='bg-[#FFA641] text-[#2C3E50] font-bold px-6 py-2.5
                             rounded-lg hover:bg-[#ffb55a] transition-colors text-sm'>
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy