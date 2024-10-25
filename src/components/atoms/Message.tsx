import { ChatMessage } from "@/types/chatHistory.type";
import { dayAndTimeDateFormat } from "@/utils/dateFormatter";
import { FC } from "react";

const Message:FC<ChatMessage> = ( { content, role, created_at } ) => {
    return (
        <div
            className={`mb-4 flex ${
            role === 'user' ? 'justify-end' : 'justify-start'
            }`}
        >
            <div
            className={`max-w-[70%] p-3 rounded-lg ${
                role === 'user'
                ? 'bg-blue-500 text-white rounded-tr-none'
                : 'bg-gray-300 text-gray-900 rounded-tl-none'
            }`}
            >
            <p className="text-sm">{content}</p>
            <span className="block text-xs text-gray-500 mt-1 text-right">
                {dayAndTimeDateFormat(created_at * 1000)}
            </span>
            </div>
        </div>
    );
};

export default Message;