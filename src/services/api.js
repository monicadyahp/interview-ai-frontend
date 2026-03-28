import axios from 'axios';

const API_URL = "http://localhost:5000/api";

export const sendFrameToPrediction = async (imageBlob, userId) => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'frame.jpg');
    formData.append('userId', userId); // Kirim userId ke backend
    
    const response = await axios.post(`${API_URL}/predict`, formData);
    return response.data;
};

export const getHistory = async (userId) => {
    const response = await axios.get(`${API_URL}/history?userId=${userId}`);
    return response.data;
};