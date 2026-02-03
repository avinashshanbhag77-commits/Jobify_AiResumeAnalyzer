import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    email: string;
    name?: string;
    password?: string;
    image?: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Please provide an email for this user.'],
            unique: true,
        },
        name: {
            type: String,
        },
        password: {
            type: String,
            // Not required if using OAuth providers
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite in development hot reload
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
