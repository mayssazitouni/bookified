✨ Introduction
Bookified is an AI-powered platform that lets you have real-time voice conversations with your books. Built with Next.js 16, Vapi, and MongoDB, it transforms PDFs into interactive entities using natural voice synthesis. Choose from custom ElevenLabs personas to chat with your library, request summaries, and view live transcripts—all wrapped in a sleek Shadcn UI with Clerk authentication.

⚙️ Tech Stack
Clerk is a comprehensive user management and authentication platform. It provides secure, pre-built components for email and social logins, enabling seamless session management and protected routes with minimal configuration.

CodeRabbit is an AI-powered code review platform that provides contextual, line-by-line feedback on pull requests. It automates the review process by identifying bugs, suggesting optimizations, and ensuring coding standards are met, significantly reducing the manual effort for developers and improving code quality.

ElevenLabs is an advanced AI audio platform providing lifelike text-to-speech. It powers the voice previews in Bookified, allowing users to hear and select from a variety of natural-sounding AI personas before starting a conversation.

MongoDB is a flexible, document-based NoSQL database designed for scalability and developer ease. Combined with Mongoose, it serves as the core storage for user libraries, book metadata, and conversation transcripts.

Next.js is a powerful React framework for building full-stack web applications. It handles the core application logic, server-side rendering, and API routes, enabling a fast and responsive interface for the Bookified platform.

Shadcn UI is a collection of re-usable, accessible components built with Tailwind CSS and Radix UI. It allows for the creation of a clean, modular, and professional-grade user interface that is easy to customize and theme.

TypeScript is a superset of JavaScript that adds static typing, providing better tooling, code quality, and error detection. It ensures the application remains maintainable and robust as the codebase scales.

Vapi is a specialized Voice AI platform that enables real-time, low-latency conversational audio. It serves as the primary engine for Bookified, allowing users to have seamless, back-and-forth verbal interactions with their uploaded content.

🔋 Features
👉 PDF Upload & Ingestion: Seamlessly upload PDF books with automated text extraction, intelligent chunking, and high-dimensional embeddings for precise context retrieval.

👉 Voice-First Conversations: Engage in natural, real-time voice dialogues with your uploaded books, allowing you to ask questions or explore complex concepts verbally via Vapi.

👉 AI Voice Personas: Choose from a variety of distinct AI personalities and hear instant high-fidelity previews powered by ElevenLabs to find the perfect reading companion.

👉 Smart Summaries & Insights: Quickly extract the essence of any chapter or request deep-dive summaries, making long-form content more accessible and digestible.

👉 Session Transcripts: Keep a complete record of every vocal interaction with auto-generated text transcripts, ensuring you never lose a key insight from your discussions.

👉 Library Management: Effortlessly organize and search through your personal uploads or the global collection with a high-performance search interface.

👉 Auth & Subscription: Secure user access via email and social login, paired with a robust billing system to manage premium features and platform subscriptions.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
