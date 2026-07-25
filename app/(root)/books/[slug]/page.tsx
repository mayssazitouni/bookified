import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getBookBySlug } from '@/lib/actions/book.actions';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import Link from 'next/link';
import VapiControls from "@/components/VapiControls";

interface BookPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  // 1. Await the params Promise to get the slug
  const { slug } = await params;

  // 2. Fetch the book using the unwrapped slug
  const { success, data: book } = await getBookBySlug(slug);

  if (!success || !book) {
    redirect('/');
  }

  const persona = book.voice || 'Daniel';

  return (
      <div className="book-page-container">
        {/* Floating Back Button */}
        <Link href="/" className="back-btn-floating">
          <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
        </Link>

          <VapiControls book={book} />

      </div>
  );
}