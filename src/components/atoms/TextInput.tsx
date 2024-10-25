import { FC } from "react";

interface TextInputProps {
    value: string
    callback: (value: string) => void
};

const TextInput:FC<TextInputProps> = ({ value, callback }) => {
    return (
        <input
        type="text"
        value={value}
        onChange={(e) => callback(e.target.value)}
        placeholder="Send a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    )
};

export default TextInput;