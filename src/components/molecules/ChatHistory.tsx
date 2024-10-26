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
				<div key={msg.id} ref={index === messages.length - 1 ? tagRef : null}>
                	<Message key={msg.id} {...msg} /> 
				</div>
			))}
			{waiting ? <MessageWaiting /> : null}
		</div>
	);
};

export default ChatHistory;