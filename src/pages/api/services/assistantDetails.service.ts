import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { openai } from "./openAiConf";
import { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";
import { AssistantDetails, isOfIAssistantDetailsType } from "../types/assistantDetails.type";
import path from "path";

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
 * @brief returns the details about the current Assistant.
 * If no assistant exists, it creates one and returns it.
 * It returns undefined in case of an error
*/
export async function getAssistant(): Promise<AssistantDetails | undefined> {
    const assetsDir = path.join(process.cwd(), 'src', 'pages', 'api', 'assets');

    if (!existsSync(assetsDir)) {
        mkdirSync(assetsDir);
    }

    const assistantFilePath = path.resolve(assetsDir, 'assitant_details.json');

    const fileExists = existsSync(assistantFilePath);
    let assistantDetails: AssistantDetails;

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

/**
 * @brief updates the assistant details file
 */
export function updateAssistant(assistantDetails: AssistantDetails): void {
    const assetsDir = path.join(process.cwd(), 'src', 'pages', 'api', 'assets');

    if (!existsSync(assetsDir)) {
        mkdirSync(assetsDir);
    }

    const assistantFilePath = path.resolve(assetsDir, 'assitant_details.json');


    writeFileSync(assistantFilePath, JSON.stringify(assistantDetails));
}
