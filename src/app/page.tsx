'use client'

import ChatHistory from '@/components/molecules/ChatHistory';
import ChatPrompt from '@/components/molecules/ChatPrompt';
import { ChatMessage } from '@/types/chatHistory.type';
import { useEffect, useState } from 'react';

export default function Home() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	function updateMessages(userMessage: ChatMessage, assistantMessage: ChatMessage) {
		const newMessages = [...messages, userMessage, assistantMessage];

		setMessages(newMessages);
	}

	// should run once at component startup!
	useEffect(() => {
		// fetch to get messages
	}, []);

	return (
		<div className="max-w-2xl mx-auto ">

			<ChatHistory messages={messages} />
			<ChatPrompt updateMessages={updateMessages}/>
		</div>
  	);
}
