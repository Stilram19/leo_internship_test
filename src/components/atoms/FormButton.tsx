import { FC } from "react";

const FormButton:FC<{ text: string }> = ({ text }) => {
    return (
        <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition">
            {text}
        </button>
    )
};

export default FormButton;
