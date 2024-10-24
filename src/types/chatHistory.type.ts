export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	message: string;
	timestamp: number;
}

export interface ChatHistoryProps {
	messages: ChatMessage[];
}