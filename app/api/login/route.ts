import { NextResponse } from 'next/server';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import path from 'path';
import { promises as fs } from 'fs';

const upload = multer({ dest: '/tmp' });

export const POST = async (request: Request) => {
  const data = await request.formData();
  const file = data.get('file') as Blob;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const tempPath = path.join('/tmp', 'upload.png');
  await fs.writeFile(tempPath, buffer);

  const { data: { text } } = await Tesseract.recognize(tempPath, 'eng');

  if (text.includes('Número de Seguimiento')) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
};
