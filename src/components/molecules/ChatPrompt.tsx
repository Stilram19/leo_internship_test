'use client'
import { useState, ChangeEvent, FormEvent, FC } from 'react';
import FormButton from '../atoms/FormButton';
import FileInput from '../atoms/FileInput';
import TextInput from '../atoms/TextInput';
import { ChatMessage, isOfFileUploadResponseType } from '@/types/chatHistory.type';
import { FiFileText } from 'react-icons/fi';
import { useSocket } from '@/context/SocketProvider';

interface ChatPromptProps {
  disabled: boolean;
  updateMessages: (message: ChatMessage) => void;
};

const ChatPrompt:FC<ChatPromptProps> = ( { disabled, updateMessages } ) => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string>('');
  const [isFileUploading, setIsFileUploading] = useState(false);
  const socket = useSocket();

  const handleFileUpload = async (file: File) => {

    try {
      const formData = new FormData();

      formData.append('file', file);

      setIsFileUploading(true);
      console.log("Uploading file")
      const response = await fetch('/api/uploadFile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("response is not ok!")
      }

      const data = await response.json();

      if (isOfFileUploadResponseType(data) === false) {
        throw new Error('response is not of type FileUploadResponse');
      }

      setFileId(data.fileId);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleMessageSend = (e: FormEvent) => {
    e.preventDefault();

    if (disabled || isFileUploading)
      return ;

    if (!input.trim()) return;
    const text = input;
    setInput('');

    // create new user message
    updateMessages({
      role: 'user',
      content: text,
      created_at: Date.now() / 1000,
      id: Date.now().toString(),
      isAttached: file !== null
    })

    setFile(null);

    // create new assistant message
    updateMessages({
      role: 'assistant',
      content: '',
      created_at: Date.now() / 1000,
      id: Date.now().toString(),
      isAttached: false
    });

    // emit
    let emittedMessage: { content: string, attachedFileId?: string } = {
      content: text,
    };

    if (fileId.length > 0) {
      emittedMessage = { ...emittedMessage, attachedFileId: fileId }
      setFileId('');
    }

    socket?.emit('sendUserMessage', emittedMessage);
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      await handleFileUpload(uploadedFile);
    }
  };

  return (
    <div className='flex flex-col items-center w-full gap-1'>
      {file !== null ?
        <span className='flex items-center gap-1'>
            <FiFileText />
            <p>{file.name}</p>
        </span> 
        : null}
      <form className="w-full flex items-center gap-3" onSubmit={handleMessageSend}>
        <FileInput callback={handleFileChange} />
        <TextInput callback={setInput} value={input} />
        <FormButton disabled={disabled || isFileUploading} text='Send'/>
      </form>
    </div>
  );
};

export default ChatPrompt;
