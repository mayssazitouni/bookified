'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const Hero = () => {
  return (
    <div className="wrapper  pb-12 mb-10 md:mb-16">
      <div className="library-hero-card">
        <div className="library-hero-content">
          {/* Left Section */}
          <div className="library-hero-text">
            <h1 className="library-hero-title">Your Library</h1>
            <p className="library-hero-description">
              Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
            </p>
            <Link href="/books/new">
              <button className="library-cta-primary">
                <Plus className="w-5 h-5" />
                Add new book
              </button>
            </Link>
          </div>

          {/* Center Section - Illustration */}
          <div className="library-hero-illustration-desktop">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books, globe, and desk lamp illustration"
              width={400}
              height={300}
              className="object-contain"
              priority
            />
          </div>

          {/* Right Section - Steps Card */}
          <div className="library-steps-card">
            <div className="space-y-4">
              <div className="library-step-item">
                <div className="library-step-number">1</div>
                <div>
                  <div className="library-step-title">Upload PDF</div>
                  <div className="library-step-description">Add your book file</div>
                </div>
              </div>
              <div className="library-step-item">
                <div className="library-step-number">2</div>
                <div>
                  <div className="library-step-title">AI Processing</div>
                  <div className="library-step-description">We analyze the content</div>
                </div>
              </div>
              <div className="library-step-item">
                <div className="library-step-number">3</div>
                <div>
                  <div className="library-step-title">Voice Chat</div>
                  <div className="library-step-description">Discuss with AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
