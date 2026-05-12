import React, { useEffect, useState } from 'react'
import axios from 'axios'



// Group booths into zones based on boothNumber prefix letter
const groupByZone = (booths) => {
  return booths.reduce((acc, booth) => {
    const zone = booth.boothNumber?.[0] || 'A'
    if (!acc[zone]) acc[zone] = []
    acc[zone].push(booth)
    return acc
  }, {})
}
const getVenueConfig = (type) => {
  switch (type) {
    case 'concert':
      return {
        entrance: '🎵 Stage — Front of House',
        zoneLabels: {
          A: 'Floor GA — Standing',
          B: 'Pit — Premium Standing',
          C: 'Lower Bowl Left',
          D: 'Lower Bowl Right',
          E: 'Upper Bowl Left',
          F: 'Upper Bowl Right',
          G: 'VIP Box Left',
          H: 'VIP Box Right',
          I: 'Balcony Left',
          J: 'Balcony Right',
        },
        zoneColors: {
          A: 'bg-purple-100 border-purple-300 text-purple-700',
          B: 'bg-pink-100 border-pink-300 text-pink-700',
          C: 'bg-blue-100 border-blue-300 text-blue-700',
          D: 'bg-blue-100 border-blue-300 text-blue-700',
          E: 'bg-indigo-100 border-indigo-300 text-indigo-700',
          F: 'bg-indigo-100 border-indigo-300 text-indigo-700',
          G: 'bg-amber-100 border-amber-300 text-amber-700',
          H: 'bg-amber-100 border-amber-300 text-amber-700',
          I: 'bg-gray-100 border-gray-300 text-gray-600',
          J: 'bg-gray-100 border-gray-300 text-gray-600',
        }
      }
    case 'sports':
      return {
        entrance: '⚽ Playing Field / Court',
        zoneLabels: {
          A: 'Pitch Side — North',
          B: 'Pitch Side — South',
          C: 'East Stand — Lower',
          D: 'West Stand — Lower',
          E: 'East Stand — Upper',
          F: 'West Stand — Upper',
          G: 'VIP Executive Box',
          H: 'Press & Media',
          I: 'Family Stand',
          J: 'Away Supporters',
        },
        zoneColors: {
          A: 'bg-green-100 border-green-300 text-green-700',
          B: 'bg-green-100 border-green-300 text-green-700',
          C: 'bg-orange-100 border-orange-300 text-orange-700',
          D: 'bg-orange-100 border-orange-300 text-orange-700',
          E: 'bg-red-100 border-red-300 text-red-600',
          F: 'bg-red-100 border-red-300 text-red-600',
          G: 'bg-amber-100 border-amber-300 text-amber-700',
          H: 'bg-gray-100 border-gray-300 text-gray-600',
          I: 'bg-blue-100 border-blue-300 text-blue-600',
          J: 'bg-yellow-100 border-yellow-300 text-yellow-700',
        }
      }
    default: // expo / exhibition
      return {
        entrance: '★ Main Entrance / Registration ★',
        zoneLabels: {
          A: 'Hall A — Technology',
          B: 'Hall B — Premium',
          C: 'Hall C — Innovation',
          D: 'Hall D — Startups',
          E: 'Central Pavilion',
          F: 'Hall F — Media',
          G: 'Hall G — Industry',
          H: 'Hall H — Research',
          I: 'Hall I — Consumer',
          J: 'Hall J — Global',
        },
        zoneColors: {
          A: 'bg-green-100 border-green-400 text-green-800',
          B: 'bg-amber-100 border-amber-400 text-amber-800',
          C: 'bg-blue-100 border-blue-400 text-blue-800',
          D: 'bg-purple-100 border-purple-400 text-purple-800',
          E: 'bg-teal-100 border-teal-400 text-teal-800',
          F: 'bg-red-100 border-red-400 text-red-700',
          G: 'bg-indigo-100 border-indigo-400 text-indigo-800',
          H: 'bg-pink-100 border-pink-400 text-pink-700',
          I: 'bg-orange-100 border-orange-400 text-orange-700',
          J: 'bg-cyan-100 border-cyan-400 text-cyan-800',
        }
      }
  }
}



const FloorPlan = ({ expoId, mode = 'view', onBoothSelect, eventType = 'expo' }) => {
  const [booths, setBooths] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [rows, setRows] = useState(4)
  const [cols, setCols] = useState(8)
  const [generating, setGenerating] = useState(false)
  const [tooltip, setTooltip] = useState(null)
  const config = getVenueConfig(eventType)
  const getBoothColor = (booth, isSelected) => {
    if (isSelected)
      return 'bg-[#FFA641] border-amber-600 text-[#2C3E50] scale-110 ring-2 ring-amber-300'
  
    if (booth.status === 'reserved')
      return 'bg-amber-100 border-amber-400 text-amber-800'
  
    if (booth.status === 'occupied')
      return 'bg-[#2C3E50] border-[#1a2a38] text-[#FFA641]'
  
    return (
      config.zoneColors[booth.boothNumber?.[0]] ||
      'bg-green-100 border-green-400 text-green-800'
    )
  }
  const token = localStorage.getItem('accessToken')
  const headers = { Authorization: `Bearer ${token}` }
  

  // change the fetchBooths function in FloorPlan.jsx
  const fetchBooths = async () => {
    try {
      setLoading(true)
      const url = mode === 'view'
        ? `http://localhost:8000/admin/booths/${expoId}`
        : mode === 'select'
        ? `http://localhost:8000/exhibitor/booths/${expoId}`
        : `http://localhost:8000/attendee/expos/${expoId}/floorplan`  // attendee
      const res = await axios.get(url, { headers })
      setBooths(res.data.data)
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (expoId) fetchBooths() }, [expoId])

  const handleGenerate = async () => {
    if (!confirm(`Generate ${rows * cols} booths? This clears existing booths.`)) return
    try {
      setGenerating(true)
      await axios.post('http://localhost:8000/admin/booths/generate',
        { expoId, rows, cols }, { headers })
      fetchBooths()
    } catch (e) { console.log(e) }
    finally { setGenerating(false) }
  }

  const handleSelect = (booth) => {
    if (booth.status !== 'available') return
    if (mode !== 'select') return
    const next = selected?._id === booth._id ? null : booth
    setSelected(next)
    onBoothSelect?.(next)
  }

  const zones = groupByZone(booths)
  const zoneKeys = Object.keys(zones).sort()

  const stats = {
    total: booths.length,
    available: booths.filter(b => b.status === 'available').length,
    reserved: booths.filter(b => b.status === 'reserved').length,
    occupied: booths.filter(b => b.status === 'occupied').length,
  }

  const isVisible = (booth) => {
    if (filter === 'all') return true
    if (filter === 'available') return booth.status === 'available'
    return booth.boothNumber?.[0] === filter
  }

  if (loading) return (
    <div className='flex items-center justify-center h-48'>
      <div className='w-7 h-7 border-4 border-[#FFA641] border-t-transparent rounded-full animate-spin' />
    </div>
  )

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>

      {/* Legend */}
      <div className='flex gap-4 mb-3 text-xs font-medium flex-wrap'>
        {[
          { label: 'Available', cls: 'bg-green-100 border-green-400' },
          { label: 'Reserved', cls: 'bg-amber-100 border-amber-400' },
          { label: 'Occupied', cls: 'bg-[#2C3E50]' },
          ...(mode === 'select' ? [{ label: 'Selected', cls: 'bg-[#FFA641]' }] : []),
        ].map(({ label, cls }) => (
          <span key={label} className='flex items-center gap-1.5 text-gray-500'>
            <span className={`w-3 h-3 rounded ${cls} border inline-block`} />
            {label}
          </span>
        ))}
      </div>

      {/* Admin generate controls */}
      {mode === 'view' && (
        <div className='flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl flex-wrap'>
          <span className='text-sm font-semibold text-[#2C3E50]'>Generate:</span>
          <input type='number' value={rows} onChange={e => setRows(+e.target.value)}
            min={1} max={26} className='w-14 h-8 px-2 text-sm text-center border
                 border-gray-200 rounded-lg outline-none focus:border-[#FFA641]' />
          <span className='text-gray-400 text-sm'>rows ×</span>
          <input type='number' value={cols} onChange={e => setCols(+e.target.value)}
            min={1} max={20} className='w-14 h-8 px-2 text-sm text-center border
                 border-gray-200 rounded-lg outline-none focus:border-[#FFA641]' />
          <span className='text-gray-400 text-sm'>cols</span>
          <button onClick={handleGenerate} disabled={generating}
            className='h-8 px-4 bg-[#FFA641] text-[#2C3E50] font-bold text-xs
                             rounded-lg hover:bg-[#ffb55a] disabled:opacity-50 transition-colors'>
            {generating ? 'Generating...' : 'Generate'}
          </button>
          <span className='text-xs text-gray-400'>{booths.length} booths</span>
        </div>
      )}

      {/* Filters */}
      {booths.length > 0 && (
        <div className='flex gap-2 mb-4 flex-wrap'>
          {[
            { key: 'all', label: 'All' },
            { key: 'available', label: 'Available' },
            ...zoneKeys.map(z => ({ key: z, label: config.zoneLabels[z] || `Hall ${z}` }))
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors
                      ${filter === key
                  ? 'bg-[#2C3E50] text-white border-[#2C3E50]'
                  : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
              {label}
            </button>
          ))}
        </div>
      )}

      {booths.length === 0 ? (
        <div className='text-center py-12 text-gray-400 text-sm bg-gray-50 rounded-xl'>
          {mode === 'view'
            ? 'No floor plan yet — set rows & cols above and click Generate.'
            : 'Floor plan not available yet for this expo.'}
        </div>
      ) : (
        <div className='bg-[#f0efe9] rounded-2xl p-4 overflow-auto'>

          {/* Stage */}
          <div className='bg-[#2C3E50] text-[#FFA641] text-xs font-bold text-center
                py-2 rounded-lg mb-4 tracking-widest uppercase'>
            {config.entrance}
          </div>

          {/* Zones grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {zoneKeys.map(zone => (
              <div key={zone}
                className='bg-white/70 rounded-xl p-3 border border-black/5'>
                <p className='text-xs font-bold uppercase tracking-wider text-gray-400 mb-2'>
                  {config.zoneLabels[zone] || `Hall ${zone}`}
                </p>
                <div className='flex flex-wrap gap-1.5'>
                  {zones[zone]
                    .sort((a, b) => (a.position?.x ?? 0) - (b.position?.x ?? 0))
                    .map(booth => {
                      const isSelected = selected?._id === booth._id
                      const visible = isVisible(booth)
                      return (
                        <button
                          key={booth._id}
                          onClick={() => handleSelect(booth)}
                          title={booth.assignedTo
                            ? `Assigned: ${booth.assignedTo.username}`
                            : `Booth ${booth.boothNumber} — ${booth.status}`}
                          className={`w-10 h-10 rounded-lg border-2 text-[10px] font-bold
                                      transition-all duration-150
                                      ${getBoothColor(booth, isSelected)}
                                      ${!visible ? 'opacity-20 pointer-events-none' : ''}`}
                        >
                          {booth.boothNumber}
                        </button>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats + selected */}
      {booths.length > 0 && (
        <div className='mt-3 bg-gray-50 rounded-xl px-4 py-3 flex items-center
                        justify-between flex-wrap gap-2'>
          <div className='flex gap-4 text-xs text-gray-400'>
            <span>Total: <strong className='text-[#2C3E50]'>{stats.total}</strong></span>
            <span>Available: <strong className='text-green-600'>{stats.available}</strong></span>
            <span>Reserved: <strong className='text-amber-600'>{stats.reserved}</strong></span>
            <span>Occupied: <strong className='text-[#2C3E50]'>{stats.occupied}</strong></span>
          </div>
          {selected && (
            <span className='text-xs font-semibold text-[#FFA641]'>
              ✓ Booth {selected.boothNumber} selected
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default FloorPlan