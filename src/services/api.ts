import axios from 'axios';
import { Message } from '../types';

export interface ChatApiRequest {
  message: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  imageBase64?: string;
  mimeType?: string;
}

export interface ChatApiResponse {
  reply: string;
  status: string;
}

const API_BASE_URL = '/api';

export const sendChatMessage = async (requestData: ChatApiRequest): Promise<string> => {
  try {
    const response = await axios.post<ChatApiResponse>(`${API_BASE_URL}/chat`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    if (response.data && response.data.reply) {
      return response.data.reply;
    }

    throw new Error('Received an invalid or empty response from EcoBuddy AI.');
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.detail || error.response?.data?.error;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('EcoBuddy AI request timed out. Please check your internet connection and try again.');
      }
    }
    throw new Error(error.message || 'Failed to connect to EcoBuddy AI service.');
  }
};
