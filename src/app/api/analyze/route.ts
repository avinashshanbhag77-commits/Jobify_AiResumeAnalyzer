import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import OpenAI from 'openai';
import pdf from 'pdf-parse';

// Lazy initialization prevents top-level crashes if env vars are missing/invalid on module load
let openai: OpenAI | null = null;

function getOpenAIClient() {
    if (!openai) {
        const apiKey = process.env.OPENAI_API_KEY;
        const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

        console.log('Initializing OpenAI Client...');
        console.log('Base URL:', baseURL);
        console.log('API Key Present:', !!apiKey);

        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is not defined');
        }

        openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
            defaultHeaders: {
                'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
                'X-Title': 'Jobify AI Resume Analyzer',
            },
        });
    }
    return openai;
}

export async function POST(req: Request) {
    console.log('--- Analyze Request Started ---');
    try {
        // 1. Auth Check
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            console.log('Unauthorized request');
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // 2. Form Data Handling
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const jobRole = formData.get('jobRole') as string;

        if (!file) {
            console.log('No file uploaded');
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        console.log('File received:', file.name, 'Size:', file.size, 'Target Role:', jobRole);

        // 3. File Conversion
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 4. PDF Parsing
        let pdfText = '';
        try {
            console.log('Parsing PDF with pdf-parse...');
            const data = await pdf(buffer);
            pdfText = data.text;
            console.log('PDF Parsed successfully. Total length:', pdfText.length);

            if (!pdfText.trim()) {
                throw new Error('No text content found in PDF');
            }
        } catch (error: any) {
            console.error('PDF Parse Error:', error);
            return NextResponse.json({
                message: 'Failed to parse PDF file. This may be due to a corrupted PDF or server configuration: ' + (error.message || 'Unknown error')
            }, { status: 500 });
        }

        // 5. AI Analysis
        console.log('Starting AI Analysis for role:', jobRole);
        const prompt = `
      Analyze the following resume content specifically for the role of "${jobRole || 'General Professional'}".
      
      Resume Content:
      ${pdfText.substring(0, 4000)} // Increased limit slightly

      Return the response in strictly valid JSON format with the following structure:
      {
        "score": number (0-100),
        "summary": "Professional summary (max 3 sentences)",
        "strengths": ["strength 1", "strength 2", ...],
        "weaknesses": ["weakness 1", "weakness 2", ...],
        "improvements": ["improvement 1", "improvement 2", ...]
      }
    `;

        try {
            const client = getOpenAIClient();
            console.log('Sending request to OpenRouter/OpenAI...');
            const completion = await client.chat.completions.create({
                model: 'google/gemini-2.0-flash-001',
                messages: [
                    { role: 'system', content: `You are an expert HR and Resume Analyzer specializing in ${jobRole || 'recruitment'}. Return ONLY valid JSON.` },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 2000,
                response_format: { type: 'json_object' },
            });

            const aiResponse = completion.choices[0].message.content;
            console.log('AI Response Received');

            let analysisData;
            try {
                analysisData = JSON.parse(aiResponse || '{}');
            } catch (pErr) {
                console.error('Failed to parse AI JSON response:', aiResponse);
                throw new Error('Invalid JSON response from AI');
            }

            // 6. DB Saving
            console.log('Connecting to DB...');
            await dbConnect();
            console.log('Saving analysis result...');
            const newResume = await Resume.create({
                userId: (session.user as any).id,
                fileName: file.name,
                parsedContent: pdfText,
                analysisResult: analysisData,
            });
            console.log('Successfully saved to DB:', newResume._id);

            return NextResponse.json({
                message: 'Analysis successful',
                data: newResume,
            }, { status: 200 });

        } catch (aiError: any) {
            console.error('AI Analysis Error:', aiError);
            return NextResponse.json({
                message: 'AI Analysis Failed: ' + (aiError.message || 'Unknown error')
            }, { status: 503 });
        }

    } catch (error: any) {
        console.error('Fatal Analysis Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error: ' + (error.message || 'Unknown') },
            { status: 500 }
        );
    }
}
