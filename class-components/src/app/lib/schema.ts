import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required.' })
      .regex(/^[A-Z]/, { message: 'Name must start with a capital letter.' }),

    age: z
      .string()
      .refine((val) => val.trim() !== '' && !isNaN(parseFloat(val)), {
        message: 'Age must be a number.',
      })
      .transform(Number)
      .pipe(z.number().min(0, { message: 'Age cannot be negative.' })),

    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Invalid email address.' }),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character.',
      }),

    confirmPassword: z.string(),

    gender: z.enum(['male', 'female', 'other'], {
      message: 'Please select a gender.',
    }),

    terms: z.literal(true, {
      message: 'You must accept the Terms and Conditions.',
    }),

    picture: z
      .any()
      .refine(
        (files): files is FileList =>
          files instanceof FileList && files.length > 0,
        'Profile picture is required.'
      )
      .refine(
        (files): files is FileList => files[0].size <= MAX_FILE_SIZE,
        `Max file size is 5MB.`
      )
      .refine(
        (files): files is FileList =>
          ACCEPTED_IMAGE_TYPES.includes(files[0].type),
        'Only .jpg and .png formats are supported.'
      ),

    country: z.string().min(1, { message: 'Country is required.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export type FormValues = z.infer<typeof formSchema>;
