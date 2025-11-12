// Mock data for AudEase application
import { addDays, subDays, format } from 'date-fns';

export const auditoriums = [
  { id: 'aud1', name: 'Main Auditorium', capacity: 500, location: 'Building A, Ground Floor' },
  { id: 'aud2', name: 'Seminar Hall A', capacity: 150, location: 'Building B, 2nd Floor' },
  { id: 'aud3', name: 'Seminar Hall B', capacity: 100, location: 'Building B, 3rd Floor' },
  { id: 'aud4', name: 'Conference Room', capacity: 50, location: 'Admin Block, 1st Floor' },
];

export const bookings = [
  {
    id: '1',
    title: 'Annual Tech Conference 2024',
    eventType: 'Conference',
    description: 'A comprehensive technology conference featuring industry leaders',
    auditoriumId: 'aud1',
    auditoriumName: 'Main Auditorium',
    date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    audienceSize: 450,
    seatingLayout: 'Theater',
    avRequirements: ['Projector', 'Microphone', 'Sound System', 'Live Streaming'],
    status: 'approved',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@university.edu',
    createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    approvedAt: format(subDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    approvedBy: 'Admin User',
  },
  {
    id: '2',
    title: 'Machine Learning Workshop',
    eventType: 'Workshop',
    description: 'Hands-on workshop on ML algorithms and applications',
    auditoriumId: 'aud2',
    auditoriumName: 'Seminar Hall A',
    date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '18:00',
    audienceSize: 80,
    seatingLayout: 'Classroom',
    avRequirements: ['Projector', 'Microphone'],
    status: 'pending',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@university.edu',
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: '3',
    title: 'Cultural Night 2024',
    eventType: 'Cultural Event',
    description: 'Annual cultural fest celebrating diversity',
    auditoriumId: 'aud1',
    auditoriumName: 'Main Auditorium',
    date: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    startTime: '18:00',
    endTime: '22:00',
    audienceSize: 500,
    seatingLayout: 'Theater',
    avRequirements: ['Sound System', 'Lighting', 'Video Recording'],
    status: 'pending',
    userId: 'user3',
    userName: 'Mike Johnson',
    userEmail: 'mike@university.edu',
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: '4',
    title: 'Blockchain Seminar',
    eventType: 'Seminar',
    description: 'Introduction to blockchain technology and cryptocurrencies',
    auditoriumId: 'aud3',
    auditoriumName: 'Seminar Hall B',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '13:00',
    audienceSize: 60,
    seatingLayout: 'U-Shape',
    avRequirements: ['Projector'],
    status: 'approved',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@university.edu',
    createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    approvedAt: format(subDays(new Date(), 18), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    completedAt: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
  {
    id: '5',
    title: 'Department Meeting',
    eventType: 'Conference',
    description: 'Quarterly department review meeting',
    auditoriumId: 'aud4',
    auditoriumName: 'Conference Room',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    startTime: '15:00',
    endTime: '17:00',
    audienceSize: 30,
    seatingLayout: 'Conference',
    avRequirements: ['Projector'],
    status: 'approved',
    userId: 'user4',
    userName: 'Sarah Williams',
    userEmail: 'sarah@university.edu',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    approvedAt: format(subDays(new Date(), 4), 'yyyy-MM-dd\'T\'HH:mm:ss'),
  },
];

export const users = [
  { id: 'user1', name: 'John Doe', email: 'john@university.edu', role: 'student', department: 'Computer Science' },
  { id: 'user2', name: 'Jane Smith', email: 'jane@university.edu', role: 'faculty', department: 'Data Science' },
  { id: 'user3', name: 'Mike Johnson', email: 'mike@university.edu', role: 'student', department: 'Cultural Committee' },
  { id: 'user4', name: 'Sarah Williams', email: 'sarah@university.edu', role: 'faculty', department: 'Engineering' },
  { id: 'admin1', name: 'Admin User', email: 'admin@university.edu', role: 'admin', department: 'Administration' },
];

export const stats = {
  totalBookings: 156,
  upcomingBookings: 12,
  pendingApprovals: 8,
  approvedThisMonth: 45,
  rejectedThisMonth: 3,
  utilizationRate: 78,
  totalThisSemester: 124,
  approved: 87,
  pending: 22,
  utilizationPct: 68,
};

export const notifications = [
  {
    id: 'n1',
    title: 'Booking Approved',
    message: 'Your booking for "Annual Tech Conference 2024" has been approved',
    type: 'success',
    read: false,
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    bookingId: '1',
  },
  {
    id: 'n2',
    title: 'New Booking Request',
    message: 'Jane Smith submitted a new booking request for Machine Learning Workshop',
    type: 'info',
    read: false,
    createdAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    bookingId: '2',
  },
  {
    id: 'n3',
    title: 'Upcoming Event',
    message: 'Your event "Department Meeting" is scheduled for tomorrow',
    type: 'warning',
    read: true,
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    bookingId: '5',
  },
];

// Analytics data
export const bookingsPerAuditorium = [
  { name: 'Main Auditorium', bookings: 45 },
  { name: 'Seminar Hall A', bookings: 32 },
  { name: 'Seminar Hall B', bookings: 28 },
  { name: 'Conference Room', bookings: 51 },
];

export const bookingStatusDistribution = [
  { name: 'Approved', value: 45, color: '#10b981' },
  { name: 'Pending', value: 8, color: '#f59e0b' },
  { name: 'Rejected', value: 3, color: '#ef4444' },
];

export const bookingsOverTime = [
  { date: '2024-10-01', bookings: 8 },
  { date: '2024-10-05', bookings: 12 },
  { date: '2024-10-10', bookings: 15 },
  { date: '2024-10-15', bookings: 11 },
  { date: '2024-10-20', bookings: 18 },
  { date: '2024-10-25', bookings: 14 },
  { date: '2024-10-30', bookings: 16 },
  { date: '2024-11-04', bookings: 20 },
  { date: '2024-11-09', bookings: 17 },
];

// Helper functions
export const getUpcomingBookings = () => {
  const today = new Date();
  return bookings.filter(b => new Date(b.date) >= today && b.status === 'approved');
};

export const getPendingBookings = () => {
  return bookings.filter(b => b.status === 'pending');
};

export const getUserBookings = (userId) => {
  return bookings.filter(b => b.userId === userId);
};

export const getBookingsByStatus = (status) => {
  return bookings.filter(b => b.status === status);
};

export const getBookingsByAuditorium = (auditoriumId) => {
  return bookings.filter(b => b.auditoriumId === auditoriumId);
};

export default { bookings, users, stats, auditoriums, notifications, bookingsPerAuditorium, bookingStatusDistribution, bookingsOverTime }

