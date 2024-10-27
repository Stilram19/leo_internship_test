import { getAssistant } from "@/pages/api/services/assistantDetails.service";
import { openai } from "@/pages/api/services/openAiConf";
import { MessageCreateParams, MessageDeltaEvent, TextDeltaBlock } from "openai/resources/beta/threads/messages.mjs";
import { Socket } from "socket.io";

interface EmittedMessage {
    content: string;
    attachedFileId?: string;
}

function isOfEmittedMessageType(data: unknown): data is EmittedMessage {
    return (
        typeof data === 'object' &&
        data !== null &&
        'content' in data &&
        typeof data.content === 'string' &&
        (!('attachedFileId' in data) || typeof data.attachedFileId === 'string')
    );
}

async function getResponse(data: EmittedMessage, socket: Socket) {
    const { content: text, attachedFileId} = data;

    const assistantDetails = await getAssistant();

    if (assistantDetails === undefined) {
        throw new Error('assistantDetails not found');
    }

    let messageCreateParams: MessageCreateParams = {
        content: text,
        role: 'user'
    };

    if (attachedFileId) {
        messageCreateParams = {
            ...messageCreateParams, 
            attachments: [{ file_id: attachedFileId, tools: [{ type: "file_search" }] }]
        };
    }

    // passing the user's message into the main thread
    await openai.beta.threads.messages.create(assistantDetails.threadId, messageCreateParams);

    // create a run
    const stream = await openai.beta.threads.runs.create(assistantDetails.threadId, {
        assistant_id: assistantDetails.assistantId,
        stream: true,
    });

    for await (const event of stream) {
        const message = event.data as MessageDeltaEvent;
        const deltaText = (message?.delta?.content?.[0] as TextDeltaBlock)?.text
        if (!deltaText) {
            continue ;
        }

        // console.log(event);
        // console.log(deltaText);
        // emit(text);
        socket.emit('sendAssistantMessageChunk', deltaText.value);
    }

    // emit to doneStreaming
	socket.emit('doneStreaming');
}

















export function onConnect(socket: Socket) {
    socket.on('sendUserMessage', (data) => {
        if (!isOfEmittedMessageType(data)) {
            socket.disconnect();
            return ;
        }
        getResponse(data, socket);
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    })
}