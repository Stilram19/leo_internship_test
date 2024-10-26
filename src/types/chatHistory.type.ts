export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	created_at: number;
	isAttached: boolean;
}

export interface ChatHistoryProps {
	messages: ChatMessage[];
	waiting: boolean;
}

export interface FileUploadResponse {
	fileId: string;
};

/**
 * 
 * @param obj to be checked
 * @returns true if the obj is of ChatMessage type, false otherwise
 */
export function isOfChatMessageType(obj: unknown): obj is ChatMessage {
	return (typeof obj === 'object'
		&& obj !== null
		&& 'id' in obj
		&& 'role' in obj
		&& 'content' in obj
		&& 'created_at' in obj
		&& 'isAttached' in obj
		&& typeof obj.id === 'string'
		&& (obj.role === 'user' || obj.role === 'assistant')
		&& typeof obj.content === 'string'
		&& typeof obj.created_at === 'number'
		&& typeof obj.isAttached === 'boolean'
	);
}

/**
 * 
 * @param arr to be checked
 * @returns true if the obj is of ChatMessage[] type, false otherwise
 */
export function isOfChatMessageArrayType(arr: unknown): arr is ChatMessage[] {
	if (Array.isArray(arr) === false) {
		return (false);
	}

	return (arr.every(elem => isOfChatMessageType(elem)));
}


/**
 * 
 * @param obj to be checked
 * @returns true if the obj is of FileUploadResponse type, false otherwise
 */
export function isOfFileUploadResponseType(obj: unknown): obj is FileUploadResponse {
	return (typeof obj === 'object'
		&& obj !== null
		&& 'fileId' in obj
		&& typeof obj.fileId === 'string'
	);
}
