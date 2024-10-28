import { createReadStream } from "fs";
import { openai } from "./openAiConf";
import assistantDetails, { updateFileIds } from "./assistantDetails.service";
import { TextContentBlock } from "openai/resources/beta/threads/messages.js";
import Message from "../types/message.type";

/**
 * @brief uploads the file and returns its id.
 */
export async function uploadFile(filePath: string): Promise<string | undefined> {
    const newFile = await openai.files.create({
        file: createReadStream(filePath),
        purpose: 'assistants'
    });

    console.log(filePath);

    if (assistantDetails === undefined) {
        return (undefined);
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

    updateFileIds([...assistantDetails.fileIds, newFile.id]);

    return (newFile.id);
}

export async function getMessageHistory(): Promise<Message[]> {
    if (assistantDetails === undefined) {
        throw new Error('assistantDetails not found');
    }

    console.log(assistantDetails);

    // retrieving all the history messages
    const messages = await openai.beta.threads.messages.list(assistantDetails.threadId);
    const historyMessages = messages.data;

    if (historyMessages === undefined) {
        throw new Error('failed to process the request');
    }

    return (historyMessages.filter(message => Boolean(message.content[0])).map(message => {
        return ({
            content: (message.content[0] as TextContentBlock).text.value,
            created_at: message.created_at,
            role: message.role,
            isAttached: message.attachments?.[0]?.file_id ? true : false,
        });
    }).sort((a, b) => a.created_at - b.created_at));
}
