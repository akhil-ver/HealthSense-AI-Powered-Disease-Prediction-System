import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stethoscope, Loader2 } from 'lucide-react';

const Assessment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    age: 32,
    bmi: 24,
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 72,
    smoking: 'never',
    exerciseFreq: 'weekly',
    selectedDisease: 'None',
    medicalHistory: '',
    sleepHours: 7,
    screenTime: 5,
    mood: 'good'
  });

  const handleSyncWearable = () => {
    setSyncing(true);
    // Simulate Apple Watch HealthKit sync delay
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        heartRate: Math.floor(Math.random() * (85 - 60 + 1) + 60), // Random realistic HR 60-85
        systolicBP: Math.floor(Math.random() * (130 - 110 + 1) + 110),
        diastolicBP: Math.floor(Math.random() * (85 - 70 + 1) + 70),
        sleepHours: (Math.random() * (8.5 - 5.5) + 5.5).toFixed(1) as any,
      }));
      setSyncing(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/analyze', {
        physical: {
          name: formData.name,
          age: Number(formData.age),
          bmi: Number(formData.bmi),
          systolicBP: Number(formData.systolicBP),
          diastolicBP: Number(formData.diastolicBP),
          heartRate: Number(formData.heartRate),
          smoking: formData.smoking,
          exerciseFreq: formData.exerciseFreq,
          selectedDisease: formData.selectedDisease,
          medicalHistory: formData.medicalHistory
        },
        mental: {
          sleepHours: Number(formData.sleepHours),
          screenTime: Number(formData.screenTime),
          mood: formData.mood
        }
      });

      localStorage.setItem('healthsense_analysis', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Medical processing error. Please verify your inputs and ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 space-y-4 md:space-y-0">
        <div>
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Risk Assessment</h2>
          <p className="text-slate-500 dark:text-slate-400">Enter patient data for AI processing.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="glass dark:glass-dark p-8 rounded-2xl space-y-6 hover-3d">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Patient Profile</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Patient Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">BMI</label>
            <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" required />
          </div>

          {/* Vitals */}
          <div className="lg:col-span-3 mt-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Clinical Vitals</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Heart Rate (BPM)</label>
            <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Systolic BP (mmHg)</label>
            <input type="number" name="systolicBP" value={formData.systolicBP} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Diastolic BP (mmHg)</label>
            <input type="number" name="diastolicBP" value={formData.diastolicBP} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" required />
          </div>

          {/* Lifestyle & Mental */}
          <div className="lg:col-span-3 mt-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Lifestyle & Wellness</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Sleep Hours / Night</label>
            <input type="number" step="0.1" name="sleepHours" value={formData.sleepHours} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Smoking Habit</label>
            <select name="smoking" value={formData.smoking} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white">
              <option value="never">Never</option>
              <option value="occasional">Occasional</option>
              <option value="regular">Regular</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Exercise Frequency</label>
            <select name="exerciseFreq" value={formData.exerciseFreq} onChange={handleChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white">
              <option value="never">Never</option>
              <option value="weekly">1-2 times/week</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          {/* Medical History */}
          <div className="lg:col-span-3 mt-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Past Medical History</h3>
          </div>
          <div className="lg:col-span-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Existing Conditions & Surgeries (Optional)</label>
            <textarea 
              name="medicalHistory" 
              value={formData.medicalHistory} 
              onChange={handleChange} 
              placeholder="E.g., Asthma, Hypertension, appendectomy in 2015..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white h-24" 
            />
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform mt-8">
          {loading ? <Loader2 className="animate-spin" /> : <Stethoscope />}
          <span>{loading ? 'Processing Medical Data...' : 'Run Full AI Analysis'}</span>
        </button>
      </form>
    </motion.div>
  );
};

export default Assessment;
