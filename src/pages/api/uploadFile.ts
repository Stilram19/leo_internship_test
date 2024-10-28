import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { uploadFile } from './services/chat.service';
import path from 'path';
import { renameSync } from 'fs';

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


            const pathWithExtension = uploadedFile.filepath + `${Date.now()}${extension}`;
            renameSync(uploadedFile.filepath, pathWithExtension);

            fileId = await uploadFile(pathWithExtension);
            res.status(200).json({fileId});
        } catch (err: unknown) {
            console.log(err);
            res.status(500).json({ error: 'internal server error!'  });
        }
    });
}
