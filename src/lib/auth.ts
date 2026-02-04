import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                try {
                    console.log("Attempting DB connection...");
                    await dbConnect();
                    const email = credentials.email.toLowerCase().trim();
                    console.log("DB Connected. finding user:", email);

                    const user = await User.findOne({ email });

                    if (!user || !user.password) {
                        console.log("User not found or no password for:", email);
                        throw new Error('No user found with this email');
                    }

                    const isMatch = await bcrypt.compare(credentials.password, user.password);

                    if (!isMatch) {
                        console.log("Password mismatch");
                        throw new Error('Incorrect password');
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        image: user.image,
                    };
                } catch (error) {
                    console.error("Auth Error:", error);
                    throw error;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            },
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin', // We will create this custom page later ideally, or rely on default for now
    },
    secret: process.env.NEXTAUTH_SECRET,
};
