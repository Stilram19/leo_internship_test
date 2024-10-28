export default interface Message {
    role: "user" | "assistant";
    created_at: number;
    content: string;
    isAttached: boolean;
};
