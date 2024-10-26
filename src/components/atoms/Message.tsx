import { FC } from "react";
import { AiOutlinePaperClip } from "react-icons/ai"; // Paperclip icon for attachments
import { ChatMessage } from "@/types/chatHistory.type";
import { dayAndTimeDateFormat } from "@/utils/dateFormatter";

const Message: FC<ChatMessage> = ({ content, role, created_at, isAttached }) => {
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
                <div className="flex items-center gap-2">
                    {isAttached && 
                        <AiOutlinePaperClip className="text-lg " />
                    }
                    <p className="text-sm">{content}</p>
                </div>
                <span className="block text-xs text-gray-500 mt-1 text-right">
                    {dayAndTimeDateFormat(created_at * 1000)}
                </span>
            </div>
        </div>
    );
};

export default Message;
