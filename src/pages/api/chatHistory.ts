import { NextApiRequest, NextApiResponse } from 'next';
import { getMessageHistory } from './services/chat.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await getMessageHistory();
        res.status(200).json(response);
    } catch (e: unknown) {
        console.log(e);
        return res.status(500).json({ error: "failed to process request" })
    }
}
