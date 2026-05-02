import axios from 'axios';
// Pastikan kamu mengimport dua URL ini dari constants
import { API_BASE_URL, AI_URL } from '../utils/constants'; 

// --- JALUR CEPAT (Langsung ke Hugging Face) ---
export const sendFrameToPrediction = async (imageBlob, userId) => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'frame.jpg');
    formData.append('userId', userId);
    
    // TEMBAK LANGSUNG KE HUGGING FACE
    const response = await axios.post(`${AI_URL}/predict`, formData);
    return response.data;
};

// --- JALUR DATABASE (Ke Vercel) ---
export const getHistory = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/history?userId=${userId}`);
    return response.data;
};