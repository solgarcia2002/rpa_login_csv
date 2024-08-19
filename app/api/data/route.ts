import { NextResponse } from 'next/server';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

export const GET = async () => {
  const results: Record<string, string>[] = [];
  const filePath = path.join(process.cwd(), 'data', 'your-csv-file.csv');

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  return NextResponse.json(results);
};
