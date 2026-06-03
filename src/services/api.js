import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Kirim base64 wajah ke backend → backend forward ke FAST_API_URL (zahwannisa HF)
export const sendFrameToPrediction = async (imageBase64) => {
    const response = await axios.post(`${API_BASE_URL}/predict`, {
        image_base64: imageBase64,
    });
    return response.data;
};

export const getHistory = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/history?userId=${userId}`);
    return response.data;
};
