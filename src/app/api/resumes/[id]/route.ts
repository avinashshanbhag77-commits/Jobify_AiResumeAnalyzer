import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
        }

        await dbConnect();

        const deletedResume = await Resume.findOneAndDelete({
            _id: id,
            userId: (session.user as any).id
        });

        if (!deletedResume) {
            return NextResponse.json({ message: 'Resume not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Resume deleted successfully'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Delete Resume Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error: ' + (error.message || 'Unknown') },
            { status: 500 }
        );
    }
}
