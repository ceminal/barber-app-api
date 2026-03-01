export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    success: boolean;
    reply?: string;
    error?: string;
}
