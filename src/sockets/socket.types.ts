export interface EmittedMessage {
    content: string;
    attachedFileId?: string;
}

export function isOfEmittedMessageType(data: unknown): data is EmittedMessage {
    return (
        typeof data === 'object' &&
        data !== null &&
        'content' in data &&
        typeof data.content === 'string' &&
        (!('attachedFileId' in data) || typeof data.attachedFileId === 'string')
    );
}