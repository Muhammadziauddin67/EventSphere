import React, { useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { CreditCard, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const paymentMethods = [
  { id: 'card',      label: 'Credit / Debit Card',  icon: '💳' },
  { id: 'paypal',    label: 'PayPal',               icon: '🅿️' },
  { id: 'stripe',    label: 'Stripe',               icon: '⚡' },
  { id: 'easypaisa', label: 'EasyPaisa',            icon: '📱' },
  { id: 'applepay',  label: 'Apple Pay',            icon: '🍎' },
]

const PaymentPage = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { expoId, tierName, quantity, price, eventTitle } = location.state || {}

  const [method,    setMethod]    = useState('card')
  const [loading,   setLoading]   = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [cardForm,  setCardForm]  = useState({
    name: '', number: '', expiry: '', cvv: ''
  })

  const token   = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  const handleConfirm = async () => {
    if (method === 'card') {
      if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvv)
        return toast.error('Please fill in all card details')
    }
    try {
      setLoading(true)
      await axios.post('http://localhost:8000/attendee/tickets', {
        expoId, tierName, quantity
      }, { headers })
      setConfirmed(true)
      setTimeout(() => navigate('/my-tickets'), 2500)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Payment failed')
    } finally { setLoading(false) }
  }

  const inputClass = `w-full h-11 px-4 rounded-lg border border-gray-200 bg-white
    text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
    focus:ring-2 focus:ring-[#FFA641]/20 transition-all placeholder:text-gray-300`

  if (confirmed) return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='min-h-screen bg-[#f7f6f2] flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl p-12 text-center max-w-md w-full'>
        <div className='w-20 h-20 rounded-full bg-green-50 flex items-center
                        justify-center mx-auto mb-6'>
          <CheckCircle className='w-10 h-10 text-green-500' />
        </div>
        <h2 className='text-2xl font-bold text-[#2C3E50] mb-2'>Payment Confirmed!</h2>
        <p className='text-gray-400 text-sm mb-1'>
          Your booking for <strong>{eventTitle}</strong> is confirmed.
        </p>
        <p className='text-gray-300 text-xs'>Redirecting to My Tickets...</p>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}
         className='min-h-screen bg-[#f7f6f2] px-4 md:px-16 py-12'>
      <button onClick={() => navigate(-1)}
              className='flex items-center gap-2 text-gray-400 hover:text-[#2C3E50]
                         text-sm mb-6 transition-colors'>
        <ArrowLeft className='w-4 h-4' /> Back
      </button>

      <div className='max-w-2xl mx-auto'>
        <p className='text-[#FFA641] text-xs font-bold tracking-widest uppercase mb-2'>Checkout</p>
        <h1 className='text-3xl font-bold text-[#2C3E50] mb-8'>Complete your booking</h1>

        {/* Order summary */}
        <div className='bg-[#2C3E50] rounded-2xl p-5 mb-6 flex items-center justify-between'>
          <div>
            <p className='text-white/60 text-xs mb-1'>Booking for</p>
            <p className='text-white font-bold'>{eventTitle}</p>
            <p className='text-white/60 text-xs mt-1'>
              {quantity} × {tierName}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-[#FFA641] text-2xl font-bold'>${price}</p>
            <p className='text-white/40 text-xs'>total</p>
          </div>
        </div>

        {/* Payment method selection */}
        <div className='bg-white rounded-2xl border border-gray-100 p-6 mb-5'>
          <h3 className='font-bold text-[#2C3E50] mb-4'>Select payment method</h3>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            {paymentMethods.map(pm => (
              <button key={pm.id}
                      onClick={() => setMethod(pm.id)}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold
                                  flex items-center gap-2 transition-colors
                                  ${method === pm.id
                                    ? 'border-[#FFA641] bg-[#FFA641]/10 text-[#2C3E50]'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <span className='text-lg'>{pm.icon}</span>
                <span className='text-xs'>{pm.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card form — only for card */}
        {method === 'card' && (
          <div className='bg-white rounded-2xl border border-gray-100 p-6 mb-5 space-y-4'>
            <h3 className='font-bold text-[#2C3E50]'>Card details</h3>
            <div>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                Cardholder name
              </label>
              <input type='text' placeholder='John Smith' value={cardForm.name}
                     onChange={e => setCardForm(p => ({ ...p, name: e.target.value }))}
                     className={inputClass} />
            </div>
            <div>
              <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                Card number
              </label>
              <input type='text' placeholder='1234 5678 9012 3456'
                     maxLength={19}
                     value={cardForm.number}
                     onChange={e => setCardForm(p => ({
                       ...p,
                       number: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim()
                     }))}
                     className={inputClass} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>
                  Expiry date
                </label>
                <input type='text' placeholder='MM/YY' maxLength={5}
                       value={cardForm.expiry}
                       onChange={e => setCardForm(p => ({ ...p, expiry: e.target.value }))}
                       className={inputClass} />
              </div>
              <div>
                <label className='block text-sm font-semibold text-[#2C3E50] mb-1.5'>CVV</label>
                <input type='text' placeholder='123' maxLength={4}
                       value={cardForm.cvv}
                       onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value }))}
                       className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {/* PayPal / other methods */}
        {method !== 'card' && (
          <div className='bg-white rounded-2xl border border-gray-100 p-6 mb-5 text-center'>
            <p className='text-3xl mb-3'>
              {paymentMethods.find(p => p.id === method)?.icon}
            </p>
            <p className='text-[#2C3E50] font-semibold mb-1'>
              Pay with {paymentMethods.find(p => p.id === method)?.label}
            </p>
            <p className='text-gray-400 text-sm'>
              Click confirm to proceed with {paymentMethods.find(p => p.id === method)?.label} payment.
            </p>
          </div>
        )}

        <button onClick={handleConfirm} disabled={loading}
                className='w-full h-12 bg-[#FFA641] hover:bg-[#ffb55a] disabled:opacity-60
                           text-[#2C3E50] font-bold text-base rounded-xl
                           flex items-center justify-center gap-2 transition-colors'>
          {loading
            ? <><Loader2 className='w-5 h-5 animate-spin' /> Processing...</>
            : `Confirm & Pay $${price}`
          }
        </button>

        <p className='text-center text-xs text-gray-300 mt-4'>
          🔒 Your payment is secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  )
}

export default PaymentPage