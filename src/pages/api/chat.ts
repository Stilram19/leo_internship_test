import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { getResponse, uploadFile } from './services/chat.service';

export const config = {
    api: {
        bodyParser: false, // disable Next.js's default body parser
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to parse the file' });
        }

        const uploadedFile = files?.file?.[0];

        if (uploadedFile !== undefined) {
            await uploadFile(uploadedFile.filepath);
        }

        const message = fields.message?.[0];

        if (message === undefined) {
            return res.status(400).json({ error: 'Invalid user message' });
        }
        
        try {
            const response = await getResponse(message);
            res.status(200).json(response);
        } catch (e) {
            return res.status(500).json({ error: "failed to process request" })
        }
    });
}
