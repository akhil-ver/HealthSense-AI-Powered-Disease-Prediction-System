import { User, Patient, HealthRecord, Prediction } from '../models/associations.js';
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    stabilityScore: { type: Type.NUMBER, description: "0-100 score where 100 is perfectly stable" },
    stabilityZone: { type: Type.STRING, description: "Optimal, Stable, Warning, or Critical" },
    explanation: { type: Type.STRING, description: "Clear explanation of why this score was given" },
    physicalRisk: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING },
        score: { type: Type.NUMBER },
        factors: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["level", "score", "factors", "recommendations"]
    },
    mentalWellness: {
      type: Type.OBJECT,
      properties: {
        stressScore: { type: Type.NUMBER },
        burnoutWarning: { type: Type.BOOLEAN },
        insights: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["stressScore", "burnoutWarning", "insights"]
    },
    diseaseAdjustment: { type: Type.NUMBER, description: "Impact of existing disease on overall risk (+X%)" },
    clinicalAdvice: {
      type: Type.OBJECT,
      properties: {
        seeDoctor: { type: Type.BOOLEAN },
        urgency: { type: Type.STRING },
        doctorReason: { type: Type.STRING },
        generalMedicines: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["seeDoctor", "urgency", "doctorReason", "generalMedicines"]
    },
    wellnessPlan: {
      type: Type.OBJECT,
      properties: {
        relaxationExercises: { type: Type.ARRAY, items: { type: Type.STRING } },
        sleepTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        routinePlan: { type: Type.ARRAY, items: { type: Type.STRING } },
        uniqueHealthHack: { type: Type.STRING }
      },
      required: ["relaxationExercises", "sleepTips", "routinePlan", "uniqueHealthHack"]
    }
  },
  required: ["stabilityScore", "stabilityZone", "explanation", "physicalRisk", "mentalWellness", "diseaseAdjustment", "clinicalAdvice", "wellnessPlan"]
};

export const analyzeHealth = async (req, res) => {
  try {
    const { physical, mental } = req.body;
    let userId = req.user ? req.user.id : null;
    
    // If no authenticated user, ensure a test user exists to satisfy foreign keys
    if (!userId) {
      const [testUser] = await User.findOrCreate({
        where: { email: 'test@healthsense.ai' },
        defaults: {
          name: 'Test User',
          password: 'hashed_dummy_password', // Just a placeholder
          role: 'User'
        }
      });
      userId = testUser.id;
    }

    const prompt = `
      Perform a master health stability analysis for patient: ${physical.name}.
      
      VITALS: Age ${physical.age}, BMI ${physical.bmi}, BP ${physical.systolicBP}/${physical.diastolicBP}, HR ${physical.heartRate}.
      DISEASE INFO: ${physical.selectedDisease} (${physical.specificValue || 'N/A'}), History: ${physical.medicalHistory}.
      LIFESTYLE: Smoke: ${physical.smoking}, Ex: ${physical.exerciseFreq}.
      MENTAL: Sleep ${mental.sleepHours}h, Screen ${mental.screenTime}h, Mood ${mental.mood}.

      TASK:
      1. Calculate a "Health Stability Score" (0-100, higher is better).
      2. Identify the "Stability Zone".
      3. Provide a transparent "Why this result?" explanation.
      4. Calculate a "Disease Adjustment" percentage (how much the existing condition increases risk).
      5. Standard risk levels for physical and mental health.
      6. Clinical advice & medicine predictions.
      7. A Unique Wellness Hack.

      Tone: Professional, transparent, and guardian-like.
    `;

    let analysis;
    if (!API_KEY) {
      console.log("No API key found. Using fallback analysis.");
      
      // Calculate dynamic score based on vitals to simulate AI analysis
      let penalty = 0;
      const hr = Number(physical.heartRate) || 72;
      if (hr > 100 || hr < 60) penalty += 10;
      if (hr > 120 || hr < 50) penalty += 15;
      
      const sysBP = Number(physical.systolicBP) || 120;
      const diaBP = Number(physical.diastolicBP) || 80;
      if (sysBP > 130 || diaBP > 85) penalty += 10;
      if (sysBP > 140 || diaBP > 90) penalty += 15;
      
      const bmi = Number(physical.bmi) || 22;
      if (bmi > 25 || bmi < 18.5) penalty += 5;
      if (bmi > 30) penalty += 10;
      
      let score = 100 - penalty;
      if (score < 0) score = 10;
      
      let zone = "Stable";
      let level = "Low";
      if (score < 60) { zone = "Critical"; level = "Critical"; }
      else if (score < 85) { zone = "Warning"; level = "Moderate"; }
      else if (score >= 95) { zone = "Optimal"; level = "Low"; }

      analysis = {
        stabilityScore: score,
        stabilityZone: zone,
        explanation: "Based on the provided clinical vitals, the patient's condition has been analyzed. Deviations in vital parameters directly impact the calculated stability score.",
        physicalRisk: {
          level: level,
          score: penalty,
          factors: ["Analyzed based on Heart Rate, Blood Pressure, and BMI"],
          recommendations: ["Monitor vitals regularly", "Maintain a balanced diet"]
        },
        mentalWellness: {
          stressScore: 100 - (Number(mental.sleepHours) * 10 || 70),
          burnoutWarning: Number(mental.sleepHours) < 5,
          insights: ["Sleep duration affects mental recovery"]
        },
        diseaseAdjustment: 0,
        clinicalAdvice: {
          seeDoctor: score < 70,
          urgency: score < 60 ? "Immediate" : "Routine",
          doctorReason: score < 70 ? "Vitals indicate significant physiological stress." : "No acute symptoms reported.",
          generalMedicines: score < 70 ? ["Consult physician for appropriate medication"] : ["Multivitamins", "Hydration salts"]
        },
        wellnessPlan: {
          relaxationExercises: ["Deep breathing for 5 mins"],
          sleepTips: ["Maintain consistent bedtime"],
          routinePlan: ["Morning stretch", "Hydrate", "Evening walk"],
          uniqueHealthHack: "Drink a glass of water first thing in the morning."
        }
      };
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA
        }
      });
      analysis = JSON.parse(response.text);
    }

    // Save logic using Sequelize
    // Find or create patient
    let [patient] = await Patient.findOrCreate({
      where: { userId, age: physical.age || 30, name: physical.name || 'Unknown Patient' },
      defaults: {
        gender: 'Other',
        bloodType: 'Unknown',
        height: physical.height || 0,
        weight: physical.weight || 0,
        medicalHistory: physical.medicalHistory
      }
    });

    await HealthRecord.create({
      patientId: patient.id,
      bmi: physical.bmi,
      systolicBP: physical.systolicBP,
      diastolicBP: physical.diastolicBP,
      heartRate: physical.heartRate,
      sleepHours: mental.sleepHours,
      screenTime: mental.screenTime,
      mood: mental.mood,
      stressScore: analysis.mentalWellness.stressScore,
      stabilityScore: analysis.stabilityScore,
      stabilityZone: analysis.stabilityZone
    });

    await Prediction.create({
      patientId: patient.id,
      diseaseRiskLevel: analysis.physicalRisk.level,
      predictedConditions: analysis.physicalRisk.factors,
      wellnessPlan: analysis.wellnessPlan,
      aiExplanation: analysis.explanation
    });

    res.json(analysis);
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Failed to perform health analysis" });
  }
};

export const chatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    let text;
    if (!API_KEY) {
      text = "I am the HealthSense AI Wellness Coach. Based on your current profile, I recommend maintaining a consistent sleep schedule and staying hydrated. How else can I assist you today?";
    } else {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: "You are HealthSense AI Wellness Coach. Use the user's data to provide specific, encouraging advice. Be concise and medical-grade."
        }
      });
      const result = await chat.sendMessage(message);
      text = result.text;
    }
    res.json({ text });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Failed to generate chat response" });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [
        { model: User, attributes: ['name', 'email', 'role'] },
        { model: HealthRecord, limit: 1, order: [['createdAt', 'DESC']] },
        { model: Prediction, limit: 1, order: [['createdAt', 'DESC']] }
      ]
    });
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};
