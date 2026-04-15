import axios from 'axios';
import { API_ENDPOINTS } from './config';

const BASE_URL = API_ENDPOINTS.interview;

export const generateQuestion = async (techStack: string, section: string, difficulty: string, history: string[], lastAnswer?: string) => {
  const response = await axios.post(`${BASE_URL}/generate-question`, {
    techStack,
    section,
    difficulty,
    history,
    lastAnswer
  });
  return response.data;
};

export const submitAndAnalyze = async (username: string, techStack: string, qnaHistory: any[]) => {
  const response = await axios.post(`${BASE_URL}/submit-and-analyze`, {
    username,
    techStack,
    qnaHistory
  });
  return response.data;
};

export const getInterviewHistory = async (username: string) => {
    const response = await axios.get(`${BASE_URL}/history/${username}`);
    return response.data;
};
