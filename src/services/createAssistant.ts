import IAssistantDetails, { isOfIAssistantDetailsType } from "@/types/IAssistantDetails";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { openai } from "./openAiConf";
import { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";

/**
 * @brief creates an assistant and a thread, and returns an assistant details
 * object
 */
async function createAssistant(): Promise<IAssistantDetails> {
    const assistantConfig: AssistantCreateParams = {
        model: 'gpt-4o-mini',
        name: 'chatbot',
        tools: [ { type: 'file_search' } ]
    };

    const assistant = await openai.beta.assistants.create(assistantConfig);
    const thread = await openai.beta.threads.create();
    const fileIds: string[] = [];

    return { assistantId: assistant.id, threadId: thread.id, fileIds };
}

/**
 * @brief returns the details about the current Assistant.
 * If no assistant exists, it creates one and returns it.
 * It returns undefined in case of an error
*/
export default async function getAssistant(): Promise<IAssistantDetails | undefined> {
    const assistantFilePath = process.env.ASSISTANT_DETAILS_PATH as string;

    if (!assistantFilePath) {
        return (undefined);
    }

    const fileExists = existsSync(assistantFilePath);
    let assistantDetails: IAssistantDetails;

    if (!fileExists) {
        assistantDetails = await createAssistant();
        writeFileSync(assistantFilePath, JSON.stringify(assistantDetails));
        return (assistantDetails);
    }

    const assistantData = readFileSync(assistantFilePath, 'utf-8');
    assistantDetails = JSON.parse(assistantData);

    if (isOfIAssistantDetailsType(assistantDetails) === false) {
        return (undefined);
    }

    return (assistantDetails);
}
