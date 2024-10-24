'use client'
import { useState, ChangeEvent, FormEvent, FC } from 'react';
import FormButton from '../atoms/FormButton';
import FileInput from '../atoms/FileInput';
import TextInput from '../atoms/TextInput';
import { ChatMessage } from '@/types/chatHistory.type';

interface ChatPromptProps {
  updateMessages: (userMessage: ChatMessage, assistantMessage: ChatMessage) => void;
};

const ChatPrompt:FC<ChatPromptProps> = ( { updateMessages } ) => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    try {
      const formData = new FormData();
      formData.append('message', input);
      if (file) formData.append('file', file);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // typeGuard for [ChatMessage, ChatMessage]
      // set both messages
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setInput('');
      setFile(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  return (
    <form className="flex items-center gap-3 p-4 border-t border-gray-300" onSubmit={handleSend}>
      <FileInput callback={handleFileChange} />
      <TextInput callback={setInput} value={input} />
      <FormButton text='Send'/>
    </form>
  );
};

export default ChatPrompt;
