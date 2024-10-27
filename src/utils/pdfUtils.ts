import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export class PDFProcessingError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'PDFProcessingError';
  }
}

async function validatePDFDocument(file: File): Promise<ArrayBuffer> {
  if (!file || !(file instanceof File)) {
    throw new PDFProcessingError('Invalid file provided');
  }

  if (!file.type.includes('pdf')) {
    throw new PDFProcessingError('File must be a PDF document');
  }

  try {
    return await file.arrayBuffer();
  } catch (error) {
    throw new PDFProcessingError('Failed to read PDF file', error as Error);
  }
}

async function extractPageText(page: PDFPageProxy, pageNum: number): Promise<string> {
  try {
    const content = await page.getTextContent();
    
    if (!content?.items?.length) {
      throw new PDFProcessingError(`Page ${pageNum} contains no readable text`);
    }

    return content.items
      .map((item: any) => (typeof item.str === 'string' ? item.str.trim() : ''))
      .filter(Boolean)
      .join(' ');
  } catch (error) {
    if (error instanceof PDFProcessingError) {
      throw error;
    }
    throw new PDFProcessingError(`Failed to extract text from page ${pageNum}`, error as Error);
  }
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await validatePDFDocument(file);
    
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    }).promise;

    if (!pdf || typeof pdf.numPages !== 'number') {
      throw new PDFProcessingError('Invalid PDF document structure');
    }

    const textPromises = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      textPromises.push(extractPageText(page, i));
    }

    const pageTexts = await Promise.all(textPromises);
    const fullText = pageTexts.join('\n\n').trim();

    if (!fullText) {
      throw new PDFProcessingError('No readable text found in the PDF');
    }

    return fullText;
  } catch (error) {
    if (error instanceof PDFProcessingError) {
      throw error;
    }
    throw new PDFProcessingError(
      'Failed to process PDF file',
      error as Error
    );
  }
}