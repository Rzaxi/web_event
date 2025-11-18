-- FIX ROLE ORGANIZER SARI.PRO - LANGSUNG TANPA CEK
-- Copy paste semua, langsung run!

-- Update role jadi event_organizer_pro
UPDATE Users 
SET role = 'event_organizer_pro' 
WHERE email = 'sari.pro@gmail.com';

-- Verify (optional, bisa skip)
SELECT id, nama, email, role FROM Users WHERE email = 'sari.pro@gmail.com';
P