// รองรับ: FR-BKG-01, FR-BKG-06
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

const toDateString = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

const mockSlotData = (packageCode) => {
  const slots = [
    { id: 1, slot_date: toDateString(0), start_time: '09:00', package_code: 'STD', remaining: 4 },
    { id: 2, slot_date: toDateString(0), start_time: '10:30', package_code: 'STD', remaining: 2 },
    { id: 3, slot_date: toDateString(1), start_time: '09:00', package_code: 'STD', remaining: 1 },
    { id: 4, slot_date: toDateString(0), start_time: '09:00', package_code: 'VIP', remaining: 3 },
    { id: 5, slot_date: toDateString(1), start_time: '11:00', package_code: 'VIP', remaining: 5 },
  ]

  return slots.filter((slot) => slot.package_code === packageCode)
}

export const api = {
  async getSlots({ dateFrom, packageCode }) {
    const params = new URLSearchParams({ date_from: dateFrom, package_code: packageCode })

    try {
      const res = await fetch(`${BASE}/slots?${params}`)
      if (!res.ok) {
        throw new Error('backend not ready')
      }
      const payload = await res.json()
      return Array.isArray(payload) ? payload : payload.slots ?? []
    } catch {
      return mockSlotData(packageCode).filter((slot) => slot.slot_date >= dateFrom)
    }
  },
  async createBooking({ slotId }) {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId }),
    })
    return { status: res.status, body: await res.json() }
  },
}
