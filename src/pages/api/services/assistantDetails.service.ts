import { openai } from "./openAiConf";
import { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";
import { AssistantDetails } from "../types/assistantDetails.type";

const assistantDetails = await createAssistant();

/**
 * @brief creates an assistant and a thread, and returns an assistant details
 * object
 */
async function createAssistant(): Promise<AssistantDetails> {
    const assistantConfig: AssistantCreateParams = {
        model: 'gpt-4o-mini',
        name: 'chatbot',
        tools: [ { type: 'file_search' } ]
    };

    const assistant = await openai.beta.assistants.create(assistantConfig);
    const thread = await openai.beta.threads.create();

    return { assistantId: assistant.id, threadId: thread.id, fileIds: [] };
}

/**
 * @brief updates the assistant details file
 */
export function updateFileIds(fileIds: string[]): void {
    assistantDetails.fileIds = fileIds;
}

export default assistantDetails;