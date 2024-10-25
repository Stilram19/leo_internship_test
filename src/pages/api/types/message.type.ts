export default interface Message {
    role: "user" | "assistant";
    id: string;
    created_at: number;
    content: string;
};
