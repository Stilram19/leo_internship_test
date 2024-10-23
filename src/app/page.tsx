import { FC } from 'react';

interface ChatMessage {
	id: string;
	sender: 'user' | 'assistant';
	message: string;
	timestamp: string;
}

interface ChatHistoryProps {
	messages: ChatMessage[];
}

const ChatHistory: FC<ChatHistoryProps> = ({ messages }) => {
	return (
		<div className="max-w-2xl mx-auto p-4 bg-gray-100 shadow-lg rounded-lg h-[500px] overflow-y-auto">
			{messages.map((msg) => (
			<div
				key={msg.id}
				className={`mb-4 flex ${
				msg.sender === 'user' ? 'justify-end' : 'justify-start'
				}`}
			>
				<div
				className={`max-w-[70%] p-3 rounded-lg ${
					msg.sender === 'user'
					? 'bg-blue-500 text-white rounded-tr-none'
					: 'bg-gray-300 text-gray-900 rounded-tl-none'
				}`}
				>
				<p className="text-sm">{msg.message}</p>
				<span className="block text-xs text-gray-500 mt-1 text-right">
					{msg.timestamp}
				</span>
				</div>
			</div>
			))}
		</div>
	);
};



export default function Home() {
  const mockMessages: ChatMessage[] = [
    {
		id: '1',
		sender: 'assistant',
		message: 'Hello! How can I assist you today?',
		timestamp: '10:00 AM',
    },
    {
		id: '2',
		sender: 'user',
		message: 'Can you tell me a joke?',
		timestamp: '10:01 AM',
    },
    {
		id: '3',
		sender: 'assistant',
		message: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
		timestamp: '10:02 AM',
    },
  ];

  return (
    <div className="">

      <ChatHistory messages={mockMessages} />
      <div>
        {/* chat prompt */}
      </div>
    </div>
  );
}
