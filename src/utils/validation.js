import { z } from 'zod';

// 1. Universal Name Rules: Letters, spaces, hyphens, and apostrophes only. Strictly NO numbers.
export const universalNameRegex = /^[a-zA-Z\u00C0-\u017F]+(?:\s[a-zA-Z\u00C0-\u017F]+)*$/;

// 2. Universal Email Rules:
// - Domain cannot be purely numeric (e.g., rejects @123.com, @4567.xyz)
// - Top-Level Domain (TLD) must be at least 2 letters (e.g., .com, .in) and cannot be numeric
export const numericDomainRegex = /@[0-9]+\.[a-zA-Z]{2,}$/; 
export const pureNumericUserRegex = /^[0-9]+@/; // Rejects usernames that are purely numbers (e.g., 123@...)

export const nameSchema = z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(70, { message: 'Full name is too long' })
    // Rejects "amit3 kumar", "john_doe", "test!"
    .refine((val) => universalNameRegex.test(val), {
        message: 'Name must contain only letters and a single space between names. No numbers or symbols allowed.',
    })
    // Prevents spam like "aaaaaa bbbbbb"
    .refine((val) => !/(.)\1{3,}/.test(val.replace(/\s/g, '')), {
        message: 'Name contains too many repeating characters.',
    });

export const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(5, { message: 'Email is too short' })
    .email({ message: 'Invalid email structure' })
    // Rejects "amit@123.com" or "test@888.in"
    .refine((val) => !numericDomainRegex.test(val), {
        message: 'Purely numeric domains (like 123.com) are not authorised.',
    })
    // Rejects "12345@domain.com" 
    .refine((val) => !pureNumericUserRegex.test(val), {
        message: 'Usernames consisting entirely of numbers are not authorised.',
    })
    // Rejects sequential gibberish like "abcdefg@..." or "123456@..."
    .refine((val) => {
        const username = val.split('@')[0];
        const sequentialSpam = /abcde|bcdef|cdefg|12345|23456|34567/i;
        return !sequentialSpam.test(username);
    }, { message: 'Sequential or automated email patterns are not allowed.' });

export const phoneSchema = z
    .string()
    .trim()
    .min(7, { message: 'Phone number is too short' })
    .max(20, { message: 'Phone number is too long' })
    .regex(/^[+]?[0-9\s-]{7,20}$/, { message: 'Please enter a valid phone number' });

export const passwordSchema = z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' });

// Universal schema as requested by user
export const prernaUniversalSchema = z.object({
    fullName: nameSchema,
    email: emailSchema,
});

export const registerSchema = z.object({
    name: nameSchema.optional(),
    fullName: nameSchema.optional(),
    email: emailSchema,
    phone: phoneSchema.optional().or(z.literal('')),
    password: passwordSchema,
}).refine((data) => Boolean(data.name || data.fullName), {
    message: 'Full name is required',
    path: ['name']
});

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, { message: 'Password is required' }),
});

export const updateProfileSchema = z.object({
    name: nameSchema.optional(),
    phone: phoneSchema.optional().nullable(),
    profileImage: z.string().optional().nullable(),
});
