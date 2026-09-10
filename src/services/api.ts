import axios from 'axios';
import { getEcoKnowledgeResponse } from './ecoKnowledge';

export interface ChatApiRequest {
  message: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  imageBase64?: string;
  mimeType?: string;
}

export interface ChatApiResponse {
  reply: string;
  status: string;
  source?: 'gemini' | 'knowledge_fallback';
}

export interface SendMessageResult {
  reply: string;
  source: 'gemini' | 'knowledge_fallback';
}

const API_BASE_URL = '/api';

/**
 * Ensures any error object or string is converted to a human-readable message,
 * strictly preventing "[object Object]" or raw error blobs from reaching the user.
 */
export function sanitizeErrorMessage(err: unknown): string {
  if (!err) return 'EcoBuddy is temporarily unavailable. Please try again.';
  if (typeof err === 'string') {
    if (err.includes('[object') || err === 'Error' || err === '{}') {
      return 'Unable to reach EcoBuddy AI service. Please tap Try Again.';
    }
    return err;
  }
  if (typeof err === 'object') {
    const obj = err as Record<string, any>;
    if (typeof obj.message === 'string' && !obj.message.includes('[object')) {
      return obj.message;
    }
    if (typeof obj.error === 'string' && !obj.error.includes('[object')) {
      return obj.error;
    }
    if (obj.error && typeof obj.error.message === 'string') {
      return obj.error.message;
    }
    if (typeof obj.detail === 'string') {
      return obj.detail;
    }
  }
  return 'Unable to reach EcoBuddy AI service. Please tap Try Again.';
}

export const sendChatMessage = async (
  requestData: ChatApiRequest
): Promise<SendMessageResult> => {
  try {
    const response = await axios.post<ChatApiResponse>(
      `${API_BASE_URL}/chat`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 40000,
      }
    );

    if (response.data && response.data.reply) {
      return {
        reply: response.data.reply,
        source: response.data.source || 'gemini',
      };
    }

    throw new Error('Received an invalid or empty response from EcoBuddy AI.');
  } catch (error: any) {
    console.warn('[EcoBuddy Client API Warning]: Backend request error:', error?.message);

    // If server returned a specific message in response data, use it
    if (axios.isAxiosError(error) && error.response?.data?.reply) {
      return {
        reply: error.response.data.reply,
        source: error.response.data.source || 'knowledge_fallback',
      };
    }

    // Client-side knowledge engine fallback: Ensure user is NEVER left without an answer!
    const fallback = getEcoKnowledgeResponse(
      requestData.message || '',
      Boolean(requestData.imageBase64)
    );

    return {
      reply: fallback.reply,
      source: 'knowledge_fallback',
    };
  }
};

