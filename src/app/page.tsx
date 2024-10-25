'use client'

import ChatHistory from '@/components/molecules/ChatHistory';
import ChatPrompt from '@/components/molecules/ChatPrompt';
import { ChatMessage, isOfChatMessageArrayType } from '@/types/chatHistory.type';
import { useEffect, useState } from 'react';

export default function Home() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

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

	function updateMessages(message: ChatMessage) {
		// const newMessages = [...messages, message];
		if (message.role === 'assistant')
			setIsLoading(false)
		else
			setIsLoading(true);
		setMessages((messages) => [...messages, message]);
	}

	// should run once at component startup!
	useEffect(() => {
		(async () =>  {
			const messageHistory = await fetchMessageHistory();

			setMessages(messageHistory);
		})();
	}, []);

	return (
		<div className="max-w-2xl mx-auto flex flex-col gap-2">
			<ChatHistory waiting={isLoading} messages={messages} />
			<ChatPrompt updateMessages={updateMessages}/>
		</div>
  	);
}
