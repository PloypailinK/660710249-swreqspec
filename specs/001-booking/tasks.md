# Tasks: จองคิวตรวจสุขภาพ (Booking)
- Feature: จองคิวตรวจสุขภาพ (Booking)
- Spec ID: SPEC-BKG-001
- อ้างอิง: plan.md (v1), updated 2569-09-23
- วันที่: 2569-09-23

สรุป: มี 12 task ทั้งหมด และ 1 task ที่รอ Open Question (Q-02)
สรุปต่อ: งานที่รอ Q-02 คือเรื่องรูปแบบและการออกหมายเลขคิว โดยยังไม่เดาแนวทางใด ๆ

### T-01 สร้าง schema และ migration ฐานข้อมูล
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01, IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/app/config.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง slots, bookings, audit_logs และรองรับ PostgreSQL ที่ใช้งานได้
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 สร้าง API ค้นหาช่วงเวลาว่างตามแพ็กเกจ
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-PERF-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: backend/app/slots/router.py, backend/app/slots/service.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: GET /slots ส่งคืนช่วงเวลาว่างและจำนวนที่นั่งคงเหลือใน 2 วินาที p95 เมื่อทดสอบ 200 concurrent request
- สถานะ: พร้อมทำ

### T-03 สร้าง API จองคิวพื้นฐานและตัดที่นั่ง
- รองรับ: FR-BKG-04, IF-IDP-01
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/router.py, backend/app/booking/service.py
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: POST /bookings บันทึกการจองได้สำเร็จ ตัด remaining เป็น 0 และคืนหมายเลขคิวกลับ
- สถานะ: พร้อมทำ

### T-04 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, ASM-02
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/tests/test_AC_BKG_02.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: test_AC_BKG_02 ผ่าน โดยผู้ใช้ที่มีคิวยังไม่ใช้ในวันเดียวกันถูกปฏิเสธและได้รับคิวเดิมกลับ
- สถานะ: พร้อมทำ

### T-05 ตรวจสอบช่วงเวลาที่เต็มและเสนอ 3 ตัวเลือกใกล้ที่สุด
- รองรับ: FR-BKG-03, ASM-02
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/slots/service.py, backend/tests/test_AC_BKG_03.py
- ต้องทำหลัง: T-02, T-04
- เสร็จเมื่อ: test_AC_BKG_03 ผ่าน โดยระบบคืน 409 พร้อม 3 ช่วงที่ใกล้ที่สุดภายในวันเดียวกันและวันถัดไป และไม่เกิดการจองซ้อน
- สถานะ: พร้อมทำ

### T-06 จัดการคิวส่งข้อความและการส่งซ้ำ
- รองรับ: FR-BKG-05, IF-NOT-01, NFR-REL-02, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: backend/app/notify/queue.py, backend/app/booking/service.py, backend/tests/test_AC_BKG_04.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: test_AC_BKG_04 ผ่าน และมีรายการคิวส่งซ้ำที่ถูกกำหนดส่งภายใน 5 นาที โดยไม่ลบการจองเดิม
- สถานะ: พร้อมทำ

### T-07 สร้าง audit log สำหรับการเข้าถึงข้อมูลการจอง
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/audit/middleware.py, backend/app/main.py, backend/tests/test_AC_BKG_06.py
- ต้องทำหลัง: T-01, T-03
- เสร็จเมื่อ: test_AC_BKG_06 ผ่าน และทุกการเข้าถึงข้อมูลการจองมี audit log ที่ระบุ actor_id, accessed_at, hn
- สถานะ: พร้อมทำ

### T-08 เสริม lookup HIS และเก็บข้อมูลตามนโยบายความเป็นส่วนตัว
- รองรับ: IF-HIS-01, IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-08
- ไฟล์ที่แตะ: backend/app/his/client.py, backend/app/auth/idp.py, backend/app/booking/service.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ระบบค้นหาผู้รับบริการจาก HIS ด้วยเลขบัตรประชาชน แล้วใช้ HN ในฐานข้อมูลและไม่เก็บเลขบัตรประชาชนในตารางการจอง
- สถานะ: พร้อมทำ

### T-09 สร้างหน้าจอเลือกแพ็กเกจและเลือกช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-09
- ไฟล์ที่แตะ: frontend/src/pages/SlotPicker.jsx, frontend/src/App.jsx, frontend/src/api/client.js
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ผู้ใช้สามารถเลือกแพ็กเกจและเห็นช่วงเวลา/จำนวนที่นั่งคงเหลือแบบ mock API ได้ตามสัญญา API
- สถานะ: พร้อมทำ

### T-10 สร้างหน้าจอยืนยันและแสดงผลการจอง
- รองรับ: FR-BKG-03, FR-BKG-04, FR-BKG-05
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx, frontend/src/__tests__/AC-BKG-03.test.jsx
- ต้องทำหลัง: T-05, T-09
- เสร็จเมื่อ: หน้ายืนยันแสดง “ช่วงเวลาเต็ม” พร้อม 3 ตัวเลือก และหน้าแสดงผลแสดงหมายเลขคิวแม้การส่งข้อความไม่สำเร็จ
- สถานะ: พร้อมทำ

### T-11 กำหนดรูปแบบและการออกหมายเลขคิวตามคำตอบ Q-02
- รองรับ: FR-BKG-04, Q-02
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/db/models.py, frontend/src/pages/BookingResult.jsx
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: ระบบออกหมายเลขคิวตามรูปแบบที่ทีมยืนยันจากเจ้าหน้าที่เวชระเบียนและแสดงบนหน้าจอได้ถูกต้อง
- สถานะ: รอ Q-02

### T-12 ต่อหน้าจอกับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-12
- ไฟล์ที่แตะ: frontend/src/api/client.js, frontend/src/pages/SlotPicker.jsx, frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx
- ต้องทำหลัง: T-02, T-05, T-09, T-10
- เสร็จเมื่อ: หน้าจอเรียกใช้ API จริงผ่าน /api ได้ตามสัญญาดั้งเดิม โดยไม่มี mock และไม่ทำงานผิดพลาดจากระบบจริง
- สถานะ: พร้อมทำ

---

## ตารางตรวจความครบของ AC
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-03, T-11 |
| AC-BKG-02 | T-04 |
| AC-BKG-03 | T-05, T-10 |
| AC-BKG-04 | T-06 |
| AC-BKG-05 | T-02 |
| AC-BKG-06 | T-07 |

## ตารางตรวจความครบของ Constraint
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01 |
| DOM-PDPA-01 | T-01, T-07 |
| IF-IDP-01 | T-01, T-03, T-08 |
| IF-HIS-01 | T-01, T-08 |
| IF-NOT-01 | T-06 |

## สิ่งที่ยังไม่ทำ
- Q-02: หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น A001)? -> ถามเจ้าหน้าที่เวชระเบียน
  - รอ task: T-11
