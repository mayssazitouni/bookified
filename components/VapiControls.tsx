'use client';
import { Mic, MicOff } from "lucide-react";
import { IBook } from "@/types";
import useVapi from "@/hooks/useVapi";
import Transcript from "@/components/Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
    const { status, messages, currentMessage, currentUserMessage, duration, start, stop, clearError, isActive } =
        useVapi(book);

    return (
        /* The container limits the max width for BOTH cards so they match perfectly */
        <div className="vapi-main-container max-w-4xl mx-auto w-full space-y-6 px-4">

            {/* 1. TOP HEADER CARD */}
            <div className="vapi-header-card w-full">
                {/* Left: Book Cover with Mic Button */}
                <div className="vapi-cover-wrapper">
                    <img
                        src={book.coverURL || '/assets/book-cover.svg'}
                        alt={book.title}
                        className="vapi-cover-image"
                    />
                    <div className="vapi-mic-wrapper">
                        <div className="relative">
                            {(isActive && (status === 'speaking' || status === 'thinking')) && (
                                <div className="absolute inset-0 rounded-full bg-white animate-ping" />
                            )}
                            <button onClick={isActive ? stop : start} disabled={status === 'connecting' }
                                    className="vapi-mic-btn vapi-mic-btn-inactive shadow-md !w-[60px] !h-[60px] relative z-10">
                                {isActive ? (
                                    <Mic className="size-7 text-[#212a3b]" />
                                ) : (
                                    <MicOff className="size-7 text-[#212a3b]" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Book Info */}
                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-serif capitalize">
                        {book.title}
                    </h1>
                    <p className="text-base text-[var(--text-secondary)]">
                        by {book.author}
                    </p>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* Status Indicator */}
                        <div className="vapi-status-indicator">
                            <span className="vapi-status-dot vapi-status-dot-ready"></span>
                            <span className="vapi-status-text">Ready</span>
                        </div>

                        {/* Voice Label */}
                        <div className="vapi-status-indicator">
                            <span className="vapi-status-text">
                                Voice: {book?.persona || 'daniel'}
                            </span>
                        </div>

                        {/* Timer */}
                        <div className="vapi-status-indicator">
                            <span className="vapi-status-text">0:00/15:00</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. BOTTOM TRANSCRIPT CARD */}
            <div className="vapi-transcript-wrapper w-full">
                <Transcript
                    messages={messages}
                    currentMessage={currentMessage}
                    currentUserMessage={currentUserMessage}
                />
            </div>

        </div>
    );
};

export default VapiControls;
