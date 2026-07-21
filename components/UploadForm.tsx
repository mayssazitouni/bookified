'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Image, X, Loader2 } from 'lucide-react';
import { UploadSchema } from '@/lib/zod';
import { voiceOptions, voiceCategories } from '@/lib/constants';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {useAuth} from "@clerk/nextjs";
import { toast } from 'sonner';
import {useRouter} from "next/navigation";
import {checkBookExists, createBook, saveBookSegments} from "@/lib/actions/book.actions";
import {parsePDFFile} from "@/lib/utils";
import {upload} from "@vercel/blob/client";
import { UploadFormValues } from '@/lib/zod';

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const {userId } = useAuth();
  const router = useRouter();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      pdfFile: undefined as any,
      coverImage: undefined as any,
      title: '',
      author: '',
      voice: '',

    },
  });

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      form.setValue('pdfFile', file as any);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      form.setValue('coverImage', file as any);
    }
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    form.setValue('pdfFile', undefined as any);
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
    form.setValue('coverImage', undefined as any);
  };

  const onSubmit = async (data: UploadFormValues) => {
     if(!userId){
      return  toast.error("Please sign in to upload a book")
     }
    setIsSubmitting(true);

     // posthog -> track book uploads...

    try {
      const existsCheck = await checkBookExists(data.title);
      if (existsCheck.exists && existsCheck.book) {
        toast.info("Book with same title already exists.");
        form.reset()
        router.push(`/book/${existsCheck.book.slug}`)
        return;
      }

      const fileTitle = data.title.replace(/\s+/g, '-').toLowerCase();
      const pdfFile = data.pdfFile;

      const parsedPdf = await parsePDFFile(pdfFile);

      if(parsedPdf.content.length === 0){
        toast.error("Failed to parse PDF. Please try again with a different file.");
        return;
      }

      const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        contentType: 'application/pdf'
      });

      let coverUrl: string;

      if(data.coverImage) {
        const uploadCoverBlob = await upload(`${fileTitle}_cover.png`, data.coverImage, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: data.coverImage.type,
        });
        coverUrl = uploadCoverBlob.url;
      } else {
        const response = await fetch(parsedPdf.cover)
        const blob = await response.blob();

        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: 'image/png'
        });
        coverUrl = uploadedCoverBlob.url;

      }

      const book = await createBook({
            clerkId: userId,
            title: data.title,
            author: data.author,
            voice: data.voice,
            fileURL: uploadedPdfBlob.url,
            fileBlobKey: uploadedPdfBlob.pathname,
            coverURL:coverUrl,
            fileSize: pdfFile.size
          });

      if(!book.success) throw new Error("Failed to create book");

      if(book.alreadyExists) {
              toast.info("Book with same title already exists.");
              form.reset()
              router.push(`/book/${existsCheck.book.slug}`)
              return;
          }

      const segments = await saveBookSegments(book.data._id, userId, parsedPdf.content);

      if(!segments.success) {
          toast.error("Failed to save book segments.");
          throw new Error("Failed to save book segments");
      }


       form.reset();
      router.push('/');
    }catch (error) {
      console.error(error);

      toast.error("Failed to check for existing book.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <div className="new-book-wrapper">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* PDF File Upload */}
            <FormField
              control={form.control}
              name="pdfFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">PDF File</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfChange}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label
                        htmlFor="pdf-upload"
                        className={`upload-dropzone border-2 border-dashed border-[var(--border-subtle)] ${
                          pdfFile ? 'upload-dropzone-uploaded' : ''
                        }`}
                      >
                        {pdfFile ? (
                          <div className="flex items-center justify-between w-full px-4">
                            <div className="flex items-center gap-3">
                              <Upload className="upload-dropzone-icon" />
                              <span className="upload-dropzone-text">{pdfFile.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemovePdf();
                              }}
                              className="upload-dropzone-remove"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="upload-dropzone-icon" />
                            <p className="upload-dropzone-text">Click to upload PDF</p>
                            <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image Upload */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Cover Image</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className={`upload-dropzone border-2 border-dashed border-[var(--border-subtle)] ${
                          coverImage ? 'upload-dropzone-uploaded' : ''
                        }`}
                      >
                        {coverImage ? (
                          <div className="flex items-center justify-between w-full px-4">
                            <div className="flex items-center gap-3">
                              <Image className="upload-dropzone-icon" />
                              <span className="upload-dropzone-text">{coverImage.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveCover();
                              }}
                              className="upload-dropzone-remove"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Image className="upload-dropzone-icon" />
                            <p className="upload-dropzone-text">Click to upload cover image</p>
                            <p className="upload-dropzone-hint">Leave empty to auto-generate from PDF</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Rich Dad Poor Dad"
                      className="form-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author Input */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Author Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Robert Kiyosaki"
                      className="form-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Voice Selector */}
            <FormField
              control={form.control}
              name="voice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Male Voices */}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">Male Voices</p>
                        <div className="voice-selector-options">
                          {voiceCategories.male.map((voiceKey) => (
                            <label
                              key={voiceKey}
                              className={`voice-selector-option ${
                                field.value === voiceKey
                                  ? 'voice-selector-option-selected'
                                  : 'voice-selector-option-default'
                              }`}
                            >
                              <input
                                type="radio"
                                {...field}
                                value={voiceKey}
                                className="hidden"
                              />
                              <div className="flex flex-col items-center text-center">
                                <span className="font-semibold text-base">
                                  {voiceOptions[voiceKey as keyof typeof voiceOptions].name}
                                </span>
                                <span className="text-xs text-[var(--text-muted)] mt-1">
                                  {voiceOptions[voiceKey as keyof typeof voiceOptions].description}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Female Voices */}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">Female Voices</p>
                        <div className="voice-selector-options">
                          {voiceCategories.female.map((voiceKey) => (
                            <label
                              key={voiceKey}
                              className={`voice-selector-option ${
                                field.value === voiceKey
                                  ? 'voice-selector-option-selected'
                                  : 'voice-selector-option-default'
                              }`}
                            >
                              <input
                                type="radio"
                                {...field}
                                value={voiceKey}
                                className="hidden"
                              />
                              <div className="flex flex-col items-center text-center">
                                <span className="font-semibold text-base">
                                  {voiceOptions[voiceKey as keyof typeof voiceOptions].name}
                                </span>
                                <span className="text-xs text-[var(--text-muted)] mt-1">
                                  {voiceOptions[voiceKey as keyof typeof voiceOptions].description}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="form-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Begin Synthesis'}
            </button>
          </form>
        </Form>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="loading-wrapper">
          <div className="loading-shadow-wrapper bg-white">
            <div className="loading-shadow">
              <Loader2 className="loading-animation w-12 h-12 text-[var(--color-brand)]" />
              <h3 className="loading-title">Processing Your Book</h3>
              <div className="loading-progress">
                <div className="loading-progress-item">
                  <div className="loading-progress-status"></div>
                  <span className="text-[var(--text-secondary)]">Uploading PDF...</span>
                </div>
                <div className="loading-progress-item">
                  <div className="loading-progress-status"></div>
                  <span className="text-[var(--text-secondary)]">Generating cover...</span>
                </div>
                <div className="loading-progress-item">
                  <div className="loading-progress-status"></div>
                  <span className="text-[var(--text-secondary)]">Preparing interview...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadForm;
