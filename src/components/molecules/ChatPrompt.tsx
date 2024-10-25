'use client'
import { useState, ChangeEvent, FormEvent, FC } from 'react';
import FormButton from '../atoms/FormButton';
import FileInput from '../atoms/FileInput';
import TextInput from '../atoms/TextInput';
import { ChatMessage, isOfChatMessageType } from '@/types/chatHistory.type';
import { FiFileText } from 'react-icons/fi';

interface ChatPromptProps {
  disabled: boolean;
  updateMessages: (message: ChatMessage) => void;
};

const ChatPrompt:FC<ChatPromptProps> = ( { disabled, updateMessages } ) => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    if (disabled)
        return ;

    if (!input.trim()) return;
    const text = input;
    setInput('');

    updateMessages({
      role: 'user',
      content: text,
      created_at: Date.now() / 1000,
      id: Date.now().toString(),
    })

    try {
      const formData = new FormData();
      formData.append('message', text);
      if (file) {
        formData.append('file', file);
        setFile(null);
      }

      const response = await fetch('/api/chatResponse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("response is not ok!")
      }

      const data = await response.json();

      if (isOfChatMessageType(data) === false) {
        throw new Error('response is not of type [ChatMessage, ChatMessage]');
      }

      updateMessages(data);
    } catch (error) {
      console.error('Error sending message:', error);
    }

  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  return (
    <div className='flex flex-col items-center w-full gap-1'>
      {file !== null ?
        <span className='flex items-center gap-1'>
            <FiFileText />
            <p>{file.name}</p>
        </span> 
        : null}
      <form className="w-full flex items-center gap-3" onSubmit={handleSend}>
        <FileInput callback={handleFileChange} />
        <TextInput callback={setInput} value={input} />
        <FormButton text='Send'/>
      </form>
    </div>
  );
};

export default ChatPrompt;
