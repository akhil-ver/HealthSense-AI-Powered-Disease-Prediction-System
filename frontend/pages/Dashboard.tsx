import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Brain, AlertCircle, Download, TriangleAlert, Pill, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import axios from 'axios';

const Dashboard = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('healthsense_analysis');
    if (saved) {
      setAnalysis(JSON.parse(saved));
    }
    
    // Fetch all patients for Doctor Dashboard view
    axios.get('http://localhost:3001/api/patients')
      .then(res => setAllPatients(res.data))
      .catch(err => console.error("Failed to fetch patients", err));
  }, []);

  const handleDownloadPDF = () => {
    if (!analysis) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('HealthSense AI - Clinical Report', 20, 20);
    doc.setFontSize(14);
    doc.text(`Stability Score: ${analysis.stabilityScore}/100 (${analysis.stabilityZone})`, 20, 40);
    doc.text(`Physical Risk Level: ${analysis.physicalRisk.level}`, 20, 50);
    doc.text(`Mental Stress Score: ${analysis.mentalWellness.stressScore}/100`, 20, 60);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(`Clinical Analysis: ${analysis.explanation}`, 170);
    doc.text(splitText, 20, 80);
    
    // Add General Medicines to PDF
    doc.text('Recommended Medicines / Remedies:', 20, 120);
    analysis.clinicalAdvice.generalMedicines.forEach((med: string, i: number) => {
      doc.text(`- ${med}`, 20, 130 + (i * 10));
    });

    doc.save('HealthSense_Report.pdf');
  };

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-500 mb-6">
          <Activity size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Health Data Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
          You haven't run a health analysis yet. Head over to the Risk Assessment page to get started.
        </p>
        <Link to="/assessment" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          Run Health Assessment
        </Link>
      </div>
    );
  }

  const isCritical = analysis.physicalRisk.level === 'High' || analysis.physicalRisk.level === 'Critical';

  // Mock historical data for Recharts based on current score
  const chartData = [
    { day: 'Mon', heartRate: 72, stress: analysis.mentalWellness.stressScore - 5 },
    { day: 'Tue', heartRate: 75, stress: analysis.mentalWellness.stressScore + 2 },
    { day: 'Wed', heartRate: 71, stress: analysis.mentalWellness.stressScore - 10 },
    { day: 'Thu', heartRate: 78, stress: analysis.mentalWellness.stressScore + 15 },
    { day: 'Fri', heartRate: 74, stress: analysis.mentalWellness.stressScore },
    { day: 'Sat', heartRate: 70, stress: analysis.mentalWellness.stressScore - 20 },
    { day: 'Sun', heartRate: 73, stress: analysis.mentalWellness.stressScore },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Health Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Your AI-generated clinical overview.</p>
        </div>
        <button onClick={handleDownloadPDF} className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg">
          <Download size={18} />
          <span>Export PDF</span>
        </button>
      </div>

      {isCritical && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-2xl flex items-start space-x-4">
          <TriangleAlert className="text-red-600 mt-1 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-red-800 text-lg">Critical Health Warning</h3>
            <p className="text-red-700">The AI has detected critical physical risk factors. Immediate consultation with a healthcare professional is strongly recommended.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass dark:glass-dark p-6 rounded-2xl border-t-4 border-blue-500 hover-3d">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Stability Score</h3>
            <Activity className="text-blue-500" />
          </div>
          <p className="text-4xl font-black text-slate-800 dark:text-white">{analysis.stabilityScore}<span className="text-lg text-slate-400">/100</span></p>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-2">{analysis.stabilityZone}</p>
        </div>

        <div className="glass dark:glass-dark p-6 rounded-2xl border-t-4 border-rose-500 hover-3d">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Physical Risk</h3>
            <Heart className="text-rose-500" />
          </div>
          <p className="text-4xl font-black text-slate-800 dark:text-white">{analysis.physicalRisk.level}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Score: {analysis.physicalRisk.score}/100</p>
        </div>

        <div className="glass dark:glass-dark p-6 rounded-2xl border-t-4 border-purple-500 hover-3d">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Mental Stress</h3>
            <Brain className="text-purple-500" />
          </div>
          <p className="text-4xl font-black text-slate-800 dark:text-white">{analysis.mentalWellness.stressScore}<span className="text-lg text-slate-400">/100</span></p>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-2">{analysis.mentalWellness.burnoutWarning ? 'High Burnout Risk' : 'Manageable Levels'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass dark:glass-dark p-8 rounded-2xl hover-3d">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Vitals Trends</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Heart Rate (BPM)" />
                <Line type="monotone" dataKey="stress" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Stress Level" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="glass dark:glass-dark p-8 rounded-2xl flex-1 hover-3d">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center"><AlertCircle className="mr-2 text-amber-500" /> AI Explanation</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.explanation}</p>
          </div>
          <div className="glass dark:glass-dark p-8 rounded-2xl flex-1 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-slate-800 border-t-4 border-indigo-500 hover-3d">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center"><Pill className="mr-2 text-indigo-500" /> General Medicines</h3>
            <ul className="space-y-3">
              {analysis.clinicalAdvice.generalMedicines.map((med: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                  <span>{med}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Doctor Dashboard: All Patients Table */}
      {allPatients.length > 0 && (
        <div className="glass dark:glass-dark p-8 rounded-2xl mt-12 border border-slate-200 dark:border-slate-700 hover-3d">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">All Patients Directory</h3>
              <p className="text-slate-500 dark:text-slate-400">System overview (Doctor Privileges)</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                  <th className="pb-4 font-semibold px-4">Patient Name</th>
                  <th className="pb-4 font-semibold px-4">Age</th>
                  <th className="pb-4 font-semibold px-4">Gender</th>
                  <th className="pb-4 font-semibold px-4">Latest Stability</th>
                  <th className="pb-4 font-semibold px-4">Physical Risk</th>
                  <th className="pb-4 font-semibold px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {allPatients.map(p => {
                  const latestRecord = p.HealthRecords?.[0];
                  const latestPrediction = p.Predictions?.[0];
                  return (
                    <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-white">{p.name || `Patient #${p.id}`}</td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{p.age}</td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{p.gender}</td>
                      <td className="py-4 px-4">
                        {latestRecord ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            latestRecord.stabilityScore > 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' :
                            latestRecord.stabilityScore > 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                          }`}>
                            {latestRecord.stabilityScore}/100
                          </span>
                        ) : <span className="text-slate-400">N/A</span>}
                      </td>
                      <td className="py-4 px-4">
                        {latestPrediction ? (
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{latestPrediction.diseaseRiskLevel}</span>
                        ) : <span className="text-slate-400">N/A</span>}
                      </td>
                      <td className="py-4 px-4">
                        <button onClick={() => setSelectedPatient(p)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-bold">View Profile</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Patient Profile: {selectedPatient.name || `Patient #${selectedPatient.id}`}</h2>
              <button onClick={() => setSelectedPatient(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Vitals Summary */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Latest Clinical Vitals</h3>
                {selectedPatient.HealthRecords?.[0] ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Heart Rate</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">{selectedPatient.HealthRecords[0].heartRate} <span className="text-sm font-normal">BPM</span></p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Blood Pressure</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">{selectedPatient.HealthRecords[0].systolicBP}/{selectedPatient.HealthRecords[0].diastolicBP}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400">BMI</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">{selectedPatient.HealthRecords[0].bmi}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Sleep Hours</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">{selectedPatient.HealthRecords[0].sleepHours} <span className="text-sm font-normal">hrs</span></p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No vitals recorded.</p>
                )}
              </div>

              {/* AI Prediction Details */}
              {selectedPatient.Predictions?.[0] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center"><Activity className="mr-2 text-blue-500" size={20} /> AI Clinical Analysis</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{selectedPatient.Predictions[0].aiExplanation}</p>
                  </div>
                  
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center"><Pill className="mr-2 text-indigo-500" size={20} /> Recommended Medicines</h3>
                    {selectedPatient.Predictions[0].wellnessPlan?.clinicalAdvice?.generalMedicines ? (
                      <ul className="space-y-2">
                        {selectedPatient.Predictions[0].wellnessPlan.clinicalAdvice.generalMedicines.map((med: string, idx: number) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-slate-700 dark:text-slate-300">
                            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                            <span>{med}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-500 text-sm">No specific medicines recommended at this time.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default Dashboard;
