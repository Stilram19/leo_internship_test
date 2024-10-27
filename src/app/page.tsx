'use client'

import ChatHistory from '@/components/molecules/ChatHistory';
import ChatPrompt from '@/components/molecules/ChatPrompt';
import { useSocket } from '@/context/SocketProvider';
import { ChatMessage, isOfChatMessageArrayType } from '@/types/chatHistory.type';
import { useEffect, useState } from 'react';


const fetchMessageHistory = async (): Promise<ChatMessage[]> => {
	try {
	  const response = await fetch('/api/chatHistory', {
		method: 'GET',
	  });

	  const data = await response.json();

	  if (isOfChatMessageArrayType(data) === false) {
		throw new Error('response is not an array of ChatMessage[] type');
	  }

	  return (data);

	} catch (error) {
	  console.error('Error sending message:', error);
	}

	return [];
};


export default function Home() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [streamingOnGoing, setStreamingOnGoing] = useState<boolean>(false);
	const socket = useSocket();

	function updateMessages(message: ChatMessage) {
		// const newMessages = [...messages, message];
		if (message.role === 'user') {
			setStreamingOnGoing(true);
			setIsLoading(true);
		}
		
		setMessages((messages) => [...messages, message]);
	}

	// should run once at component startup!
	useEffect(() => {
		(async () =>  {
			const messageHistory = await fetchMessageHistory();
			setIsLoading(false);
			setMessages(messageHistory);
		})();
	}, []);

	useEffect(() => {
		console.log("REgitering events")
		const callback = (data: unknown) => {
			if (typeof data != 'string') {
				return ;
			}
			console.log(data)
			setIsLoading(false);

			setMessages((prevMessages) => {
				const lastMessage = {...prevMessages[prevMessages.length - 1]}; // get the current assistant message

				// append response chunk
				lastMessage.content += data;
				const newMessages = [...prevMessages];
				newMessages[prevMessages.length - 1] = lastMessage;
				return (newMessages);
			});
		}

		socket?.on('sendAssistantMessageChunk', callback);
		socket?.on('doneStreaming', () => setStreamingOnGoing(false));

		return () => {
			socket?.removeListener('sendAssistantMessageChunk', callback);
		}
	}, [socket]);

	return (
		<div className="max-w-2xl mx-auto flex flex-col gap-2">
			<ChatHistory waiting={isLoading} messages={messages} />
			<ChatPrompt disabled={isLoading || streamingOnGoing} updateMessages={updateMessages}/>
		</div>
  	);
}
