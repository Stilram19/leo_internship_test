import { ChangeEvent, FC } from "react";
import { CgAttachment } from "react-icons/cg";

interface FileInputProps {
    callback: (e: ChangeEvent<HTMLInputElement>) => void
};

const FileInput:FC<FileInputProps> = ({ callback }) => {
    return (
        <label htmlFor="file-upload" className="cursor-pointer text-xl">
        <CgAttachment />
        <input
          id="file-upload"
          type="file"
          onChange={callback}
          className="hidden"
        />
      </label>
    )
}

export default FileInput;