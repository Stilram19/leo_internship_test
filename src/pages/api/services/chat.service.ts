import { createReadStream } from "fs";
import { openai } from "./openAiConf";
import { getAssistant, updateAssistant } from "./assistantDetails.service";
import sleep from "./utils/sleep";
import { TextContentBlock } from "openai/resources/beta/threads/messages.js";
import Message from "../types/message.type";

/**
 * @brief 
 */
export async function uploadFile(filePath: string): Promise<void> {
    const newFile = await openai.files.create({
        file: createReadStream(filePath),
        purpose: 'assistants'
    });

    const assistantDetails = await getAssistant();

    if (assistantDetails === undefined) {
        return ;
    }

    // create a vector store including all the files
    const vectorStore = await openai.beta.vectorStores.create({
        name: "uploads",
        file_ids: [...assistantDetails.fileIds, newFile.id]
    });

    await openai.beta.vectorStores.fileBatches.createAndPoll(vectorStore.id, {file_ids: [...assistantDetails.fileIds, newFile.id]});

    await openai.beta.assistants.update(assistantDetails.assistantId, {
        tool_resources: {
            file_search: {
                vector_store_ids: [vectorStore.id]
            }
        }
    });

    updateAssistant({ ...assistantDetails, fileIds: [...assistantDetails.fileIds, newFile.id] });
}


/**
 * @brief sends the user's message and returns both of 
 * the user's message and the AI assistant's response
 * @param text the user's message text to send to the AI assistant
 */
export async function getResponse(text: string): Promise<Message> {
    const assistantDetails = await getAssistant();

    if (assistantDetails === undefined) {
        throw new Error('assistantDetails not found');
    }

    // passing the user's message into the main thread
    await openai.beta.threads.messages.create(assistantDetails.threadId, {
        content: text,
        role: 'user'
    });

    // create a run
    const run = await openai.beta.threads.runs.create(assistantDetails.threadId, {
        assistant_id: assistantDetails.assistantId
    });

    let runStatus = await openai.beta.threads.runs.retrieve(assistantDetails.threadId, run.id)

    // polling
    while (runStatus.status !== 'completed') {
        await sleep(100); // sleep for 100 msecond
        runStatus = await openai.beta.threads.runs.retrieve(assistantDetails.threadId, run.id)
        if (['cancelled', 'failed', 'expired', 'incomplete'].includes(runStatus.status)) {
            throw new Error('failed to process the request');
        }
    }

    // retrieving the AI assistant's response
    const messages = await openai.beta.threads.messages.list(assistantDetails.threadId);
    const assistantResponse = messages.data.filter(message => {
        return (message.run_id === run.id && message.role === 'assistant');
    }).pop();

    if (assistantResponse === undefined) {
        throw new Error('failed to process the request');
    }


    return (
        {
            content: (assistantResponse.content[0] as TextContentBlock).text.value,
            created_at: assistantResponse.created_at,
            id: assistantResponse.id,
            role: assistantResponse.role,
        }
    );
}

export async function getMessageHistory(): Promise<Message[]> {
    const assistantDetails = await getAssistant();

    if (assistantDetails === undefined) {
        throw new Error('assistantDetails not found');
    }

    // retrieving all the history messages
    const messages = await openai.beta.threads.messages.list(assistantDetails.threadId);
    const historyMessages = messages.data;

    if (historyMessages === undefined) {
        throw new Error('failed to process the request');
    }

    return (historyMessages.map(message => {
        return ({
            content: (message.content[0] as TextContentBlock).text.value,
            created_at: message.created_at,
            id: message.id,
            role: message.role
        });
    }).sort((a, b) => a.created_at - b.created_at));
}
