import mongoose, { Schema, Model } from 'mongoose';

export interface IResume {
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileUrl?: string; // If we upload to S3/Blob storage later
    parsedContent: string;
    analysisResult: {
        score: number;
        summary: string;
        strengths: string[];
        weaknesses: string[];
        improvements: string[];
    };
    createdAt: Date;
}

const ResumeSchema = new Schema<IResume>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
        },
        parsedContent: {
            type: String,
            required: true,
        },
        analysisResult: {
            score: { type: Number, required: true },
            summary: { type: String, required: true },
            strengths: [String],
            weaknesses: [String],
            improvements: [String],
        },
    },
    {
        timestamps: true,
    }
);

const Resume: Model<IResume> =
    mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);

export default Resume;
