import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const downloadImages = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://pickerwheel.com/tools/random-image-generator/');

  await page.click('.ReactTurntablestyle__TurntableButton-sc-1oejalp-2');
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

  const imageElement = await page.$('img.StyledImage-sc-ey4zx9-0.fDRvXu.RIGResultModal__Image-sc-177jkkh-2.jCEszU');

  const downloadDir = path.join(process.cwd(), 'downloads');
  await fsPromises.mkdir(downloadDir, { recursive: true });

  let imagePaths: string[] = [];

  if (imageElement) {
    const imageUrl = await imageElement.evaluate((img: HTMLImageElement) => img.src);
    const imageName = `image-0.jpg`;
    const imagePath = path.join(downloadDir, imageName);

    const viewSource = await page.goto(imageUrl);
    if (viewSource) {
      const buffer = await viewSource.buffer();
      if (buffer) {
        await fsPromises.writeFile(imagePath, buffer);
        imagePaths.push(imagePath);
      } else {
        console.error('Error: The buffer is undefined');
      }
    } else {
      console.error('Error: viewSource is undefined');
    }
  } else {
    console.log('Image not found');
  }

  await browser.close();
  return imagePaths;
};

const analyzeImages = async (imagePaths: string[]) => {
  const key = process.env.AZURE_COMPUTER_VISION_KEY!;
  const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT!;

  const client = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
    endpoint
  );

  const results = [];

  for (const imagePath of imagePaths) {
    const imageBuffer = await fsPromises.readFile(imagePath);

    const result = await client.analyzeImageInStream(imageBuffer, {
      visualFeatures: ['Objects']
    });

    const isBox = result.objects?.some(obj => obj.object?.toLowerCase() === 'box');
    const isEnvelope = result.objects?.some(obj => obj.object?.toLowerCase() === 'envelope');

    results.push({
      imagePath,
      recognizedAs: isBox ? 'Box' : isEnvelope ? 'Envelope' : 'Unknown',
    });

    console.log(`Image: ${path.basename(imagePath)}`);
    console.log(`Path: ${imagePath}`);
    if (isBox) {
      console.log('Identified as: Box');
    } else if (isEnvelope) {
      console.log('Identified as: Envelope');
    } else {
      console.log('Not identified as Box or Envelope');
    }
  }

  return results;
};

export const POST = async () => {
  try {
    const imagePaths = await downloadImages();
    const results = await analyzeImages(imagePaths);
    return NextResponse.json({ status: 'Success', results });
  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json({ status: 'Error', message: error }, { status: 500 });
  }
};
