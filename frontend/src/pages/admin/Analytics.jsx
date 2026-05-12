import React, { useEffect, useState } from 'react'
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Users, Store, CalendarDays, CheckCircle, Clock, XCircle } from 'lucide-react'


const Analytics = () => {
  const [expos, setExpos] = useState([])
  const [selectedExpo, setSelectedExpo] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const res = await axios.get('http://localhost:8000/admin/expos', { headers })
        setExpos(res.data.data)
        if (res.data.data.length > 0) setSelectedExpo(res.data.data[0]._id)
      } catch (error) { console.log(error) }
    }
    fetchExpos()
  }, [])

  useEffect(() => {
    if (!selectedExpo) return
    const fetchAnalytics = async () => {
      setLoading(true)
      setData(null)
      try {
        const res = await axios.get(`http://localhost:8000/admin/analytics/${selectedExpo}`, { headers })
        setData(res.data.data)
      } catch (error) { console.log(error) }
      finally { setLoading(false) }
    }
    fetchAnalytics()
  }, [selectedExpo])
  const exportCSV = () => {
    if (!data) return
    const rows = [
      ['Metric', 'Value'],
      ['Total Attendees', data.totalAttendees],
      ['Total Exhibitors', data.totalExhibitors],
      ['Total Sessions', data.totalSessions],
      ['Pending Apps', data.applications.pending],
      ['Approved Apps', data.applications.approved],
      ['Rejected Apps', data.applications.rejected],
      ['Total Booths', data.boothStats.total],
      ['Available Booths', data.boothStats.available],
      ['Reserved Booths', data.boothStats.reserved],
      ['Occupied Booths', data.boothStats.occupied],
      ...data.sessionPopularity.map(s => [`Session: ${s.title}`, s.registrations]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `analytics-${selectedExpo}.csv`; a.click()
  }

  const exportPDF = () => {
    if (!data) return
    const doc = new jsPDF()
    const expo = expos.find(e => e._id === selectedExpo)

    doc.setFontSize(18)
    doc.setTextColor(44, 62, 80)
    doc.text(`Analytics Report`, 14, 20)
    doc.setFontSize(12)
    doc.setTextColor(100)
    doc.text(expo?.title || '', 14, 28)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35)

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Attendees', data.totalAttendees],
        ['Total Exhibitors', data.totalExhibitors],
        ['Total Sessions', data.totalSessions],
        ['Pending Apps', data.applications.pending],
        ['Approved Apps', data.applications.approved],
        ['Rejected Apps', data.applications.rejected],
        ['Total Booths', data.boothStats.total],
        ['Available Booths', data.boothStats.available],
        ['Occupied Booths', data.boothStats.occupied],
      ],
      headStyles: { fillColor: [44, 62, 80] },
    })

    if (data.sessionPopularity.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Session', 'Registrations']],
        body: data.sessionPopularity.map(s => [s.title, s.registrations]),
        headStyles: { fillColor: [255, 166, 65], textColor: [44, 62, 80] },
      })
    }

    doc.save(`analytics-${expo?.title || selectedExpo}.pdf`)
  }

  const statCards = data ? [
    { label: 'Total Attendees', value: data.totalAttendees, icon: Users, color: 'bg-[#2C3E50]' },
    { label: 'Exhibitors', value: data.totalExhibitors, icon: Store, color: 'bg-[#FFA641]' },
    { label: 'Sessions', value: data.totalSessions, icon: CalendarDays, color: 'bg-blue-500' },
    { label: 'Pending Apps', value: data.applications.pending, icon: Clock, color: 'bg-orange-400' },
    { label: 'Approved Apps', value: data.applications.approved, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Rejected Apps', value: data.applications.rejected, icon: XCircle, color: 'bg-red-400' },
  ] : []

  return (
    <div>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
        <div>
          <h2 className='text-xl font-bold text-[#2C3E50]'>Analytics</h2>
          <p className='text-gray-400 text-sm'>Real-time expo performance</p>
        </div>

        <select
          value={selectedExpo}
          onChange={e => setSelectedExpo(e.target.value)}
          className='h-10 px-3 rounded-lg border border-gray-200 bg-white
                           text-[#2C3E50] text-sm outline-none focus:border-[#FFA641]
                           flex-1 md:flex-none' 
        >
          {expos.map(expo => (
            <option key={expo._id} value={expo._id}>{expo.title}</option>
          ))}
        </select>
        <div className='flex gap-2'>
          <button onClick={exportCSV}
            className='flex items-center gap-1.5 h-9 px-4 border border-gray-200
                     text-[#2C3E50] text-xs font-bold rounded-lg
                     hover:border-[#FFA641] transition-colors'>
            ↓ Export CSV
          </button>
          <button onClick={exportPDF}
            className='flex items-center gap-1.5 h-9 px-4 bg-[#2C3E50] text-white
                     text-xs font-bold rounded-lg hover:bg-[#FFA641] hover:text-[#2C3E50]
                     transition-colors'>
            ↓ Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='w-8 h-8 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
        </div>
      ) : !data ? (
        <div className='bg-white rounded-xl border border-gray-100 py-16 text-center'>
          <p className='text-gray-400 text-sm'>Select an expo to view analytics.</p>
        </div>
      ) : (
        <div className='space-y-6'>

          {/* Stat cards */}
          <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className='bg-white rounded-xl p-5 border border-gray-100'>
                <div className='flex items-center justify-between mb-3'>
                  <p className='text-gray-400 text-sm font-medium'>{label}</p>
                  <div className={`${color} w-9 h-9 rounded-lg flex items-center justify-center`}>
                    <Icon className='w-4 h-4 text-white' />
                  </div>
                </div>
                <p className='text-3xl font-bold text-[#2C3E50]'>{value}</p>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

            {/* Booth occupancy */}
            <div className='bg-white rounded-xl border border-gray-100 p-5'>
              <h3 className='font-bold text-[#2C3E50] mb-4'>Booth Occupancy</h3>
              <div className='space-y-3'>
                {[
                  { label: 'Available', value: data.boothStats.available, color: 'bg-green-400', total: data.boothStats.total },
                  { label: 'Reserved', value: data.boothStats.reserved, color: 'bg-orange-400', total: data.boothStats.total },
                  { label: 'Occupied', value: data.boothStats.occupied, color: 'bg-[#2C3E50]', total: data.boothStats.total },
                ].map(({ label, value, color, total }) => {
                  const pct = total > 0 ? Math.round((value / total) * 100) : 0
                  return (
                    <div key={label}>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='font-medium text-[#2C3E50]'>{label}</span>
                        <span className='text-gray-400'>{value} / {total} ({pct}%)</span>
                      </div>
                      <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                        <div className={`h-full ${color} rounded-full transition-all`}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className='text-xs text-gray-400 mt-4'>Total booths: {data.boothStats.total}</p>
            </div>

            {/* Session popularity */}
            <div className='bg-white rounded-xl border border-gray-100 p-5'>
              <h3 className='font-bold text-[#2C3E50] mb-4'>Session Popularity</h3>
              {data.sessionPopularity.length === 0 ? (
                <p className='text-gray-400 text-sm text-center py-8'>No sessions yet.</p>
              ) : (
                <div className='space-y-3'>
                  {data.sessionPopularity.map((s, i) => {
                    const max = data.sessionPopularity[0]?.registrations || 1
                    const pct = Math.round((s.registrations / max) * 100)
                    return (
                      <div key={i}>
                        <div className='flex justify-between text-sm mb-1'>
                          <span className='font-medium text-[#2C3E50] truncate max-w-[200px]'>{s.title}</span>
                          <span className='text-gray-400 flex-shrink-0 ml-2'>{s.registrations} registered</span>
                        </div>
                        <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                          <div className='h-full bg-[#FFA641] rounded-full transition-all'
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Application breakdown */}
            <div className='bg-white rounded-xl border border-gray-100 p-5 lg:col-span-2'>
              <h3 className='font-bold text-[#2C3E50] mb-4'>Application Breakdown</h3>
              <div className='grid grid-cols-3 gap-4'>
                {[
                  { label: 'Pending', value: data.applications.pending, color: 'text-orange-500', bg: 'bg-orange-50' },
                  { label: 'Approved', value: data.applications.approved, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Rejected', value: data.applications.rejected, color: 'text-red-500', bg: 'bg-red-50' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-5 text-center`}>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    <p className='text-sm text-gray-500 mt-1'>{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics