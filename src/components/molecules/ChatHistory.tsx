'use client'
import { FC } from "react";
import { ChatHistoryProps } from "@/types/chatHistory.type";
import Message from "../atoms/Message";

import { Ref, useEffect, useRef } from "react";

const useScrollInto = (): Ref<HTMLDivElement> =>  {
    const view = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (view.current)
            view.current.scrollIntoView({behavior: 'smooth'});
    })

    return (view);
}

const ChatHistory: FC<ChatHistoryProps> = ({ messages }) => {
	const tagRef = useScrollInto();

	return (
		<div className="p-4 bg-gray-100 shadow-lg rounded-lg h-[500px] overflow-y-auto">
			{messages.map((msg, index) => (
				<div ref={index === messages.length - 1 ? tagRef : null}>
                	<Message key={msg.id} {...msg} /> 
				</div>
			))}
		</div>
	);
};

export default ChatHistory;