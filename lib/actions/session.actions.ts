'use server';
import {StartSessionResult} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import {auth} from "@clerk/nextjs/server";

export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        await connectToDatabase();

        const { userId } = await auth();

        if (!userId || userId !== clerkId) {
            return {
                success: false,
                message: 'Unauthorized'
            };
        }

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            durationSeconds: 0,
        });

        return {
            success: true,
            sessionId: session._id.toString(),
        }
    } catch (e) {
        console.error('Error starting voice session', e);
        return {
            success: false,
            message: 'Failed to start voice session. Please try again later.'
        }
    }
}

export const endVoiceSession = async (
    sessionId: string,
    durationSeconds: number
): Promise<{ success: boolean; error?: string }> => {
    try {
        await connectToDatabase();

        const result = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds,
        });

        if (!result) return { success: false, error: 'voice session not found.' };

        return { success: true };
    } catch (e) {
        console.error('Error ending voice session', e);
        return { success: false, error: 'Failed to end voice session. Please try again later.' };
    }
}

