import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Name is required.' })
      .refine(
        (val) => {
          if (val.length === 0) return true;
          return /^[A-Z]/.test(val);
        },
        {
          message: 'Name must start with a capital letter.',
        }
      ),

    age: z
      .string()
      .trim()
      .min(1, { message: 'Age is required.' })
      .refine(
        (val) => {
          if (val.length === 0) return true;
          return !isNaN(parseFloat(val));
        },
        {
          message: 'Age must be a number.',
        }
      )
      .refine(
        (val) => {
          if (val.length === 0) return true;
          return parseFloat(val) >= 0;
        },
        {
          message: 'Age cannot be negative.',
        }
      ),

    email: z
      .string()
      .trim()
      .min(1, { message: 'Email is required.' })
      .refine(
        (val) => {
          if (val.length === 0) return true;
          return z.string().email().safeParse(val).success;
        },
        {
          message: 'Invalid email address.',
        }
      ),

    password: z
      .string()
      .min(1, { message: 'Password is required.' })
      .refine((val) => val.length === 0 || val.length >= 8, {
        message: 'Password must be at least 8 characters long.',
      })
      .refine((val) => val.length === 0 || /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter.',
      })
      .refine((val) => val.length === 0 || /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter.',
      })
      .refine((val) => val.length === 0 || /[0-9]/.test(val), {
        message: 'Password must contain at least one number.',
      })
      .refine((val) => val.length === 0 || /[^A-Za-z0-9]/.test(val), {
        message: 'Password must contain at least one special character.',
      }),

    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),

    gender: z.enum(['male', 'female', 'other'], {
      message: 'Please select a gender.',
    }),

    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms and Conditions.',
    }),

    picture: z
      .any()
      .refine(
        (files): files is FileList =>
          files instanceof FileList && files.length > 0,
        'Profile picture is required.'
      )
      .refine((files): files is FileList => {
        if (!files || files.length === 0) return true;
        return files[0].size <= MAX_FILE_SIZE;
      }, `Max file size is 5MB.`)
      .refine((files): files is FileList => {
        if (!files || files.length === 0) return true;
        return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
      }, 'Only .jpg and .png formats are supported.'),

    country: z.string().min(1, { message: 'Country is required.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export type FormValues = z.infer<typeof formSchema>;
