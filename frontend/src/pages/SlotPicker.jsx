import { useEffect, useState } from 'react'

import { api } from '../api/client.js'

// รองรับ: FR-BKG-01, FR-BKG-06
const PACKAGE_OPTIONS = [
  { code: 'STD', label: 'มาตรฐาน' },
  { code: 'VIP', label: 'VIP' },
]

export default function SlotPicker() {
  const [packageCode, setPackageCode] = useState('STD')
  const [slots, setSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSlots = async () => {
      setLoading(true)
      const dateFrom = new Date().toISOString().slice(0, 10)
      const data = await api.getSlots({ dateFrom, packageCode })
      const nextSlots = Array.isArray(data) ? data : data.slots ?? []
      setSlots(nextSlots.filter((slot) => slot.package_code === packageCode))
      setSelectedSlotId(null)
      setLoading(false)
    }

    loadSlots()
  }, [packageCode])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">เลือกแพ็กเกจและช่วงเวลา</h1>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {PACKAGE_OPTIONS.map((option) => (
          <button
            key={option.code}
            type="button"
            onClick={() => setPackageCode(option.code)}
            className={[
              'rounded-full border px-4 py-2 font-medium transition',
              packageCode === option.code
                ? 'border-teal-600 bg-teal-600 text-white shadow'
                : 'border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:text-teal-700',
            ].join(' ')}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-600">ช่วงเวลาที่ว่าง</p>

        {loading ? (
          <p className="mt-3 text-slate-500">กำลังโหลดช่วงเวลา...</p>
        ) : slots.length === 0 ? (
          <p className="mt-3 text-amber-700">ไม่มีช่วงเวลาว่างสำหรับแพ็กเกจนี้</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                className={[
                  'rounded-xl border p-4 text-left transition',
                  selectedSlotId === slot.id
                    ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-100'
                    : 'border-slate-200 bg-slate-50 hover:border-teal-400 hover:bg-white',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold text-slate-900">{slot.start_time} น.</span>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
                    {slot.remaining} ที่ว่าง
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {slot.slot_date}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
