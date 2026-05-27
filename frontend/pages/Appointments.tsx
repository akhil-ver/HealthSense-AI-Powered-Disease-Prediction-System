import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Video, CheckCircle2, X } from 'lucide-react';

const initialAppointments = [
  {
    id: 1,
    doctor: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    date: '2026-10-24',
    time: '10:00 AM',
    type: 'In-person',
    location: 'HealthSense Central Clinic, Room 402'
  },
  {
    id: 2,
    doctor: 'Dr. Marcus Webb',
    specialty: 'Therapist',
    date: '2026-10-28',
    time: '2:30 PM',
    type: 'Video Consult',
    location: 'Online via HealthSense Portal'
  }
];

const Appointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    type: 'In-person',
    location: 'HealthSense Central Clinic, Room 402'
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt = {
      ...formData,
      id: Date.now(),
      location: formData.type === 'Video Consult' ? 'Online via HealthSense Portal' : 'HealthSense Central Clinic, Room 402'
    };
    setAppointments([...appointments, newApt]);
    setShowModal(false);
    setFormData({ doctor: '', specialty: '', date: '', time: '', type: 'In-person', location: '' });
  };

  const handleCancel = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your clinical visits and consultations.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-blue-500/30">
          Book New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            No upcoming appointments.
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="glass dark:glass-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover-3d transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${apt.doctor.replace(' ', '')}`} alt={apt.doctor} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{apt.doctor}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{apt.specialty}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center space-x-1 border border-green-200 dark:border-green-800">
                  <CheckCircle2 size={12} />
                  <span>Confirmed</span>
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <CalendarIcon size={18} className="text-slate-400" />
                  <span className="font-medium">{apt.date}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Clock size={18} className="text-slate-400" />
                  <span className="font-medium">{apt.time}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  {apt.type === 'Video Consult' ? <Video size={18} className="text-slate-400" /> : <MapPin size={18} className="text-slate-400" />}
                  <span className="font-medium">{apt.location}</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition" onClick={() => handleCancel(apt.id)}>
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Book Appointment</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Doctor Name</label>
                  <input required type="text" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Dr. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Specialty</label>
                  <input required type="text" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="General Practitioner" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                    <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultation Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white">
                    <option>In-person</option>
                    <option>Video Consult</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition">
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Appointments;
