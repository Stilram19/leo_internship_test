import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { uploadFile } from './services/chat.service';
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

        try {
            const uploadedFile = files?.file?.[0];
            let fileId: string | undefined = undefined;

            if (uploadedFile == undefined) {
                return (res.status(400).json({
                    error: 'No file was uploaded'
                }));
            }

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

            res.status(200).json({fileId});
        } catch (err: unknown) {
            console.log(err);
            res.status(500).json({ error: 'internal server error!'  });
        }
    });
}
