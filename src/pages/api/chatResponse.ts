import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { getResponse, uploadFile } from './services/chat.service';
import path from 'path';
import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';

export const config = {
    api: {
        bodyParser: false, // disable Next.js's default body parser
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to parse the file' });
        }

        const uploadedFile = files?.file?.[0];
        let fileId: string | undefined = undefined;

        if (uploadedFile !== undefined) {
            const originalFilename = uploadedFile.originalFilename ?? 'uploaded_file'; // Ensure original name is used
            const extension = path.extname(originalFilename);

            // const uploadDir = path.join(__dirname, 'uploads');
            const uploadDir = path.join('/tmp', 'uploads');

            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir);
            }

            const destinationPath = path.join(uploadDir, `${Date.now()}${extension}`);
            renameSync(uploadedFile.filepath, destinationPath);
            fileId = await uploadFile(destinationPath);
            // remove the new file from uploads
            unlinkSync(destinationPath);
        }

        const message = fields.message?.[0];

        if (message === undefined) {
            return res.status(400).json({ error: 'Invalid user message' });
        }
        
        try {
            const response = await getResponse(message, fileId);
            res.status(200).json(response);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: "failed to process request" })
        }
    });
}
