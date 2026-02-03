import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch resumes for the logged-in user, sorted by newest first
        const resumes = await Resume.find({ userId: (session.user as any).id })
            .select('fileName parsedContent analysisResult createdAt')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            message: 'Resumes fetched successfully',
            data: resumes,
        }, { status: 200 });

    } catch (error) {
        console.error('Fetch Resumes Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
