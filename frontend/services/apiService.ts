import { PhysicalHealthData, MentalWellnessData, HealthAnalysisResponse } from "../types";

const API_BASE_URL = 'http://localhost:3001/api';

export async function analyzeHealthData(
  physical: PhysicalHealthData,
  mental: MentalWellnessData
): Promise<HealthAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ physical, mental })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze health data');
  }

  return await response.json() as HealthAnalysisResponse;
}

export async function getChatResponse(history: any[], message: string) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, history })
  });

  if (!response.ok) {
    throw new Error('Failed to get chat response');
  }

  const result = await response.json();
  return result.text;
}
