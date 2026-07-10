import { z } from 'zod';

export const UploadSchema = z.object({
  pdfFile: z.instanceof(File, { message: 'PDF file is required' })
    .refine((file) => file.type === 'application/pdf', 'Must be a PDF file')
    .refine((file) => file.size <= 50 * 1024 * 1024, 'File size must be less than 50MB'),
  coverImage: z.instanceof(File, { message: 'Cover image is required' })
    .optional()
    .refine((file) => !file || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type), 'Must be a valid image file')
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, 'Image size must be less than 10MB'),
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  author: z.string().min(1, 'Author name is required').min(2, 'Author name must be at least 2 characters'),
  voice: z.string().min(1, 'Voice selection is required'),
});

export type UploadFormValues = z.infer<typeof UploadSchema>;
