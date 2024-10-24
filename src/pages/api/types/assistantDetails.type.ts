export interface AssistantDetails {
    readonly assistantId: string;
    readonly threadId: string;
    fileIds: string[];
};

/**
 * this function is the type guard of AssistantDetails
 * @param obj the object to check.
 */
export function isOfIAssistantDetailsType(obj: any): obj is AssistantDetails {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'assistantId' in obj &&
        'threadId' in obj &&
        'fileIds' in obj &&
        typeof obj.assistantId === 'string' &&
        typeof obj.threadId === 'string' &&
        Array.isArray(obj.fileIds) &&
        obj.fileIds.every((id: any) => typeof id === 'string')
    );
}
