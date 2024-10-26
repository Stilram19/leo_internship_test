import { FC } from "react";

const FormButton:FC<{ text: string, disabled: boolean }> = ({ text, disabled }) => {
    return (
        <button disabled={disabled} type='submit' className={`${disabled ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-500'} text-white px-4 py-2 rounded-lg transition`}>
            {text}
        </button>
    )
};

export default FormButton;
