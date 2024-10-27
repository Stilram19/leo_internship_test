import { FC } from "react";
import { AiOutlinePaperClip } from "react-icons/ai"; // Paperclip icon for attachments
import { ChatMessage } from "@/types/chatHistory.type";
import { dayAndTimeDateFormat } from "@/utils/dateFormatter";
import Markdown from "react-markdown";

const Message: FC<ChatMessage> = ({ content, role, created_at, isAttached }) => {
    return (
        <div
            className={`mb-4 flex ${
                role === 'user' ? 'justify-end' : 'justify-start'
            }`}
        >
            <div
                className={`max-w-[70%] p-3 rounded-lg overflow-hidden ${
                    role === 'user'
                        ? 'bg-blue-500 text-white rounded-tr-none'
                        : 'bg-gray-300 text-gray-900 rounded-tl-none'
                }`}
            >
                <div className="break-words overflow-hidden">
                    <Markdown>{content}</Markdown>
                </div>
                {
                    isAttached ? 
                    <div className="flex justify-between gap-3 itmes-center">
                        {isAttached &&
                            <span className="flex items-center text-gray-700">
                                <AiOutlinePaperClip className="text-lg" />
                                <p className="text-xs">This Message was attached</p>
                            </span>
                        }
                        <span className="block text-xs text-gray-700 text-right">
                            {dayAndTimeDateFormat(created_at * 1000)}
                        </span>
                    </div> : 
                    <span className="block text-xs text-gray-700 text-right">
                        {dayAndTimeDateFormat(created_at * 1000)}
                    </span>
                }
            </div>
        </div>
    );
};

export default Message;
