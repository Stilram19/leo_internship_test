'use client'
import { FC } from "react";
import { ChatHistoryProps } from "@/types/chatHistory.type";
import Message from "../atoms/Message";
import MessageWaiting from "../atoms/MessageWaiting";
import useScrollInto from "@/hooks/useScrollInto";

const ChatHistory: FC<ChatHistoryProps> = ({ waiting, messages }) => {
	const tagRef = useScrollInto();

	return (
		<div className="p-4 bg-gray-100 shadow-lg rounded-lg h-[500px] overflow-y-auto">
			{messages.filter(msg => Boolean(msg.content)).map((msg, index) => (
				<div key={index}>
                	<Message {...msg} /> 
				</div>
			))}
			<div ref={tagRef} />
			{waiting ? <MessageWaiting /> : null}
		</div>
	);
};

export default ChatHistory;