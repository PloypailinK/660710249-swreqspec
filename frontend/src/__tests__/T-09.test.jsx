import { fireEvent, render, screen } from '@testing-library/react'
import App from '../App.jsx'
import { api } from '../api/client.js'

test('T-09: หน้ารองรับการเลือกแพ็กเกจและแสดงช่วงเวลาว่าง', async () => {
  const getSlotsSpy = vi.spyOn(api, 'getSlots').mockResolvedValue([
    { id: 1, slot_date: '2026-09-23', start_time: '09:00', package_code: 'STD', remaining: 4 },
    { id: 2, slot_date: '2026-09-23', start_time: '10:30', package_code: 'STD', remaining: 2 },
    { id: 3, slot_date: '2026-09-24', start_time: '09:00', package_code: 'VIP', remaining: 3 },
  ])

  render(<App />)

  expect(await screen.findByText('เลือกแพ็กเกจและช่วงเวลา')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'มาตรฐาน' })).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'มาตรฐาน' }))

  expect(await screen.findByText('09:00 น.')).toBeTruthy()
  expect(screen.getByText('4 ที่ว่าง')).toBeTruthy()
  expect(getSlotsSpy).toHaveBeenCalledWith({ dateFrom: expect.any(String), packageCode: 'STD' })
})
