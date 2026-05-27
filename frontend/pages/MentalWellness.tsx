import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Moon, Smartphone, Smile, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MentalWellness = () => {
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('healthsense_analysis');
    if (saved) {
      setAnalysis(JSON.parse(saved));
    }
  }, []);

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mb-6">
          <Brain size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Mental Health Data Found</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          Run a health analysis first to generate your mental wellness report.
        </p>
        <Link to="/assessment" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition">
          Run Assessment
        </Link>
      </div>
    );
  }

  const { mentalWellness, wellnessPlan } = analysis;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Mental Wellness</h1>
        <p className="text-slate-500 dark:text-slate-400">Cognitive and emotional health insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass dark:glass-dark p-8 rounded-2xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900 border-t-4 border-purple-500">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-2xl">
              <Brain size={32} />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-bold">Cognitive Load</p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white">{mentalWellness.stressScore}<span className="text-lg text-slate-400">/100</span></h3>
            </div>
          </div>
          
          {mentalWellness.burnoutWarning && (
            <div className="mt-4 p-4 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-xl flex items-start space-x-3 border border-amber-200 dark:border-amber-700">
              <AlertTriangle className="flex-shrink-0 mt-1" />
              <p className="font-medium text-sm">High risk of burnout detected. Immediate stress reduction recommended.</p>
            </div>
          )}
        </div>

        <div className="glass dark:glass-dark p-8 rounded-2xl">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Key Insights</h3>
          <ul className="space-y-4">
            {mentalWellness.insights.map((insight: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 mt-2 rounded-full bg-purple-500 flex-shrink-0"></span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass dark:glass-dark p-8 rounded-2xl mt-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Personalized Routine</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center space-x-3 text-slate-800 dark:text-white font-bold mb-4">
              <Moon className="text-blue-500" />
              <span>Sleep Optimization</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {wellnessPlan.sleepTips.map((tip: string, idx: number) => (
                <li key={idx}>• {tip}</li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
            <div className="flex items-center space-x-3 text-slate-800 dark:text-white font-bold mb-4">
              <Smile className="text-rose-500" />
              <span>Relaxation</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {wellnessPlan.relaxationExercises.map((tip: string, idx: number) => (
                <li key={idx}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MentalWellness;
